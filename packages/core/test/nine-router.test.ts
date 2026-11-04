import { describe, expect, test } from "bun:test"
import { nineRouterIsAvailable, nineRouterDiscoverModels, defaultNineRouterConfig } from "../src/nine-router"

describe("nine router integration", () => {
  test("default config uses standard endpoint", () => {
    const config = defaultNineRouterConfig()
    expect(config.endpoint).toBe("http://127.0.0.1:20128/v1")
    expect(config.id).toBe("nine-router")
  })

  test("isAvailable returns boolean", async () => {
    const isAvailable = nineRouterIsAvailable(defaultNineRouterConfig())
    const result = await isAvailable
    expect(typeof result).toBe("boolean")
  })

  test("discoverModels returns array of models", async () => {
    const models = await nineRouterDiscoverModels(defaultNineRouterConfig())
    expect(Array.isArray(models)).toBe(true)
  })
})
