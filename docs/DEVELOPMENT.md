# Bz Code — Desenvolvimento

## Toolchain (Windows)

- **Bun 1.4+** (runtime e gerenciador de pacotes)
- **Node.js 20+** para tooling que exige node (sempre prepende ao PATH: `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`)
- PowerShell não aceita `&&` — use `;` e piping com `Select-String`/`Select-Object`

## Setup

```powershell
git clone https://github.com/g4br1c0de/bzcode
cd bzcode
bun install
```

## Comandos essenciais

| Ação | Comando | Onde |
|------|---------|------|
| Instalar deps | `bun install` | raiz |
| Typecheck (canônico) | `bun run check` | raiz |
| Typecheck focal | `bun run typecheck` | `packages/<pkg>` |
| Testes | `bun test test/<file>.test.ts` | `packages/core` (nunca da raiz — guard `do-not-run-tests-from-root`) |
| Gerar SDK após mudar Protocol | `bun run generate` | `packages/client` |
| Empacotar desktop | `bun run script/pack.ts` (com `OPENCODE_CHANNEL=prod`) | `packages/desktop` |

### Verificação recomendada

1. `bun run check` na raiz (lint + typecheck completo)
2. `bun test test/routing-engine.test.ts test/agents.test.ts test/execution-profiles.test.ts test/task-orchestrator.test.ts test/nine-router.test.ts test/ollama.test.ts` em `packages/core` (38 testes das features Bz Code)
3. `bun test electron-builder.config.test.ts` em `packages/desktop` (11 testes de identidade de canais)
4. `bun test script/windows-installer.test.ts` em `packages/desktop` (apenas win32; contrato NSIS com fixtures — cada teste custa até 120s; rode só se tocar em `resources/windows/installer.nsh` ou `electron-builder.config.ts`)

## Convenções (resumo do AGENTS.md da raiz)

- Sem `.changeset`; o fluxo de release existente do fork é usado.
- Branch base/padrão: `dev`. Nomes de branch: até 3 palavras separadas por hífen, sem prefixos `feat/`.
- Dependências em runtime: `Schema → Core/Protocol → Server`; cliente nunca depende de Core/Server; `sdk` compõe tudo.
- Preferir Bun APIs (`Bun.file`), evitar `any`, evitar `try/catch` desnecessário, sem alias/star imports.
- Módulos exclusivos Bz Code (exceto `task-orchestrator.ts`) exportam funções/classes simples — sem serviços Effect/DI (decisão documentada); o Task Orchestrator é o primeiro módulo do Bz com runtime Effect.

## Módulos exclusivos do Bz Code

Localizados em `packages/core/src/`:

- `agents/{architect,builder,reviewer,security,designer,qa}.ts` — agentes especializados
- `execution-profile.ts` — perfis de execução e `matches()`
- `routing-engine.ts` — `route()`, `candidates()`, `selectBestModel()`, `profileWeight()`
- `task-orchestrator.ts` — `orchestrateTask()` (Effect), `TaskPhaseRunner`, `PhaseExecutionError`
- `nine-router.ts` — integração 9Router
- `ollama.ts` — integração Ollama

Cada um tem suíte em `packages/core/test/`. Detalhes em [ARCHITECTURE.md](ARCHITECTURE.md) e [PROVIDERS.md](PROVIDERS.md).

## Desktop

- Canais: `dev`, `beta`, `prod` (env `OPENCODE_CHANNEL`), app IDs `ai.bzcode.desktop(.dev/.beta)`.
- Configuração de empacotamento: `packages/desktop/electron-builder.config.ts` (artefatos `bzcode-desktop-<os>-<arch>.ext`, feed `https://bzcode.ai/update/api/...`).
- Metainfo Linux regenerada com `bun run script/copy-metainfo.ts` (URLs `github.com/g4br1c0de/bzcode`, homepage `bzcode.ai`).
- Nomes de dados internos upstream são mantidos (env `OPENCODE_*`, pacotes `@opencode/cli-*`, scheme `opencode://`) — apenas identidade visível ao usuário foi renomeada.
- Nota Windows: `packages/app/src/custom-elements.d.ts` era um symlink upstream; com `core.symlinks=false` o Windows o materializa como texto. O fork mantém o arquivo real (declaração duplicada de forma segura).

## CI

O CI roda `typecheck:tsc` (TypeScript oficial `@typescript/native`) além do `bun check`; quando discordarem, `tsc` é a fonte da verdade. Testes não podem rodar da raiz do repositório.
