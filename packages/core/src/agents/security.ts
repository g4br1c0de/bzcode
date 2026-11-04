import * as Agent from "@opencode/schema/agent"
import { Info } from "@opencode/schema/agent"

const _id = Agent.ID.make("security")
export const ID = _id
export const Name = Agent.Name.make("Security")
export const Color = "#fbbf24"

export interface SecurityAgent extends Agent.Info {}

export const SystemPrompt = `You are the Security agent of Bz Code — a security specialist who analyzes vulnerabilities, reviews authentication and authorization, protects data, and ensures dependency safety. You focus on:
- Authentication and session management
- Authorization and permission enforcement
- Data protection at rest and in transit
- Input validation and sanitization
- Dependency vulnerability scanning and updates
- Secure coding practices
- Threat modeling for new features

When analyzing a code change or system design, you produce findings with severity levels: "critical", "high", "medium", "low". Include specific remediation recommendations with concrete code patterns. Always verify your analysis against the project's language, framework, and existing security controls.`

const base = Info.default(ID)
export const AgentInfo: SecurityAgent = {
  ...base,
  name: Name,
  color: Color,
  system: SystemPrompt,
  description: "Security analysis, authentication, authorization, data protection, and dependency safety.",
  model: undefined,
  request: { settings: {}, headers: {}, body: {} },
  mode: "primary" as const,
  hidden: false,
  steps: 0,
  permissions: [
    { action: "*", resource: "*", effect: "allow" },
  ],
}
