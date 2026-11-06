import { Effect } from "effect"
import type { Info as ModelInfo } from "@opencode/schema/model"

export interface RouteLogEntry {
  readonly timestamp: number
  readonly profile: string
  readonly providerID: string
  readonly modelID: string
  readonly variant?: string
  readonly reason: string
}

export interface RoutingConfig {
  readonly mode: "auto" | "manual"
  readonly preferredProvider?: string
  readonly preferredVariant?: string
  readonly preferredProfile?: string
  readonly history?: ReadonlyArray<RouteLogEntry>
}

function profileWeight(modelID: string, profile: string): number {
  const lower = modelID.toLowerCase()
  switch (profile) {
    case "architect": return /architect|design|system|structur/i.test(lower) ? 1 : 2
    case "builder": return /build|develop|refactor|implement|codebase/i.test(lower) ? 1 : 2
    case "reviewer": return /review|check|audit|regress|bug|defect/i.test(lower) ? 1 : 2
    case "security": return /security|auth|protect|vulnerab|safe|inject/i.test(lower) ? 1 : 2
    case "designer": return /design|ux|component|layout|visual/i.test(lower) ? 1 : 2
    case "qa": return /test|verif|validat|regress|unit/i.test(lower) ? 1 : 2
    case "fast": return /fast|speed|lite/i.test(lower) ? 1 : 2
    default: return 3
  }
}

function fallback(available: ReadonlyArray<ModelInfo>): RouteLogEntry {
  const candidates = available.filter((m) => m.enabled !== false).slice(0, 5)
  const pick = candidates[Math.floor(Math.random() * Math.min(5, candidates.length))] ?? available[0]
  return {
    timestamp: Date.now(),
    profile: "fallback",
    providerID: pick?.providerID ?? "*",
    modelID: pick?.id ?? "",
    reason: "Fallback: no clearly optimal model found",
  }
}

export function route(config: RoutingConfig, available: ReadonlyArray<ModelInfo>): Effect.Effect<ReadonlyArray<RouteLogEntry>> {
  const selected = selectBestModel(available, config.preferredProvider, config.preferredProfile)
  return Effect.sync(() => [selected])
}

function selectBestModel(available: ReadonlyArray<ModelInfo>, preferredProvider?: string, preferredProfile?: string): RouteLogEntry {
  const filtered = candidates({ mode: "auto", preferredProvider, preferredProfile }, available)
  if (filtered.length === 0) return fallback(available)
  const best = filtered[0]
  return {
    timestamp: Date.now(),
    profile: preferredProfile ?? "auto",
    providerID: best.providerID,
    modelID: best.id,
    variant: best.variants?.[0]?.id,
    reason: `Profile ${preferredProfile ?? "auto"} matched model ${best.id}`,
  }
}

/**
 * Ranked fallback candidates for a routing configuration, best match first. The nine-router walks this
 * chain when a candidate cannot be resolved, before the upstream default model takes over.
 */
export function candidates(config: RoutingConfig, available: ReadonlyArray<ModelInfo>): ReadonlyArray<ModelInfo> {
  const prof = config.preferredProfile ?? "auto"
  return available
    .filter((m) => m.enabled !== false)
    .filter((m) => !config.preferredProvider || config.preferredProvider === "*" || m.providerID === config.preferredProvider)
    .sort((a, b) => profileWeight(a.id, prof) - profileWeight(b.id, prof))
}
