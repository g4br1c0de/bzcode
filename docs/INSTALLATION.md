# Bz Code — Instalação

## Requisitos

- Windows x64 (prioridade), macOS ou Linux
- Node.js 20+ (desenvolvimento usa Bun 1.4+)
- Para modelos locais: [Ollama](https://ollama.com) e/ou 9Router rodando localmente

## Instalação a partir do build

### Windows (prioridade)

1. Clone o repositório:

   ```powershell
   git clone https://github.com/g4br1c0de/bzcode
   cd bzcode
   bun install
   ```

2. Empacote o desktop (canal prod, x64):

   ```powershell
   cd packages/desktop
   $env:OPENCODE_CHANNEL = "prod"
   bun run pack  # ou: bun run script/pack.ts
   ```

   O artefato é gerado como `bzcode-desktop-windows-x64.exe` (NSIS, one-click per-user). A logística de canais e IDs está em `packages/desktop/electron-builder.config.ts`.

3. O instalador NSIS:
   - Instala por canal em diretórios separados (nomeados pelo app ID), evitando que canais (`dev`/`beta`/`prod`) sobrescrevam arquivos uns dos outros — ver `resources/windows/installer.nsh`.
   - Registra o scheme `opencode://` para deep links, com o nome de protocolo "Bz Code".

### CLI (todas as plataformas)

O CLI é distribuído como `@bzcode/cli` (bin `bzcode`), dependendo de binários de plataforma `@opencode/cli-<platform>` (nomes de dados internos preservados do upstream para compatibilidade de build).

```powershell
# no repositório
bun run --cwd packages/cli bzcode --help
```

## Verificação das integrações locais

```powershell
# Ollama (http://127.0.0.1:11434)
ollama serve            # ou instale o app desktop
ollama list             # mostra os modelos que o Bz Code vai descobrir

# 9Router (http://127.0.0.1:20128/v1)
# inicie o 9Router; o Bz Code faz GET /health e /v1/models com timeout de 5s
```

Ambas as integrações degradam silenciosamente: indisponível = não listado no catálogo, sem erros na sessão.

## Desenvolvimento

Consulte [DEVELOPMENT.md](DEVELOPMENT.md) para o fluxo de desenvolvimento completo (toolchain, typecheck, testes, empacotamento dev/prod).
