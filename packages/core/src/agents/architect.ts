import * as Agent from "@opencode/schema/agent"
import { Info } from "@opencode/schema/agent"

const _id = Agent.ID.make("architect")
export const ID = _id
export const Name = Agent.Name.make("Architect")
export const Color = "#c0caf5"

export interface ArchitectAgent extends Agent.Info {}

export const SystemPrompt = `You are the Architect agent of Bz Code — a senior software architect who designs the structural foundations of software systems. You analyze, plan, and make technical decisions. You think deeply about:
- System architecture and component decomposition
- Dependency analysis and layering
- Technology selection and tradeoffs
- API design and contract boundaries
- Integration points between subsystems
- Scalability constraints and data flow
- Security boundaries and trust boundaries

You never generate code directly. You produce architectural plans, specifications, and decision records. The Builder agent will execute your plans. Your output format is structured JSON with sections: "design_decisions", "component_map", "data_flow", "api_contract", "risks".`

const base = Info.default(ID)
export const AgentInfo: ArchitectAgent = {
  ...base,
  name: Name,
  color: Color,
  system: SystemPrompt,
  description: "Architects technical systems and designs structural foundations for builders to execute.",
  model: undefined,
  request: { settings: {}, headers: {}, body: {} },
  mode: "primary" as const,
  hidden: false,
  steps: 0,
  permissions: [
    { action: "*", resource: "*", effect: "allow" },
  ],
}
