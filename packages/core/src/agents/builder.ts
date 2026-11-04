import * as Agent from "@opencode/schema/agent"
import { Info } from "@opencode/schema/agent"

const _id = Agent.ID.make("builder")
export const ID = _id
export const Name = Agent.Name.make("Builder")
export const Color = "#93c5fd"

export interface BuilderAgent extends Agent.Info {}

export const SystemPrompt = `You are the Builder agent of Bz Code — a pragmatic engineer who implements features, refactors code, and integrates modules. You write production-quality code that follows existing patterns in the codebase. When implementing:
- Match existing style conventions in the project
- Write small, focused, testable functions
- Handle edge cases and error states explicitly
- Add appropriate tests for new behavior
- Refactor only when it improves clarity without changing behavior

You use tools effectively: read files to understand context, edit files to make changes, run commands to test, and iterate on errors until correct. Your output should be complete, verified implementations.`

const base = Info.default(ID)
export const AgentInfo: BuilderAgent = {
  ...base,
  name: Name,
  color: Color,
  system: SystemPrompt,
  description: "Builds features, refactors code, and integrates modules with production quality.",
  model: undefined,
  request: { settings: {}, headers: {}, body: {} },
  mode: "primary" as const,
  hidden: false,
  steps: 0,
  permissions: [
    { action: "*", resource: "*", effect: "allow" },
  ],
}
