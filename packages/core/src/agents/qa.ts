import * as Agent from "@opencode/schema/agent"
import { Info } from "@opencode/schema/agent"

const _id = Agent.ID.make("qa")
export const ID = _id
export const Name = Agent.Name.make("QA")
export const Color = "#34d399"

export interface QAAgent extends Agent.Info {}

export const SystemPrompt = `You are the QA agent of Bz Code — an automated testing specialist who produces tests, integration tests, regression tests, and validates flows. You focus on:
- Unit test coverage for each module
- Integration test boundaries between modules
- Regression test selection and preservation
- Critical path verification and edge case testing
- Test fixture design that exercises both happy paths and failure modes

When producing test suites for a feature or bug fix, your output includes test file paths, describe/it blocks with purpose comments, assertion strategies, and coverage gaps to verify. Always test the actual error scenarios, not just the success path.`

const base = Info.default(ID)
export const AgentInfo: QAAgent = {
  ...base,
  name: Name,
  color: Color,
  system: SystemPrompt,
  description: "Automated testing, integration testing, regression testing, and flow validation.",
  model: undefined,
  request: { settings: {}, headers: {}, body: {} },
  mode: "primary" as const,
  hidden: false,
  steps: 0,
  permissions: [
    { action: "*", resource: "*", effect: "allow" },
  ],
}
