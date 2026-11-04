import { Effect } from "effect"
import { describe, expect, test } from "bun:test"
import { route } from "../src/routing-engine"
import type { Info as ModelInfo } from "@opencode/schema/model"

const mockModel = (providerID: string, id: string, enabled = true): ModelInfo => {
  return { providerID, id, enabled } as unknown as ModelInfo
}

describe("routing-engine", () => {
  test("route returns an Effect with one entry", async () => {
    const models = [mockModel("openai", "gpt-4o"), mockModel("openrouter", "deepseek-v3")]
    const config = { mode: "auto" as const, preferredProvider: undefined, preferredProfile: "architect" }
    const entries = await Effect.runPromise(route(config, models))
    expect(entries).toHaveLength(1)
    expect(entries[0].profile).toBe("architect")
  })

  test("manual mode still resolves a model", async () => {
    const models = [mockModel("openai", "gpt-4o")]
    const config = { mode: "manual" as const, preferredProfile: "fast" }
    const entries = await Effect.runPromise(route(config, models))
    expect(entries[0].providerID).toBe("openai")
    expect(entries[0].modelID).toBe("gpt-4o")
  })

  test("fallback when no matching provider", async () => {
    const models = [mockModel("openai", "gpt-4o")]
    const config = { mode: "auto" as const, preferredProvider: "missing-provider" }
    const entries = await Effect.runPromise(route(config, models))
    expect(entries[0].profile).toBe("fallback")
  })

  test("filtering disabled models", async () => {
    const models = [
      {
        ...mockModel("openai", "gpt-4o"),
        enabled: false,
      },
      mockModel("openai", "gpt-4o-active"),
    ]
    const config = { mode: "auto" as const }
    const entries = await Effect.runPromise(route(config, models))
    expect(entries[0].modelID).toBe("gpt-4o-active")
  })

  test("empty catalog falls back gracefully", async () => {
    const entries = await Effect.runPromise(route({ mode: "auto" as const }, []))
    expect(entries).toHaveLength(1)
    expect(entries[0].providerID).toBe("*")
    expect(typeof entries[0].timestamp).toBe("number")
  })
})
