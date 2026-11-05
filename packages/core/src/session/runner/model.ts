export * as SessionRunnerModel from "./model.js"

import { makeLocationNode } from "@opencode/util/effect/app-node"
import { LanguageModel } from "@opencode/ai/effect"
import { Model } from "@opencode/schema/model"
import { Provider } from "@opencode/schema/provider"
import { Context, Effect, Layer, Schema } from "effect"
import { Agent } from "../../agent.js"
import { Profiles } from "../../execution-profile.js"
import { ModelResolver } from "../../model-resolver.js"
import { route } from "../../routing-engine.js"
import { SessionSchema } from "../schema.js"

export class ModelNotSelectedError extends Schema.TaggedError<ModelNotSelectedError>()(
  "SessionRunnerModel.ModelNotSelectedError",
  { sessionID: SessionSchema.ID },
) {
  override get message() {
    return `No model is available for session ${this.sessionID}`
  }
}

export class ModelUnavailableError extends Schema.TaggedError<ModelUnavailableError>()(
  "SessionRunnerModel.ModelUnavailableError",
  { providerID: Provider.ID, modelID: Model.ID },
) {
  override get message() {
    if (this.providerID === "azure-cognitive-services")
      return `Model unavailable: ${this.providerID}/${this.modelID}. This provider has been deprecated; use azure/${this.modelID} instead.`
    if (this.providerID === "google-vertex-anthropic")
      return `Model unavailable: ${this.providerID}/${this.modelID}. This provider has been deprecated; use google-vertex/${this.modelID} instead.`
    return `Model unavailable: ${this.providerID}/${this.modelID}`
  }
}
export type Error = ModelNotSelectedError | ModelUnavailableError | ModelResolver.Error
export type Resolved = ModelResolver.Resolved

export interface Interface {
  /** Availability is sampled lazily for each explicitly selected model resolution. */
  readonly resolve: (
    session: SessionSchema.Info,
    available: () => Effect.Effect<ReadonlyArray<Model.Info>>,
  ) => Effect.Effect<Resolved, Error>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/SessionRunnerModel") {}

/** Builds a Resolved whose catalog identity mirrors the route model. Test or embedding seam. */
export const resolved = (
  model: LanguageModel,
  options: {
    readonly capabilities: Model.Capabilities
    readonly variant?: Model.VariantID
    readonly cost: Model.Info["cost"]
    readonly limit: Model.Info["limit"]
    readonly compaction?: Provider.Compaction
    readonly transport?: Provider.Transport
  },
): Resolved => ({
  model,
  ref: Model.Ref.make({
    id: Model.ID.make(model.id),
    providerID: Provider.ID.make(model.provider),
    ...(options.variant === undefined ? {} : { variant: options.variant }),
  }),
  capabilities: options.capabilities,
  cost: options.cost,
  limit: options.limit,
  compaction: options.compaction,
  transport: options.transport,
})

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const resolver = yield* ModelResolver.Service
    const agents = yield* Agent.Service
    // The upstream default resolution either picks a model or the session has no runnable model.
    const orNotSelected = Effect.fn("SessionRunnerModel.orNotSelected")(function* (sessionID: SessionSchema.ID) {
      const resolved = yield* resolver.resolve()
      if (resolved) return resolved
      return yield* new ModelNotSelectedError({ sessionID })
    })
    return Service.of({
      resolve: Effect.fn("SessionRunnerModel.resolve")(function* (session, available) {
        // Location plugins populate and filter the catalog asynchronously during layer startup.
        if (!session.model) {
          const agent = (yield* agents.select(session.agent)).info?.model
          if (agent) {
            const preferred = (yield* available()).find(
              (model) => model.providerID === agent.providerID && model.id === agent.id,
            )
            return yield* preferred
              ? resolver.resolveModel(preferred, agent.variant)
              : orNotSelected(session.id)
          }
          // Without a pinned model, a session whose agent names a Bz execution profile gets
          // routed: the routing engine picks a matching model, and the upstream default
          // resolution is the fallback when that pick is missing from the catalog or unresolvable.
          const profile = session.agent && session.agent in Profiles ? session.agent : undefined
          if (!profile) return yield* orNotSelected(session.id)
          const catalog = yield* available()
          const routed = yield* route({ mode: "auto", preferredProfile: profile }, catalog)
          const picked = catalog.find(
            (model) => model.providerID === routed[0]?.providerID && model.id === routed[0]?.modelID,
          )
          const resolved = picked
            ? yield* resolver.resolveModel(picked).pipe(Effect.orElseSucceed(() => undefined))
            : undefined
          if (resolved) return resolved
          return yield* orNotSelected(session.id)
        }
        const selected = (yield* available()).find(
          (model) => model.providerID === session.model?.providerID && model.id === session.model.id,
        )
        if (!selected)
          return yield* new ModelUnavailableError({
            providerID: session.model.providerID,
            modelID: session.model.id,
          })
        return yield* resolver.resolveModel(selected, session.model.variant)
      }),
    })
  }),
)

export const node = makeLocationNode({ service: Service, layer, deps: [ModelResolver.node, Agent.node] })
