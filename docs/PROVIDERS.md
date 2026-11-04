# Bz Code — Provedores e Modelos

O Bz Code herda todo o sistema de provedores do OpenCode (catálogo, OAuth, API keys, endpoints OpenAI-compatible) e adiciona integrações locais exclusivas.

## Provedores herdados

| Capacidade | Localização | Testes |
|------------|-------------|--------|
| Catálogo de modelos | `core/src/models-dev.ts` | `core/test/catalog.test.ts` |
| Registro de provedores | `core/src/provider.ts` | `core/test/provider.test.ts` |
| Autenticação (API keys) | `core/src/credential.ts` | `core/test/credential.test.ts` |
| OAuth | `core/src/integration/oauth.ts` | `core/test/oauth.test.ts` |
| Descoberta dinâmica | `core/src/providers/*` | `core/test/discovery.test.ts` |
| Endpoints OpenAI-compatible | `core/src/provider.ts` (builtins) | `core/test/openai-compatible.test.ts` |

## Provedores locais exclusivos do Bz Code

### Ollama

- Endpoint padrão: `http://127.0.0.1:11434`
- API: `GET /api/tags` (health + lista de modelos)
- Exportados de `packages/core/src/ollama.ts`:
  - `ollamaHealthCheck(): Promise<boolean>` — servidor respondendo?
  - `ollamaListModels(): Promise<Array<{ id, name }>>` — modelos instalados
  - `ollamaStatus(): Promise<{ installed, available, models }>`
- Comportamento: timeout de 5s por requisição e degradação silenciosa (sem servidor → lista vazia, status `installed: false`).
- Testes: `packages/core/test/ollama.test.ts`

### 9Router

- Endpoint padrão: `http://127.0.0.1:20128/v1`
- API: `GET /health` (disponibilidade) e `GET /v1/models` (descoberta)
- Exportados de `packages/core/src/nine-router.ts`:
  - `defaultNineRouterConfig()` → `{ id: "nine-router", endpoint }`
  - `nineRouterIsAvailable(config)` 
  - `nineRouterDiscoverModels(config)` → `[{ id, name, type, status }]` (normalizações: `type ?? "chat"`, `status ?? "active"`)
- Comportamento: mesmo modelo de timeout/degradação do Ollama.
- Testes: `packages/core/test/nine-router.test.ts`

## Bz Routing Engine

O roteador de modelos (`packages/core/src/routing-engine.ts`) recebe `RoutingConfig` e o catálogo de modelos disponíveis e seleciona o modelo por perfil:

```ts
import { route } from "./routing-engine" // packages/core

const entries = await runEffect(route(
  { mode: "auto", preferredProvider: "*", preferredProfile: "architect" },
  availableModels,
))
// entries[0]: { profile, providerID, modelID, variant?, reason, timestamp }
```

- **Aliases de perfil**: `auto`, `architect`, `builder`, `reviewer`, `fast` (+ `security`, `designer`, `qa` dos perfis de execução).
- `profileWeight(modelID, profile)` usa dicas de palavras-chave no id do modelo (ex.: `architect|design|system` para o perfil architect) para ordenar candidatos.
- Filtro de provedor: `undefined` ou `"*"` = qualquer provedor; caso contrário, `providerID` exato.
- Fallback: quando o catálogo vazio ou sem match, `providerID: "*"` (e `modelID: ""` quando não há nenhum modelo habilitado).
- Testes: `packages/core/test/routing-engine.test.ts` (5 testes)

## Perfis de Execução

`packages/core/src/execution-profile.ts` expõe `Profiles` (auto, architect, builder, reviewer, security, designer, qa, fast), `defaultProfile()` e `matches(taskType, config)` — classificação por expressões regulares de tipo de tarefa:

| Perfil | Tipos de tarefa reconhecidos (`matches`) |
|--------|------------------------------------------|
| `auto` | sempre verdadeiro |
| `architect` | design, architecture, plan, specif…, decompos…, system, structur… |
| `builder` | implement, develop, refactor, integrate, build, code |
| `reviewer` | review, analyz…, check, audit, regress, bug, defect |
| `security` | security, auth/authz, vulnerab…, protect, data safety, inject |
| `designer` | design, ux, interface, component, layout, responsive, visual |
| `qa` | test, verif/validat…, regress, unit/integration test |
| `fast` | qualquer coisa não marcada como complexa e sem `reasoningRequired` |

- Testes: `packages/core/test/execution-profiles.test.ts`
