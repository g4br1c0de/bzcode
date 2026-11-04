import { describe, expect, test } from "bun:test"
import { ollamaHealthCheck, ollamaListModels, ollamaStatus } from "../src/ollama"

describe("ollama integration", () => {
  test("health check returns boolean", async () => {
    const health = await ollamaHealthCheck()
    expect(typeof health).toBe("boolean")
  })

  test("list models returns array", async () => {
    const models = await ollamaListModels()
    expect(Array.isArray(models)).toBe(true)
  })

  test("status returns object with models array", async () => {
    const status = await ollamaStatus()
    expect(status).toBeDefined()
    expect(Array.isArray(status.models)).toBe(true)
  })
})
