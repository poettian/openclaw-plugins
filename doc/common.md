# OpenClaw Plugin SDK — Common Patterns

Applies to all plugin types. Verified against openclaw source (`~/Code/ai/openclaw`) and official docs (https://docs.openclaw.ai).

---

## Package setup

Every plugin directory needs:

| File | Purpose |
|---|---|
| `package.json` | `type: "module"` + `openclaw` block + deps |
| `openclaw.plugin.json` | Static manifest: `id`, `name`, `description`, `configSchema` (JSON Schema) |
| `src/index.ts` | Entry — default export from `definePluginEntry(...)` |

`package.json` minimum:

```json
{
  "type": "module",
  "openclaw": {
    "extensions": ["./dist/index.js"],
    "compat": { "pluginApi": "1.0.0", "minGatewayVersion": "1.0.0" }
  },
  "dependencies": {
    "@sinclair/typebox": "^0.34.0"
  },
  "devDependencies": {
    "openclaw": "^2026.4.21"
  }
}
```

`@sinclair/typebox` must be listed as a direct dependency — tools use it at runtime.

---

## Imports

Always use focused subpaths, never the root `openclaw/plugin-sdk`.

```typescript
import { definePluginEntry, buildPluginConfigSchema } from "openclaw/plugin-sdk/plugin-entry";
import { Type, type Static } from "@sinclair/typebox";
import { z } from "openclaw/plugin-sdk/zod"; // Zod v4 — configSchema ONLY, not tool params
```

Channel plugins use a different entry:

```typescript
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/core";
```

---

## definePluginEntry

```typescript
export default definePluginEntry({
  id: "my-plugin",          // must match openclaw.plugin.json id
  name: "My Plugin",
  description: "...",
  configSchema: buildPluginConfigSchema(z.object({ apiKey: z.string() })), // optional
  register(api) {
    // register tools, hooks, providers, etc.
  },
});
```

`configSchema` is optional. If the plugin has no config, omit it (defaults to empty schema).

---

## Config schema

```typescript
import { definePluginEntry, buildPluginConfigSchema } from "openclaw/plugin-sdk/plugin-entry";
import { z } from "openclaw/plugin-sdk/zod";

export default definePluginEntry({
  id: "my-plugin",
  name: "My Plugin",
  description: "...",
  configSchema: buildPluginConfigSchema(
    z.object({
      apiKey: z.string().min(1),
      baseUrl: z.string().url().optional(),
    }),
  ),
  register(api) {
    const { apiKey, baseUrl } = api.config as { apiKey: string; baseUrl?: string };
    // ...
  },
});
```

---

## Common TypeBox patterns

```typescript
import { Type, type Static } from "@sinclair/typebox";

Type.Object({ key: Type.String() })
Type.String({ description: "..." })
Type.Number({ description: "..." })
Type.Boolean()
Type.Optional(Type.String())
Type.Array(Type.String())
Type.Union([Type.Literal("a"), Type.Literal("b")])
Type.Enum({ Read: "read", Write: "write" })   // via Type.Unsafe for string unions

// Extract the TypeScript type from a schema:
type MyParams = Static<typeof MyParamsSchema>;
```
