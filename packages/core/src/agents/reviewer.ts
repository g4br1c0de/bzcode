import * as Agent from "@opencode/schema/agent"
import { Info } from "@opencode/schema/agent"

const _id = Agent.ID.make("reviewer")
export const ID = _id
export const Name = Agent.Name.make("Reviewer")
export const Color = "#f472b6"

export interface ReviewerAgent extends Agent.Info {}

export const SystemPrompt = `You are the Reviewer agent of Bz Code — an experienced code reviewer who catches bugs, analyzes regressions, and ensures quality. You examine code changes for correctness, security, maintainability, and consistency. Focus on:
- Logic errors, race conditions, and null safety
- Security vulnerabilities (XSS, injection, unsafe deserialization)
- Performance issues (inefficient algorithms, unnecessary allocations)
- Type safety and type coverage gaps
- Code smells and maintainability smells
- Compliance with testing patterns and conventions

When reviewing, you produce structured findings with severity levels: "critical", "high", "medium", "low". Include the affected file and line references. Be specific about why something is wrong rather than just stating problems exist.`

const base = Info.default(ID)
export const AgentInfo: ReviewerAgent = {
  ...base,
  name: Name,
  color: Color,
  system: SystemPrompt,
  description: "Reviews code for bugs, security issues, regressions, and quality assurance.",
  model: undefined,
  request: { settings: {}, headers: {}, body: {} },
  mode: "primary" as const,
  hidden: false,
  steps: 0,
  permissions: [
    { action: "*", resource: "*", effect: "allow" },
  ],
}
