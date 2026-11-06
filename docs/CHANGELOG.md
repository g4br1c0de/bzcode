# Changelog — Bz Code

Todas as mudanças relevantes deste fork são documentadas aqui. O formato segue Conventional Commits (`type(scope): summary`); releases não usam Changesets.

## [2.2.5-bz] — 2026-11-04

### feat(core): agentes especializados Bz Code

- 6 novos agentes em `packages/core/src/agents/`: Architect, Builder, Reviewer, Security, Designer, QA
- Cada agente define ID, Name, Color e SystemPrompt próprios, construído sobre `Info.default(ID)` do schema herdado
- Testes: `core/test/agents.test.ts`

### feat(core): Bz Routing Engine

- `packages/core/src/routing-engine.ts`: `route(config, available)` retorna `RouteLogEntry` com `profile`, `providerID`, `modelID`, `variant`, `reason`, `timestamp`
- Aliases de perfil: Auto, Architect, Builder, Reviewer, Fast (+ Security, Designer, Qa)
- `profileWeight()` ordena modelos por dicas de palavras-chave no id
- Filtro por provedor preferido (`undefined`/`"*"` = qualquer); fallback `providerID: "*"` em catálogo vazio
- Testes: `core/test/routing-engine.test.ts`

### feat(core): Task Orchestrator

- `packages/core/src/task-orchestrator.ts`: `orchestrateTask({ title, description, config?, runner })` via Effect (`Effect.fn`), fases sequenciais via seam `TaskPhaseRunner` (`run` → `Effect.Effect<string, PhaseExecutionError>`)
- `assessComplexity()` por dicas de palavras-chave + contagem de palavras (simple/medium/complex)
- `classifyPhases()` distribui 3–6 fases por complexidade
- Cada fase resolve o modelo antes de gerar: agente com modelo fixo → resolução direta do catálogo; agente sem fixo que nomeia perfil Bz → cadeia `candidates()` do Bz Routing Engine (fallback do Nine Router); caso contrário → modelo default do `ModelResolver`
- Falhas de fase viram `PhaseExecutionError` (`TaskOrchestrator.PhaseExecutionError`) capturadas com `Effect.catch`; task falha com `success=false` + `validationErrors`
- Testes: `core/test/task-orchestrator.test.ts`

### feat(core): integrações locais de modelos

- `packages/core/src/ollama.ts`: `ollamaHealthCheck()`, `ollamaListModels()`, `ollamaStatus()` contra `http://127.0.0.1:11434`
- `packages/core/src/nine-router.ts`: `nineRouterIsAvailable()`, `nineRouterDiscoverModels()`, `defaultNineRouterConfig()` contra `http://127.0.0.1:20128/v1`
- Ambas com timeout 5s e degradação silenciosa
- Testes: `core/test/ollama.test.ts`, `core/test/nine-router.test.ts`

### feat(core): Execution Profiles

- `packages/core/src/execution-profile.ts`: registro `Profiles` (auto, architect, builder, reviewer, security, designer, qa, fast), `defaultProfile()` e `matches(taskType, config)`
- Testes: `core/test/execution-profiles.test.ts`

### feat(branding): rebranding completo para Bz Code

- Package raiz renomeado para `bzcode`; CLI para `@bzcode/cli` (bin `bzcode`); desktop para `@bzcode/desktop`
- Desktop: app IDs `ai.bzcode.desktop(.dev/.beta)`, `APP_NAME` "Bz Code…", título das janelas/renderer, artefatos `bzcode-desktop-*`, feed `https://bzcode.ai/update/api/...`, protocolo "Bz Code" (scheme `opencode://` mantido), export de debug `bzcode-debug-*.zip`
- Root `install` script: APP=bzcode, URLs e scope `@bzcode`, banner ASCII
- Metainfo Linux regenerada (`script/copy-metainfo.ts`): developer `bzcode`, URLs `github.com/g4br1c0de/bzcode` e homepage `bzcode.ai`
- `perf/startup.bench.ts` atualizado para os novos app IDs
- Nomes de dados internos upstream preservados deliberadamente (env `OPENCODE_*`, npm `@opencode/cli-*`, recurso `opencode-cli.exe`, arquivo `opencode.settings`, entrada legada Linux, scheme `opencode://`)

### fix(app): custom-elements.d.ts quebra typecheck no Windows

- `packages/app/src/custom-elements.d.ts` era um symlink upstream para `packages/ui/src/custom-elements.d.ts`; com `core.symlinks=false` o Windows materializa como arquivo de texto (TS1128)
- Agora é um arquivo real com a declaração duplicada de forma segura (augmentations idênticas de `solid-js` fazem merge)

### docs: documentação de paridade e produto

- `docs/BZCODE_PARITY.md`: matriz completa de paridade herdado/Bz Code + notas de implementação
- Novos: `docs/ARCHITECTURE.md`, `docs/INSTALLATION.md`, `docs/PROVIDERS.md`, `docs/AGENTS.md`, `docs/DEVELOPMENT.md`, `docs/CHANGELOG.md`

### Verificação

- `bun run --cwd packages/core typecheck` ✓ (1.901 arquivos)
- `bun run --cwd packages/desktop typecheck` ✓ (2.963 arquivos)
- 38 testes das features Bz Code em `packages/core` ✓
- 11 testes de `electron-builder.config.test.ts` em `packages/desktop` ✓
