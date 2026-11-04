# Bz Code — Agentes

Além dos agentes herdados do OpenCode (Build, Plan, Explore, General), o Bz Code adiciona 6 agentes especializados em `packages/core/src/agents/`.

## Agentes exclusivos do Bz Code

| Agente | Arquivo | Cor | Papel |
|--------|---------|-----|-------|
| Architect | `agents/architect.ts` | `#c0caf5` | Arquitetura de sistemas: decomposição, dependências, camadas, tradeoffs, API contracts. Não gera código — produz planos e decision records |
| Builder | `agents/builder.ts` | `#93c5fd` | Implementação: escreve e refatora código executando os planos do Architect |
| Reviewer | `agents/reviewer.ts` | `#f472b6` | Revisão de código: qualidade, regressões, bugs |
| Security | `agents/security.ts` | `#fbbf24` | Segurança: boundaries, vulnerabilidades, autenticação/autorização |
| Designer | `agents/designer.ts` | `#a78bfa` | UX/UI: interfaces, componentes, layout, responsividade |
| QA | `agents/qa.ts` | `#34d399` | Verificação: testes, validação, regressão |

### Estrutura de um agente

Todos seguem o mesmo formato (exemplo `architect.ts`):

```ts
import * as Agent from "@opencode/schema/agent"
import { Info } from "@opencode/schema/agent"

const _id = Agent.ID.make("architect")
export const ID = _id
export const Name = Agent.Name.make("Architect")
export const Color = "#c0caf5"

export const SystemPrompt = `You are the Architect agent of Bz Code — ...`

// Info do agente construído com Info.default(ID) + defaults do schema
```

- IDs: `architect`, `builder`, `reviewer`, `security`, `designer`, `qa`
- Names: `Architect`, `Builder`, `Reviewer`, `Security`, `Designer`, `QA`
- Cada prompt de sistema define o output esperado (por exemplo, o Architect produz JSON estruturado com `design_decisions`, `component_map`, `data_flow`, `api_contract`, `risks`).
- Testes: `packages/core/test/agents.test.ts` (6 testes de identidade)

## Agentes herdados

| Agente | Arquivo | Descrição |
|--------|---------|-----------|
| Build | `core/src/agents/build.ts` | Agente primário de desenvolvimento |
| Plan | `core/src/agents/plan.ts` | Planejamento antes da execução |
| Explore | `core/src/agents/explore.ts` | Exploração de codebase |
| General | `core/src/agents/general.ts` | Propósito geral |

A alternância de subagentes, a invocação por menção, prompts personalizados e ferramentas por agente continuam funcionando como no upstream (ver matriz em `docs/BZCODE_PARITY.md`).

## Integração com o Task Orchestrator

`packages/core/src/task-orchestrator.ts` distribui fases de uma tarefa entre os agentes conforme a complexidade (`assessComplexity`):

- **simple** (3 fases): análise → builder → qa
- **medium** (4 fases): começa com architect
- **complex** (6 fases): inclui security e designer

Dicas de complexidade: palavras-chave (`entire/system/microservice/architecture/migration/rewrite/overhaul/across` = complex; `implement/refactor/integrate/auth/…` = medium) e contagem de palavras (>12 = complex, >6 = medium).

- Testes: `packages/core/test/task-orchestrator.test.ts` (8 testes)
