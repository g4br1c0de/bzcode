import { describe, expect, test } from "bun:test"
import { Profiles, matches, defaultProfile } from "../src/execution-profile"

describe("execution profiles", () => {
  test("default profile is auto", () => {
    expect(defaultProfile()).toEqual(Profiles.auto)
  })

  test("auto matches everything", () => {
    expect(matches("anything", Profiles.auto)).toBe(true)
    expect(matches("implement feature X", Profiles.auto)).toBe(true)
    expect(matches("security audit", Profiles.auto)).toBe(true)
  })

  test("architect matches design-related tasks", () => {
    expect(matches("design system architecture", Profiles.architect)).toBe(true)
    expect(matches("plan migration strategy", Profiles.architect)).toBe(true)
  })

  test("builder matches implementation tasks", () => {
    expect(matches("implement login feature", Profiles.builder)).toBe(true)
    expect(matches("refactor code module", Profiles.builder)).toBe(true)
  })

  test("reviewer matches review-related tasks", () => {
    expect(matches("review this code", Profiles.reviewer)).toBe(true)
    expect(matches("check for bugs", Profiles.reviewer)).toBe(true)
  })

  test("security matches security-related tasks", () => {
    expect(matches("audit authentication flow", Profiles.security)).toBe(true)
    expect(matches("fix injection vulnerability", Profiles.security)).toBe(true)
  })

  test("designer matches design-related tasks", () => {
    expect(matches("design responsive layout", Profiles.designer)).toBe(true)
    expect(matches("component structure review", Profiles.designer)).toBe(true)
  })

  test("qa matches testing tasks", () => {
    expect(matches("write unit tests for payment", Profiles.qa)).toBe(true)
    expect(matches("integration test flow", Profiles.qa)).toBe(true)
  })

  test("fast profile doesn't require reasoning", () => {
    expect(matches("quick deploy", Profiles.fast)).toBe(true)
  })

  test("fast profile doesn't include complex tasks", () => {
    expect(matches("complex multi-module refactor", Profiles.fast)).toBe(false)
  })

  test("all profiles are exported", () => {
    const names = Object.keys(Profiles)
    expect(names).toContain("auto")
    expect(names).toContain("architect")
    expect(names).toContain("builder")
    expect(names).toContain("reviewer")
    expect(names).toContain("security")
    expect(names).toContain("designer")
    expect(names).toContain("qa")
    expect(names).toContain("fast")
  })
})
