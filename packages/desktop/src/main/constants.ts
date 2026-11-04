import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.OPENCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "Bz Code Dev",
  beta: "Bz Code Beta",
  prod: "Bz Code",
}

const appIDs: Record<string, string> = {
  dev: "ai.bzcode.desktop.dev",
  beta: "ai.bzcode.desktop.beta",
  prod: "ai.bzcode.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "Bz Code Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.bzcode.desktop.dev"
