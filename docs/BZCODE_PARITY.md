# Bz Code — Paridade Funcional com o OpenCode Upstream

Esta matriz documenta todas as funcionalidades relevantes do OpenCode upstream (referência v2.2.5 do `anomalyco/opencode`), sua situação no fork e a situação após as alterações do Bz Code.

## Motor de Inteligência Artificial

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Execução de inferência | `core/src/session.ts`, `core/src/model-resolver.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/session.test.ts` |
| Streaming de respostas | `core/src/session.ts` | Modelo/runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/session-stream.test.ts` |
| Execução de tool calls | `core/src/tool.ts`, `core/src/session.ts` | Ferramenta/runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/tool.test.ts` |
| Ciclos interação modelo-ferramenta | `core/src/session.ts`, `core/src/model.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/session-loop.test.ts` |
| Contexto de conversação | `core/src/models-dev.ts`, `core/src/variant.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/models-dev.test.ts` |
| Histórico de mensagens | `schema/src/session.ts` | Storage | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/session*.test.ts` |
| Contagem de tokens | `schema/src/token-usage.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/token-usage.test.ts` |
| Gerenciamento de contexto | `core/src/models-dev.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/context-management.test.ts` |
| Compactação de contexto | `schema/src/session-event.ts` | Eventos | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/compaction.test.ts` |
| Tratamento de erros | `core/src/model-resolver.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/error-handling.test.ts` |
| Retry | `core/src/model-retry.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/retry.test.ts` |
| Interrupção de execução | `core/src/session.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/interruption.test.ts` |
| Cancelamento de tarefas | `core/src/session.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/cancel.test.ts` |
| Modelos com raciocínio estendido | `schema/src/model.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/reasoning-variants.test.ts` |
| Variantes de modelos | `core/src/variant.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/variant-selection.test.ts` |
| Prompt caching | `schema/src/provider.ts` | Config | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/cache.test.ts` |
| Anexos multimodais | `schema/src/file-diff.ts`, `core/src/image.ts` | Schema/Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/multimodal.test.ts` |
| Imagens | `core/src/image.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/image.test.ts` |

## Provedores e Modelos

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Cadastro de provedores | `core/src/provider.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/provider.test.ts` |
| Autenticação API keys | `core/src/credential.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/credential.test.ts` |
| OAuth | `core/src/integration/oauth.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/oauth.test.ts` |
| Login/Logout CLI | `cli/src/commands/handlers/auth/*` | CLI | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `cli/test/auth.test.ts` |
| Seleção de modelos | `core/src/model-resolver.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/model-resolver.test.ts` |
| Descoberta dinâmica | `core/src/providers/*` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/discovery.test.ts` |
| Catálogo de modelos | `core/src/models-dev.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/catalog.test.ts` |
| Endpoints OpenAI-compatible | `core/src/provider.ts` builtins | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/openai-compatible.test.ts` |
| Gerenciamento de credenciais | `core/src/credential.ts`, `.opencode/opencode.jsonc` | Config | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/credential-config.test.ts` |

## Agentes

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Agent primário default | `core/src/agent.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/agent-default.test.ts` |
| Explore agent | `core/src/agents/explore.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/explore-agent.test.ts` |
| Plan agent | `core/src/agents/plan.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/plan-agent.test.ts` |
| Build agent | `core/src/agents/build.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/build-agent.test.ts` |
| General agent | `core/src/agents/general.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/general-agent.test.ts` |
| Subagente alternância | `core/src/session.ts`, `core/src/agent.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/subagent-switch.test.ts` |
| Invocação por menção | `core/src/session.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mention.test.ts` |
| Prompts personalizados por agente | `core/src/agent.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/custom-prompt.test.ts` |
| Ferramentas por agente | `core/src/agent.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/per-agent-tools.test.ts` |
| Bz Architect agent | **Novo** | `packages/core/src/agents/architect.ts` | PRECISA SER IMPLEMENTADO | IMPLEMENTADO | `core/test/agents.test.ts` |
| Bz Builder agent | **Novo** | `packages/core/src/agents/builder.ts` | PRECISA SER IMPLEMENTADO | IMPLEMENTADO | `core/test/agents.test.ts` |
| Bz Reviewer agent | **Novo** | `packages/core/src/agents/reviewer.ts` | PRECISA SER IMPLEMENTADO | IMPLEMENTADO | `core/test/agents.test.ts` |
| Bz Security agent | **Novo** | `packages/core/src/agents/security.ts` | PRECISA SER IMPLEMENTADO | IMPLEMENTADO | `core/test/agents.test.ts` |
| Bz Designer agent | **Novo** | `packages/core/src/agents/designer.ts` | PRECISA SER IMPLEMENTADO | IMPLEMENTADO | `core/test/agents.test.ts` |
| Bz QA agent | **Novo** | `packages/core/src/agents/qa.ts` | PRECISA SER IMPLEMENTADO | IMPLEMENTADO | `core/test/agents.test.ts` |

## Sistema de Ferramentas

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Leitura de arquivos | `core/src/tool/fs/read.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/tool/fs.read.test.ts` |
| Edição de arquivos | `core/src/tool/fs/edit.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/tool/fs.edit.test.ts` |
| Escrita | `core/src/tool/fs/write.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/tool/fs.write.test.ts` |
| Aplicação de patches | `core/src/tool/patch.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/tool/patch.test.ts` |
| Busca textual | `core/src/ripgrep.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/rg.test.ts` |
| Busca por arquivos | `core/src/tool/grep.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/grep.test.ts` |
| Listagem de diretórios | `core/src/tool/ls.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/ls.test.ts` |
| Execução de comandos | `core/src/shell.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/shell.test.ts` |
| Terminal | `core/src/persistent-pty.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/pty.test.ts` |
| Subagentes | `core/src/agents/subagent.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/subagent-tool.test.ts` |
| LSP | `core/src/lsp.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/lsp.test.ts` |
| Web search | `core/src/websearch.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/websearch.test.ts` |
| Web fetch | `core/src/fetch.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/fetch.test.ts` |
| Skills | `core/src/skill.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/skill.test.ts` |
| Perguntas ao usuário | `schema/src/question.ts` | Schema | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/question.test.ts` |
| Todo list | `core/src/tool/todo.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/todo.test.ts` |

## Sistema de Permissões

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Allow | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-allow.test.ts` |
| Ask | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-ask.test.ts` |
| Deny | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-deny.test.ts` |
| Regras por ferramenta | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-tool-rules.test.ts` |
| Regras por agente | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-agent-rules.test.ts` |
| Regras por padrão | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-pattern.test.ts` |
| Aprovação de comando | `core/src/permission.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-command.test.ts` |
| Proteção de diretórios externos | `core/src/location.ts` | Location | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/permission-external.test.ts` |

## MCP (Model Context Protocol)

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Servidores locais | `core/src/mcp/server-local.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-local.test.ts` |
| Servidores remotos | `core/src/mcp/server-remote.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-remote.test.ts` |
| Configuração de conexões | `core/src/mcp/manager.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-config.test.ts` |
| Autenticação | `core/src/mcp/client.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-auth.test.ts` |
| Ferramentas disponibilizadas | `core/src/mcp/client.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-tools.test.ts` |
| Verificação de conexão | `core/src/mcp/health.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-health.test.ts` |
| Inicialização/Desconexão | `core/src/mcp/manager.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/mcp-lifecycle.test.ts` |

## Plugins e Extensões

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Instalação | `core/src/plugin/plugin-browser.ts`, `plugin/src/plugin.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/plugin-install.test.ts` |
| Carregamento | `core/src/plugin/registry.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/plugin-load.test.ts` |
| Configuração | `core/src/plugin/config.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/plugin-config.test.ts` |
| Hooks | `core/src/plugin/hooks.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/plugin-hooks.test.ts` |

## Skills e Instruções

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Skills | `core/src/skill.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/skill.test.ts` |
| SKILL.md | `core/src/skill.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/skill-discover.test.ts` |
| AGENTS.md | `core/src/instructions.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/instruction-discovery.test.ts` |

## LSP e Inteligência de Código

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Detecção de linguagens | `core/src/lsp.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/lsp-detect.test.ts` |
| Inicialização de servidores | `core/src/lsp.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/lsp-init.test.ts` |
| Diagnósticos | `core/src/lsp.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/lsp-diagnostics.test.ts` |
| Definições/Símbolos | `core/src/lsp.ts` | Ferramenta | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/lsp-symbols.test.ts` |
| Integração com contexto | `core/src/session.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/lsp-context.test.ts` |

## Sessões e Histórico

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Criar sessão | `core/src/session.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/session-create.test.ts` |
| Continuar sessão | `core/src/session.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/session-resume.test.ts` |
| Renomear/Excluir | `core/src/session.ts`, `cli/src/commands/handlers/session/*` | Runtime/CLI | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `cli/test/session-rename.test.ts` |
| Fork de sessão | `schema/src/session-fork.ts` | Storage | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `schema/test/session-fork.test.ts` |
| Histórico persistente | `core/src/session.ts`, schema DB | Storage | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/session-persistence.test.ts` |
| Exportação/Importação | `core/src/session.ts`, `cli/src/commands/handlers/session/export*` | Runtime/CLI | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `cli/test/session-export.test.ts` |

## Git e Gerenciamento de Alterações

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Identificação de repositórios | `core/src/repository.ts`, `core/src/vcs.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/repo-identify.test.ts` |
| Diff | `core/src/worktree.ts`, `core/src/file-mutation.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/diff.test.ts` |
| Worktrees | `core/src/worktree.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/worktree.test.ts` |

## Terminal e Execução de Comandos

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Execução integrada | `core/src/persistent-pty.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/terminal.test.ts` |
| Saída em tempo real | `core/src/shell.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/shell-output.test.ts` |
| Interrupção | `core/src/persistent-pty.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/interrupt.test.ts` |
| Shell mode | `core/src/shell.ts` | Runtime | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/shell-mode.test.ts` |

## CLI, TUI, API e Servidor

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| CLI | `cli/src/index.ts` | CLI | HERDADO E FUNCIONAL | BZ CODE | `cli/test/cli.test.ts` |
| TUI | `packages/tui/src/index.tsx` | TUI | HERDADO E FUNCIONAL | BZ CODE | `packages/tui/test/tui.test.ts` |
| Servidor local | `packages/server/src/server.ts` | Server | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `server/test/server.test.ts` |
| API HTTP | `packages/server/src/routes.ts` | Server | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `server/test/api.test.ts` |
| Attatch a servidores | `cli/src/mini-host.ts` | CLI | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `cli/test/attach.test.ts` |

## Configuração, Temas e Atalhos

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Configuração global | `core/src/config.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/config.test.ts` |
| Configuração por projeto | `core/src/config.ts` | Catalogo | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/project-config.test.ts` |
| Arquivos de configuração | `core/src/config.ts`, `.opencode/opencode.jsonc` | Config | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `core/test/config-file.test.ts` |
| Temas | `theme/*` | UI | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `theme/test/*.test.ts` |
| Atalhos | `packages/tui/src/component/keybindings.ts` | TUI | HERDADO E FUNCIONAL | INTEGRADO AO BZ CODE | `packages/tui/test/keybindings.test.ts` |

## Atualizações e Distribuição

| Nome | Componente | Localização | Situação no Fork | Situação após Alterações | Testes |
|------|-----------|-------------|-----------------|--------------------------|--------|
| Atualizador | `cli/src/services/updater.ts`, `patches/electron-updater*` | Distribuição | HERDADO E FUNCIONAL | BZ CODE | `cli/test/updater.test.ts` |
| Pacote Windows | `packages/desktop/script/pack.ts` | Distribuição | HERDADO E FUNCIONAL | BZ CODE | `packages/desktop/test/pack.test.ts` |
| Identificadores próprios | `packages/*/package.json` | Catalogo | HERDADO E FUNCIONAL | BZ CODE | `packages/*/test/metadata.test.ts` |

---

## DIFERENCIAIS EXCLUSIVOS DO BZ CODE

### Bz Routing Engine

| Nome | Componente | Localização | Situação | Testes |
|------|-----------|-------------|----------|--------|
| BzRoutingEngine | `packages/core/src/routing-engine.ts` | Catalogo | IMPLEMENTADO | `core/test/routing-engine.test.ts` |
| Alias Auto | `packages/core/src/routing-engine.ts` | Catalogo | IMPLEMENTADO | `core/test/routing-engine.test.ts` |
| Alias Architect | `packages/core/src/routing-engine.ts` | Catalogo | IMPLEMENTADO | `core/test/routing-engine.test.ts` |
| Alias Builder | `packages/core/src/routing-engine.ts` | Catalogo | IMPLEMENTADO | `core/test/routing-engine.test.ts` |
| Alias Reviewer | `packages/core/src/routing-engine.ts` | Catalogo | IMPLEMENTADO | `core/test/routing-engine.test.ts` |
| Alias Fast | `packages/core/src/routing-engine.ts` | Catalogo | IMPLEMENTADO | `core/test/routing-engine.test.ts` |

### Integração 9Router

| Nome | Componente | Localização | Situação | Testes |
|------|-----------|-------------|----------|--------|
| NineRouterProvider | `packages/core/src/nine-router.ts` | Catalogo | IMPLEMENTADO | `core/test/nine-router.test.ts` |
| NineRouter fallback chain | `packages/core/src/routing-engine.ts`, `packages/core/src/task-orchestrator.ts` | Runtime | IMPLEMENTADO | `core/test/routing-engine.test.ts` |

### Integração Ollama

| Nome | Componente | Localização | Situação | Testes |
|------|-----------|-------------|----------|--------|
| ollamaProvider | `packages/core/src/ollama.ts` | Catalogo | IMPLEMENTADO | `core/test/ollama.test.ts` |

### Perfis de Execução

| Nome | Componente | Localização | Situação | Testes |
|------|-----------|-------------|----------|--------|
| ExecutionProfile | `packages/core/src/execution-profile.ts` | Catalogo | IMPLEMENTADO | `core/test/execution-profiles.test.ts` |
| Auto profile | `packages/core/src/execution-profile.ts` | Catalogo | IMPLEMENTADO | `core/test/execution-profiles.test.ts` |
| Architect profile | `packages/core/src/execution-profile.ts` | Catalogo | IMPLEMENTADO | `core/test/execution-profiles.test.ts` |
| Builder profile | `packages/core/src/execution-profile.ts` | Catalogo | IMPLEMENTADO | `core/test/execution-profiles.test.ts` |
| Reviewer profile | `packages/core/src/execution-profile.ts` | Catalogo | IMPLEMENTADO | `core/test/execution-profiles.test.ts` |
| Fast profile | `packages/core/src/execution-profile.ts` | Catalogo | IMPLEMENTADO | `core/test/execution-profiles.test.ts` |

### Orquestração de Tarefas

| Nome | Componente | Localização | Situação | Testes |
|------|-----------|-------------|----------|--------|
| TaskOrchestrator | `packages/core/src/task-orchestrator.ts` | Runtime | IMPLEMENTADO | `core/test/task-orchestrator.test.ts` |

---

## Notas de Implementação

- Os módulos exclusivos do Bz Code (`routing-engine.ts`, `execution-profile.ts`, `nine-router.ts`, `ollama.ts` e os 6 agentes em `agents/`) exportam funções/classes simples, sem serviços Effect/DI — decisão pragmática para manter compatibilidade com o runtime herdado. `task-orchestrator.ts` foi o primeiro módulo do Bz a adotar o runtime Effect (`orchestrateTask` + `TaskPhaseRunner` + `PhaseExecutionError`).
- Desktop mantém internamente nomes de dados upstream (`OPENCODE_*` env vars, pacotes npm `@opencode/cli-*`, recurso `opencode-cli.exe`, scheme `opencode://`, arquivo `opencode.settings`, entrada legada `opencode-desktop.desktop`, fixtures de `windows-installer.test.ts`) para não quebrar o build pipeline e deep links; apenas a identidade visível ao usuário foi renomeada (Bz Code, app IDs `ai.bzcode.desktop.*`, artefatos `bzcode-desktop-*`, feed `https://bzcode.ai/update/...`).
- `packages/app/src/custom-elements.d.ts` era um symlink do upstream; com `core.symlinks=false` o Windows materializa o symlink como arquivo de texto (TS1128). O fork agora mantém o arquivo real, com a declaração duplicada de forma segura (as augmentations idênticas de `solid-js` fazem merge sem erro).
