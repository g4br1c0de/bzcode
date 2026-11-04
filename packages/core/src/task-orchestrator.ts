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

interface PhaseState {
  id: string
  name: string
  description: string
  agent?: string
  status: "pending" | "running" | "completed" | "failed" | "skipped"
}

export interface OrchestrationConfig {
  maxConcurrency: number
  enableValidation: boolean
  requireAuditForComplex: boolean
}

export function defaultConfig(): OrchestrationConfig {
  return { maxConcurrency: 2, enableValidation: true, requireAuditForComplex: true }
}

function assessComplexity(title: string, description: string): Complexity {
  const text = `${title} ${description}`.toLowerCase()
  const words = text.split(/\s+/).filter(Boolean).length
  const complexHints = ["entire", "system", "microservice", "architecture", "migration", "rewrite", "overhaul", "across"]
  const mediumHints = ["implement", "refactor", "integrate", "feature", "auth", "multiple", "module", "pipeline"]
  if (complexHints.some((k) => text.includes(k)) || words > 12) return "complex"
  if (mediumHints.some((k) => text.includes(k)) || words > 6) return "medium"
  return "simple"
}
export { assessComplexity }

function classifyPhases(complexity: Complexity): TaskPhase[] {
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
export { classifyPhases }

interface OrchestratedTaskState {
  id: string
  title: string
  complexity: Complexity
  completedAgents: string[]
  completedAt: number
}

interface OrchestrationFailure {
  phase: string
  error: string
}

async function executePhases(task: OrchestratedTaskState, phases: PhaseState[]): Promise<{ taskId: string; success: boolean; summary: string; validationErrors?: string[] }> {
  const failures: OrchestrationFailure[] = []
  for (const phase of phases) {
    try {
      await new Promise((r) => setTimeout(r, 500))
      phase.status = "completed"
      const agentName = phase.agent ?? phase.name
      task.completedAgents.push(agentName)
    } catch (error: any) {
      failures.push({ phase: phase.name, error: String(error?.message ?? error) })
      phase.status = "failed"
    }
  }
  task.completedAt = Date.now()
  const summary = buildSummary(task, failures)
  const success = failures.length === 0
  return {
    taskId: task.id,
    success,
    summary,
    validationErrors: success ? undefined : failures.map((f) => f.error),
  }
}

function buildSummary(task: OrchestratedTaskState, failures: OrchestrationFailure[]): string {
  const parts: string[] = []
  parts.push(`${task.title} (${task.complexity})`)
  parts.push(`Agents used: ${task.completedAgents.join(", ") || "(none)"}`)
  if (failures.length > 0) {
    parts.push(`${failures.length} failure(s): ${failures.map((f) => f.phase).join(", ")}`)
  }
  return parts.join("\n")
}

export async function orchestrateTask(
  title: string,
  description: string,
  config: OrchestrationConfig = defaultConfig(),
): Promise<{ taskId: string; success: boolean; summary: string; validationErrors?: string[] }> {
  const complexity = assessComplexity(title, description)
  const phases = classifyPhases(complexity)
  const task: OrchestratedTaskState = {
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    complexity,
    completedAgents: [],
    completedAt: 0,
  }
  return await executePhases(task, phases)
}
