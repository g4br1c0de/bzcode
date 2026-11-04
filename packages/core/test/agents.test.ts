import { describe, expect, test } from "bun:test"
import * as ArchitectAgent from "../src/agents/architect"
import * as BuilderAgent from "../src/agents/builder"
import * as ReviewerAgent from "../src/agents/reviewer"
import * as SecurityAgent from "../src/agents/security"
import * as DesignerAgent from "../src/agents/designer"
import * as QAAgent from "../src/agents/qa"

describe("Bz Code agents", () => {
  test("architect agent has correct ID", () => {
    expect(String(ArchitectAgent.ID)).toBe("architect")
    expect(String(ArchitectAgent.Name)).toBe("Architect")
    expect(ArchitectAgent.Color).toBe("#c0caf5")
  })

  test("builder agent has correct ID", () => {
    expect(String(BuilderAgent.ID)).toBe("builder")
    expect(String(BuilderAgent.Name)).toBe("Builder")
    expect(BuilderAgent.Color).toBe("#93c5fd")
  })

  test("reviewer agent has correct ID", () => {
    expect(String(ReviewerAgent.ID)).toBe("reviewer")
    expect(String(ReviewerAgent.Name)).toBe("Reviewer")
    expect(ReviewerAgent.Color).toBe("#f472b6")
  })

  test("security agent has correct ID", () => {
    expect(String(SecurityAgent.ID)).toBe("security")
    expect(String(SecurityAgent.Name)).toBe("Security")
    expect(SecurityAgent.Color).toBe("#fbbf24")
  })

  test("designer agent has correct ID", () => {
    expect(String(DesignerAgent.ID)).toBe("designer")
    expect(String(DesignerAgent.Name)).toBe("Designer")
    expect(DesignerAgent.Color).toBe("#a78bfa")
  })

  test("QA agent has correct ID", () => {
    expect(String(QAAgent.ID)).toBe("qa")
    expect(String(QAAgent.Name)).toBe("QA")
    expect(QAAgent.Color).toBe("#34d399")
  })

  test("all agents have system prompts", () => {
    expect(ArchitectAgent.AgentInfo.system).toBeTruthy()
    expect(BuilderAgent.AgentInfo.system).toBeTruthy()
    expect(ReviewerAgent.AgentInfo.system).toBeTruthy()
    expect(SecurityAgent.AgentInfo.system).toBeTruthy()
    expect(DesignerAgent.AgentInfo.system).toBeTruthy()
    expect(QAAgent.AgentInfo.system).toBeTruthy()
  })

  test("all agents have unique IDs", () => {
    const ids = new Set([
      ArchitectAgent.ID, BuilderAgent.ID, ReviewerAgent.ID,
      SecurityAgent.ID, DesignerAgent.ID, QAAgent.ID,
    ])
    expect(ids.size).toBe(6)
  })
})
