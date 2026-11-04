interface OllamaModel {
  readonly id: string
  readonly name: string
  readonly size?: number
}

interface OllamaInstallStatus {
  readonly installed: boolean
  readonly available: boolean
  readonly models: ReadonlyArray<OllamaModel>
  readonly defaultModel?: string
}

const DEFAULT_ENDPOINT = "http://127.0.0.1:11434"

async function listModels(): Promise<ReadonlyArray<OllamaModel>> {
  try {
    const res = await fetch(`${DEFAULT_ENDPOINT}/api/tags`, { signal: AbortSignal.timeout(5000) }) as any
    if (!res.ok) return []
    const data: any[] = await res.json()
    return data
      .filter((m: any): m is Record<string, unknown> => m?.name != null)
      .map((m: any): OllamaModel => ({
        id: String(m.name),
        name: String(m.name),
      }))
  } catch {
    return []
  }
}

export async function ollamaHealthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${DEFAULT_ENDPOINT}/api/tags`, { signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}

export async function ollamaListModels(): Promise<ReadonlyArray<OllamaModel>> {
  return listModels()
}

export async function ollamaStatus(): Promise<OllamaInstallStatus> {
  const hc = await ollamaHealthCheck()
  return {
    installed: hc,
    available: hc,
    models: await listModels(),
  }
}
