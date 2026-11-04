import { describe, expect, test } from "bun:test"
import { orchestrateTask, classifyPhases, assessComplexity } from "../src/task-orchestrator"

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
    const result = await orchestrateTask("add a button", "change one ui element")
    expect(result.success).toBe(true)
    expect(result.summary).toContain("button")
    expect(result.taskId).toBeTruthy()
  })

  test("orchestrateTask produces summary for completed task", async () => {
    const result = await orchestrateTask("build authentication", "")
    expect(result.success).toBe(true)
    expect(result.summary).toContain("authentication")
  })
})
