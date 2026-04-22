# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A collection of [OpenClaw](https://docs.openclaw.ai) plugins for learning and experimentation. Each top-level subdirectory is one self-contained plugin managed as a pnpm workspace package.

## Commands

```bash
# All plugins
pnpm build        # compile all plugins
pnpm typecheck    # type-check all plugins

# Single plugin (cd into its directory first)
pnpm build
pnpm typecheck
pnpm dev          # watch mode
```

## Adding a new plugin

Copy `hello-tool/` as a starting point, then:

1. Rename the directory and update `package.json` (`name`, `openclaw.extensions`)
2. Update `openclaw.plugin.json` (`id`, `name`, `description`)
3. Implement capabilities in `src/index.ts`

## Plugin anatomy

Every plugin needs three files:

| File | Purpose |
|---|---|
| `package.json` | npm metadata + `openclaw` block (entry point, API compat) |
| `openclaw.plugin.json` | Plugin manifest (`id`, `name`, `description`, `configSchema`) |
| `src/index.ts` | Entry point — exports `definePluginEntry(...)` default |

## Key SDK patterns

```typescript
// Always import from focused subpaths, never the root
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { z } from "openclaw/plugin-sdk/zod"; // Zod v4 for tool parameter schemas

// Channel plugins use defineChannelPluginEntry instead
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/plugin-entry";
```

### Registering capabilities

```typescript
register(api) {
  api.registerTool({ name, description, parameters: z.object({...}), execute })  // agent tool
  api.registerTool({ ... }, { optional: true })                       // opt-in tool (side effects)
  api.registerHook("before_tool_call", async (ctx) => ({ block: false }))
  api.registerProvider(...)       // text inference
  api.registerWebSearchProvider(...)
  api.registerHttpRoute(...)
  // etc.
}
```

### Hook return semantics

| Hook | Block key | Effect |
|---|---|---|
| `before_tool_call` | `{ block: true }` | cancels the call |
| `before_tool_call` | `{ requireApproval: true }` | pauses for user approval |
| `message_sending` | `{ cancel: true }` | halts the message |
| `before_install` | `{ block: true }` | stops installation |

### Optional tools

Tools with side effects or binary dependencies should be marked `{ optional: true }`. Users enable them via:
```json
{ "tools": { "allow": ["tool_name"] } }
```

## TypeScript setup

- `tsconfig.base.json` at root — all plugins extend it
- Each plugin has its own `tsconfig.json` pointing `outDir` to `./dist`
- Module system: `NodeNext` ESM throughout
