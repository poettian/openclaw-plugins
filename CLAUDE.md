# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A collection of [OpenClaw](https://docs.openclaw.ai) plugins for learning and experimentation. Each top-level subdirectory is one self-contained plugin managed as a pnpm workspace package.

## Knowledge sources — consult in this order

1. **`doc/`** — verified SDK patterns, type constraints, and gotchas from direct source inspection. Always check here first.
   - [`doc/common.md`](doc/common.md) — package setup, imports, `definePluginEntry`, config schema, TypeBox
   - [`doc/tool-hook-plugins.md`](doc/tool-hook-plugins.md) — tool registration, optional tools, lifecycle hooks
   - [`doc/channel-plugins.md`](doc/channel-plugins.md) — channel plugin patterns
   - [`doc/provider-plugins.md`](doc/provider-plugins.md) — provider plugin patterns
2. **Official docs**: https://docs.openclaw.ai — authoritative on concepts and high-level API.
3. **OpenClaw source**: `~/Code/ai/openclaw/src/plugins/` and `~/Code/ai/openclaw/extensions/` — ground truth when docs and `doc/` disagree or are incomplete.

**Write-back rule**: whenever you fill a knowledge gap by consulting the official docs or source code, add what you learned to the relevant `doc/` file before finishing the task.

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

See `doc/README.md` for SDK patterns, tool registration, hooks, and config schema.

## TypeScript setup

- `tsconfig.base.json` at root — all plugins extend it
- Each plugin has its own `tsconfig.json` pointing `outDir` to `./dist`
- Module system: `NodeNext` ESM throughout
