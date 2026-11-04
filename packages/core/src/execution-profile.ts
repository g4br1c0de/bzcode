export type ProfileID = string & { readonly __brand?: undefined }

export interface ProfileConfig {
  readonly id: ProfileID
  readonly name: string
  readonly reasoningRequired?: boolean
  readonly speedFavoring?: boolean
  readonly maxAttempts?: number
}

function profile(id: string): ProfileConfig {
  const pi = id as unknown as ProfileID
  return { id: pi, name: id }
}

export const Profiles = {
  auto: profile("auto"),
  architect: profile("architect"),
  builder: profile("builder"),
  reviewer: profile("reviewer"),
  security: profile("security"),
  designer: profile("designer"),
  qa: profile("qa"),
  fast: profile("fast"),
} as const

export type ExecutionProfileName = keyof typeof Profiles

export function defaultProfile(): ProfileConfig {
  return Profiles.auto
}

export function matches(taskType: string, config: ProfileConfig): boolean {
  if (config.id === Profiles.auto.id) return true
  const lower = taskType.toLowerCase()
  switch (config.id) {
    case Profiles.architect.id: return /design|architecture|plan|specif|decompos|system|structur/i.test(lower)
    case Profiles.builder.id: return /implement|develop|refactor|integrate|build|code/i.test(lower)
    case Profiles.reviewer.id: return /review|analyz|check|audit|regress|bug|defect/i.test(lower)
    case Profiles.security.id: return /security|auth|authz|vulnerab|protect|data.?safe|inject/i.test(lower)
    case Profiles.designer.id: return /design|ux|interface|component|layout|responsive|visual/i.test(lower)
    case Profiles.qa.id: return /test|verif|validat|regress|unit.?test|integration.?test/i.test(lower)
    case Profiles.fast.id: return !config.reasoningRequired && !lower.includes("complex")
    default: return true
  }
}
