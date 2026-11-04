interface NineRouterModel {
  readonly id: string
  readonly name: string
  readonly type: string
  readonly status: string
}

interface NineRouterConfig {
  readonly id: string
  readonly endpoint: string
  readonly apiKey?: string
  readonly baseURL?: string
}

const DEFAULT_ENDPOINT = "http://127.0.0.1:20128/v1"

export async function nineRouterIsAvailable(config: NineRouterConfig): Promise<boolean> {
  try {
    const res = await fetch(`${config.endpoint}/health`, { signal: AbortSignal.timeout(5000) }) as any
    return typeof res.ok === "boolean" && res.ok
  } catch {
    return false
  }
}

export async function nineRouterDiscoverModels(config: NineRouterConfig): Promise<ReadonlyArray<NineRouterModel>> {
  try {
    const res = await fetch(`${config.endpoint}/v1/models`, { signal: AbortSignal.timeout(5000) }) as any
    if (!(res as any).ok) return []
    const data: any[] = await res.json()
    if (!Array.isArray(data)) return []
    return data
      .filter((m: any): m is Record<string, unknown> => m?.id != null)
      .map((m: any): NineRouterModel => ({
        id: String(m.id),
        name: String(m.name ?? m.id),
        type: String(m.type ?? "chat"),
        status: String(m.status ?? "active"),
      }))
  } catch {
    return []
  }
}

export function defaultNineRouterConfig(): NineRouterConfig {
  return { id: "nine-router", endpoint: DEFAULT_ENDPOINT }
}
