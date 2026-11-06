import { Effect, Option, Schema } from "effect"
import { ai, LLMClient } from "@opencode/ai/effect"
import { Agent } from "./agent.js"
import { Model } from "./model.js"
import { ModelResolver } from "./model-resolver.js"
import { Profiles } from "./execution-profile.js"
import { candidates } from "./routing-engine.js"
import { ModelRetry } from "./model-retry.js"

export interface TaskPhase {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly agent?: string
  readonly status: "pending" | "running" | "completed" | "failed" | "skipped"
}

export interface OrchestrationResult {
  readonly taskId: string
  readonly success: boolean
  readonly summary: string
  readonly mergedOutputs?: string
  readonly validationErrors?: string[]
}

type Complexity = "simple" | "medium" | "complex"

export interface OrchestrationConfig {
  maxConcurrency: number
  enableValidation: boolean
  requireAuditForComplex: boolean
}

export function defaultConfig(): OrchestrationConfig {
  return { maxConcurrency: 2, enableValidation: true, requireAuditForComplex: true }
}

export function assessComplexity(title: string, description: string): Complexity {
  const text = `${title} ${description}`.toLowerCase()
  const words = text.split(/\s+/).filter(Boolean).length
  const complexHints = ["entire", "system", "microservice", "architecture", "migration", "rewrite", "overhaul", "across"]
  const mediumHints = ["implement", "refactor", "integrate", "feature", "auth", "multiple", "module", "pipeline"]
  if (complexHints.some((k) => text.includes(k)) || words > 12) return "complex"
  if (mediumHints.some((k) => text.includes(k)) || words > 6) return "medium"
  return "simple"
}

export function classifyPhases(complexity: Complexity): TaskPhase[] {
  const phases: TaskPhase[] = []
  switch (complexity) {
    case "simple":
      phases.push({ id: "analyze", name: "Analyze Files", description: "Survey project structure and identify relevant files.", status: "pending" })
      phases.push({ id: "implement", name: "Implement", description: "Write the requested code change.", agent: "builder", status: "pending" })
      phases.push({ id: "verify", name: "Run Tests", description: "Execute test suite to verify changes.", agent: "qa", status: "pending" })
      break
    case "medium":
      phases.push({ id: "plan", name: "Plan Design", description: "Architectural analysis and design decisions.", agent: "architect", status: "pending" })
      phases.push({ id: "implement", name: "Implement Features", description: "Code changes following the plan.", agent: "builder", status: "pending" })
      phases.push({ id: "review", name: "Code Review", description: "Quality and consistency check.", agent: "reviewer", status: "pending" })
      phases.push({ id: "verify", name: "Run Tests", description: "Test suite execution.", agent: "qa", status: "pending" })
      break
    case "complex":
      phases.push({ id: "audit", name: "Security Audit", description: "Security vulnerability assessment of the proposed change.", agent: "security", status: "pending" })
      phases.push({ id: "design", name: "UX Review", description: "Interface and interaction design quality.", agent: "designer", status: "pending" })
      phases.push({ id: "plan", name: "Plan Architecture", description: "System architecture decisions.", agent: "architect", status: "pending" })
      phases.push({ id: "implement", name: "Implement", description: "Complete code integration.", agent: "builder", status: "pending" })
      phases.push({ id: "review", name: "Review Changes", description: "Consistency and correctness review.", agent: "reviewer", status: "pending" })
      phases.push({ id: "verify", name: "Run Tests", description: "Full test execution.", agent: "qa", status: "pending" })
      break
  }
  return phases
}

export class PhaseExecutionError extends Schema.TaggedError<PhaseExecutionError>()(
  "TaskOrchestrator.PhaseExecutionError",
  { phase: Schema.String, error: Schema.String },
) {
  override get message() {
    return `Phase ${this.phase} failed: ${this.error}`
  }
}

export interface TaskContext {
  readonly taskId: string
  readonly title: string
  readonly description: string
}

export interface TaskPhaseRunner {
  readonly run: (phase: TaskPhase, context: TaskContext) => Effect.Effect<string, PhaseExecutionError>
}

interface PhaseState {
  id: string
  name: string
  description: string
  agent?: string
  status: TaskPhase["status"]
}

export const executePhase = Effect.fn("TaskOrchestrator.executePhase")(function* (phase: TaskPhase, context: TaskContext) {
  const llm = yield* LLMClient.Service
  const agents = yield* Agent.Service
  const models = yield* Model.Service
  const resolver = yield* ModelResolver.Service
  const retry = ModelRetry.retry

  const agentID = phase.agent === undefined ? undefined : Agent.ID.make(phase.agent)
  const agent = agentID === undefined ? undefined : (yield* agents.get(agentID).pipe(Effect.option)).pipe(Option.getOrUndefined)

  let resolved: ModelResolver.Resolved | undefined
  const agentModel = agent?.model
  if (agentModel) {
    // Phase agents may pin a model, which resolves from the catalog like any session selection.
    const preferred = (yield* models.available()).find((model) => model.providerID === agentModel.providerID && model.id === agentModel.id)
    resolved = preferred ? yield* resolver.resolveModel(preferred, agentModel.variant) : undefined
  } else if (agentID !== undefined && agentID in Profiles) {
    // Unpinned phase agents name a Bz execution profile, so the routing engine ranks the candidates and the
    // nine-router walks the chain until one phase candidate resolves.
    const catalog = yield* models.available()
    const chain = candidates({ mode: "auto", preferredProfile: agentID }, catalog)
    for (const candidate of chain) {
      const resolvedCandidate = yield* resolver.resolveModel(candidate).pipe(Effect.orElseSucceed(() => undefined))
      if (resolvedCandidate) {
        resolved = resolvedCandidate
        break
      }
    }
  } else {
    resolved = yield* resolver.resolve()
  }

  if (resolved === undefined) return yield* new PhaseExecutionError({ phase: phase.id, error: `No model available for phase ${phase.id}` })

  const system = agent?.system ?? "You are an autonomous task phase executor."
  const prompt = [
    `Task: ${context.title}`,
    context.description.length > 0 ? `Description: ${context.description}` : undefined,
    `Phase: ${phase.name} (${phase.id})`,
    phase.description,
    "Complete this orchestration phase and report the outcome.",
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n")

  const response = yield* llm.generate(ai.request({ model: resolved.model, system, prompt })).pipe(retry)
  return response.text
})
export const orchestrateTask = Effect.fn("TaskOrchestrator.orchestrateTask")(function* (input: {
  readonly title: string
  readonly description: string
  readonly config?: OrchestrationConfig
  readonly runner: TaskPhaseRunner
}) {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const task = {
    id: taskId,
    title: input.title,
    complexity: assessComplexity(input.title, input.description),
    completedAgents: [] as string[],
    completedAt: 0,
  }
  const phases: PhaseState[] = classifyPhases(task.complexity).map((phase) => ({
    id: phase.id,
    name: phase.name,
    description: phase.description,
    agent: phase.agent,
    status: "pending",
  }))
  const failures: { phase: string; error: string }[] = []
  for (const phase of phases) {
    phase.status = "running"
    const context: TaskContext = { taskId, title: task.title, description: input.description }
    let phaseError: PhaseExecutionError | undefined
    yield* input.runner.run(phase, context).pipe(
      Effect.catch((error: PhaseExecutionError) => {
        phaseError = error
        return Effect.succeed(error.error)
      }),
    )
    if (phaseError !== undefined) {
      phase.status = "failed"
      failures.push({ phase: phase.name, error: phaseError.error })
    } else {
      phase.status = "completed"
      task.completedAgents.push(phase.agent ?? phase.name)
    }
  }
  task.completedAt = Date.now()
  const summary = buildSummary(task, failures)
  const success = failures.length === 0
  return { taskId, success, summary, validationErrors: success ? undefined : failures.map((failure) => failure.error) }
})

function buildSummary(task: { title: string; complexity: Complexity; completedAgents: string[] }, failures: { phase: string; error: string }[]): string {
  const parts: string[] = []
  parts.push(`${task.title} (${task.complexity})`)
  parts.push(`Agents used: ${task.completedAgents.join(", ") || "(none)"}`)
  if (failures.length > 0) {
    parts.push(`${failures.length} failure(s): ${failures.map((failure) => failure.phase).join(", ")}`)
  }
  return parts.join("\n")
}
