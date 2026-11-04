# Bz Code — Arquitetura

Bz Code é um fork do OpenCode (v2.2.5 do `anomalyco/opencode`) transformado em produto independente. Toda a funcionalidade herdada do OpenCode é preservada; as camadas exclusivas do Bz Code adicionam roteamento inteligente, perfis de execução, agentes especializados e integrações locais de modelos.

## Visão geral dos pacotes

```
bzcode/
├─ packages/
│  ├─ schema/     # Schemas Effect (Agent, Model, Session, Provider, TokenUsage...)
│  ├─ core/       # Motor: sessões, modelos, ferramentas, + módulos exclusivos Bz Code
│  ├─ protocol/   # Protocolo HTTP/API
│  ├─ server/     # Servidor local + rotas HTTP
│  ├─ client/     # Cliente gerado (bun run generate em packages/client)
│  ├─ sdk/        # Composição Client + Core + Server
│  ├─ cli/        # CLI bzcode (binário `bzcode`)
│  ├─ tui/        # Interface de terminal (OpenTUI)
│  ├─ app/        # Aplicação web
│  ├─ desktop/    # App Electron (empacotamento Windows/macOS/Linux)
│  ├─ ui/         # Componentes UI compartilhados
│  └─ util/       # Utilidades
└─ docs/          # Esta documentação
```

### Direção de dependências em runtime

`Schema → Core ← Protocol`? Não: `Schema → Core/Protocol`, depois `Core e Protocol → Server`. O código de cliente depende apenas de `Schema` e `Protocol` (nunca `Core`/`Server`); `sdk` compõe Client, Core e Server.

## Camadas exclusivas do Bz Code (`packages/core/src/`)

Os módulos abaixo exportam funções/classes simples (sem serviços Effect/DI), decisão pragmática documentada em `docs/BZCODE_PARITY.md`:

| Módulo | Responsabilidade |
|--------|-----------------|
| `agents/architect.ts` … `agents/qa.ts` | 6 agentes especializados (Architect, Builder, Reviewer, Security, Designer, QA) com prompts de sistema próprios e cores distintas |
| `execution-profile.ts` | Registro `Profiles` (auto, architect, builder, reviewer, security, designer, qa, fast) e `matches(taskType, config)` para classificar tarefas |
| `routing-engine.ts` | `route(config, available)` → seleciona o melhor modelo por perfil (`selectBestModel` + `profileWeight`), fallback `providerID: "*"` quando o catálogo está vazio ou nenhum provedor casa |
| `task-orchestrator.ts` | `orchestrateTask(title, description)` → avalia complexidade (`assessComplexity` por dicas de palavras-chave + contagem), classifica fases (`classifyPhases`) e executa fases atribuídas a agentes |
| `nine-router.ts` | Integração com 9Router local (`http://127.0.0.1:20128/v1`): `nineRouterIsAvailable`, `nineRouterDiscoverModels`, `defaultNineRouterConfig` |
| `ollama.ts` | Integração com Ollama local (`http://127.0.0.1:11434`): `ollamaHealthCheck`, `ollamaListModels`, `ollamaStatus` |

### Fluxo de roteamento

```
Tarefa ──> assessComplexity ──> classifyPhases ──> executePhases
        │                                            │
        └──> Profiles.matches ──> route(config, model catalog)
                                   ├── profileWeight(modelID, profile)
                                   ├── filtro por provedor preferido ("*" = qualquer)
                                   └── fallback() quando não há match ótimo
```

## Identidade de produto

- Package raiz: `bzcode`; CLI: `@bzcode/cli` com bin `bzcode`; Desktop: `@bzcode/desktop`.
- App IDs desktop: `ai.bzcode.desktop(.dev/.beta)`; artefatos `bzcode-desktop-<os>-<arch>.ext`; feed de atualização `https://bzcode.ai/update/api/<channel>/desktop/bzcode/`.
- Nomes de dados internos upstream são preservados deliberadamente para não quebrar o pipeline: env `OPENCODE_*`, pacotes `@opencode/cli-*`, recurso `opencode-cli.exe`, scheme `opencode://`, arquivo `opencode.settings`, entrada legada Linux `opencode-desktop.desktop`.

## Requisições externas

- 9Router: `GET /health` e `GET /v1/models` no endpoint configurado (timeout 5s, degradação silenciosa).
- Ollama: `GET /api/tags` (timeout 5s, degradação silenciosa).

## Testes

- 6 suítes novas em `packages/core/test/` (38 testes): `agents.test.ts`, `routing-engine.test.ts`, `execution-profiles.test.ts`, `task-orchestrator.test.ts`, `nine-router.test.ts`, `ollama.test.ts`.
- Suítes de contract de desktop: `packages/desktop/electron-builder.config.test.ts` (identidade de canais) e `script/windows-installer.test.ts` (contrato NSIS, win32).
