import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { PhaseExecutionError, orchestrateTask, classifyPhases, assessComplexity, type TaskPhaseRunner } from "../src/task-orchestrator"

const okRunner: TaskPhaseRunner = { run: () => Effect.succeed("phase output") }

describe("task orchestrator", () => {
  test("assesses simple complexity for short tasks", () => {
    expect(assessComplexity("add a button", "")).toBe("simple")
  })

  test("assesses medium complexity for moderate tasks", () => {
    expect(assessComplexity("implement user auth with OAuth", "")).toBe("medium")
  })

  test("assesses complex complexity for large tasks", () => {
    expect(assessComplexity("refactor entire authentication system across microservices", "")).toBe("complex")
  })

  test("classifyPhases for simple task", () => {
    const phases = classifyPhases("simple")
    expect(phases).toHaveLength(3)
    expect(phases[0].id).toBe("analyze")
    expect(phases[1].agent).toBe("builder")
    expect(phases[2].agent).toBe("qa")
  })

  test("classifyPhases for medium task", () => {
    const phases = classifyPhases("medium")
    expect(phases).toHaveLength(4)
    expect(phases[0].agent).toBe("architect")
  })

  test("classifyPhases for complex task", () => {
    const phases = classifyPhases("complex")
    expect(phases).toHaveLength(6)
    const agents = phases.map((p) => p.agent)
    expect(new Set(agents).has("security")).toBe(true)
    expect(new Set(agents).has("designer")).toBe(true)
  })

  test("orchestrateTask resolves successfully for simple task", async () => {
    const result = await Effect.runPromise(orchestrateTask({ title: "add a button", description: "change one ui element", runner: okRunner }))
    expect(result.success).toBe(true)
    expect(result.summary).toContain("button")
    expect(result.taskId).toBeTruthy()
  })

  test("orchestrateTask produces summary for completed task", async () => {
    const result = await Effect.runPromise(orchestrateTask({ title: "build authentication", description: "", runner: okRunner }))
    expect(result.success).toBe(true)
    expect(result.summary).toContain("authentication")
  })

  test("orchestrateTask runs every phase of a simple task through the runner", async () => {
    const executed: string[] = []
    const trackingRunner: TaskPhaseRunner = {
      run: (phase) => {
        executed.push(phase.id)
        return Effect.succeed(`output of ${phase.id}`)
      },
    }
    const result = await Effect.runPromise(orchestrateTask({ title: "add a button", description: "one ui element", runner: trackingRunner }))
    expect(result.success).toBe(true)
    expect(executed).toEqual(["analyze", "implement", "verify"])
  })

  test("orchestrateTask fails the task when a phase fails", async () => {
    const failingRunner: TaskPhaseRunner = { run: () => Effect.fail(new PhaseExecutionError({ phase: "implement", error: "boom" })) }
    const result = await Effect.runPromise(orchestrateTask({ title: "add a button", description: "change one ui element", runner: failingRunner }))
    expect(result.success).toBe(false)
    expect(result.validationErrors).toContain("boom")
  })
})
