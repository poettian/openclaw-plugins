# OpenClaw Plugin SDK — Tool / Hook Plugins

Verified against openclaw source (`~/Code/ai/openclaw`) and official docs (https://docs.openclaw.ai).

See `doc/common.md` for package setup, imports, and TypeBox patterns.

---

## Registering a tool

```typescript
import { Type, type Static } from "@sinclair/typebox";

const MyParams = Type.Object({
  query: Type.String({ description: "Search query" }),
  limit: Type.Optional(Type.Number({ description: "Max results" })),
});

api.registerTool({
  name: "my_search",           // snake_case, shown to the model
  label: "My Search",          // human-readable, shown in UI — REQUIRED
  description: "Search for something.",
  parameters: MyParams,        // TypeBox TObject — NOT Zod
  async execute(toolCallId, params) {
    const { query, limit = 5 } = params as Static<typeof MyParams>;
    return {
      content: [{ type: "text", text: `Results for: ${query}` }],
      details: { query, limit },  // REQUIRED field — use null if nothing to report
    };
  },
});
```

Key constraints:
- `parameters` must be a TypeBox schema (`Type.Object({...})`). Zod schemas are **not** valid here.
- `execute` must return `{ content, details }` — `details` is required (use `null` if unused).
- `label` is required by the `AgentTool` interface.

### Optional tools

Tools with side effects or external dependencies should be opt-in:

```typescript
api.registerTool({ name: "send_email", label: "Send Email", ... }, { optional: true });
```

Users enable optional tools via their config:
```json
{ "tools": { "allow": ["send_email"] } }
```

---

## Lifecycle hooks — api.on()

Use `api.on()` for all typed lifecycle hooks. **Do not use `api.registerHook()`** for lifecycle hooks — that method is for low-level internal events and has a completely different signature (no `toolName`, returns `void`).

```typescript
api.on("before_tool_call", async (event, ctx) => {
  console.log(event.toolName, event.params);
  return { block: false }; // or omit return to allow
});
```

### All hook names (`PluginHookName`)

| Hook | When it fires | Can return |
|---|---|---|
| `before_model_resolve` | Before model is selected | override model |
| `before_prompt_build` | Before system prompt is assembled | inject context |
| `before_agent_start` | Before agent loop starts | modify params |
| `before_agent_reply` | Before reply is sent back | intercept reply |
| `llm_input` | Just before LLM API call | observe only |
| `llm_output` | Just after LLM response | observe only |
| `agent_end` | After agent loop finishes | observe only |
| `before_compaction` | Before context compaction | observe only |
| `after_compaction` | After context compaction | observe only |
| `before_reset` | Before session reset | observe only |
| `inbound_claim` | Incoming message routing | claim/reject message |
| `message_received` | Message received from channel | observe only |
| `message_sending` | Just before reply is sent to channel | `{ cancel: true }` halts |
| `message_sent` | After reply sent | observe only |
| `before_tool_call` | Before a tool executes | block or require approval |
| `after_tool_call` | After a tool executes | observe only |
| `tool_result_persist` | Before tool result is stored | mutate stored result |
| `before_message_write` | Before a message is persisted | mutate stored message |
| `session_start` | New session created | observe only |
| `session_end` | Session ending | observe only |
| `subagent_spawning` | Before subagent is launched | modify subagent params |
| `subagent_delivery_target` | Resolving subagent reply target | override target |
| `subagent_spawned` | After subagent launched | observe only |
| `subagent_ended` | After subagent finishes | observe only |
| `gateway_start` | Gateway process starting | observe only |
| `gateway_stop` | Gateway process stopping | observe only |
| `before_dispatch` | Before message is dispatched | block/modify dispatch |
| `reply_dispatch` | Reply being dispatched | modify reply |
| `before_install` | Before plugin install completes | `{ block: true }` aborts |

### Message hook caveat

`message_received`, `message_sending`, and `message_sent` are all valid hook names, but they are wired through different runtime paths:

- `message_received` is emitted by the inbound auto-reply dispatcher (`src/auto-reply/reply/dispatch-from-config.ts`) before the agent turn is processed, so channel plugins that use the common inbound dispatch path will usually trigger it.
- `message_sending` is emitted only when the reply delivery path installs the common `beforeDeliver` bridge, or when the generic outbound delivery helper (`src/infra/outbound/deliver.ts`) is used. Channel plugins that construct `createReplyDispatcherWithTyping()` directly, or pass their own `beforeDeliver`, can bypass this hook.
- `message_sent` is emitted by the generic outbound delivery helper after `sendText` / `sendPayload` / media delivery completes. Channel plugins that send replies directly from their local `deliver` callback do not automatically emit it.

If an event logger only sees `message_received` for channel-plugin replies, the hook registration is probably correct; the channel's send path is not going through the outbound helper or the default `beforeDeliver` bridge.

### before_tool_call in detail

```typescript
api.on("before_tool_call", async (event, ctx) => {
  // event.toolName   — name of the tool being called
  // event.params     — raw params passed to the tool
  // event.runId      — optional agent run ID
  // event.toolCallId — optional tool call ID

  if (event.toolName === "dangerous_op") {
    return {
      requireApproval: {
        title: "Confirm dangerous operation",
        description: `About to run with params: ${JSON.stringify(event.params)}`,
        severity: "warning",          // "info" | "warning" | "critical"
        timeoutMs: 30_000,
        timeoutBehavior: "deny",      // "allow" | "deny"
      },
    };
  }

  // Block outright:
  // return { block: true, blockReason: "not allowed" };

  // Allow (default — return nothing or { block: false }):
});
```

---

## Real example: memory-lancedb extension

Source: `~/Code/ai/openclaw/extensions/memory-lancedb/index.ts`

The most complete in-tree example of `registerTool` + TypeBox + `details`. Study it for:
- Multiple tools in one plugin
- Tool factory functions (`api.registerTool((ctx) => createTool(ctx))`)
- Structured `details` in execute results
- `buildPluginConfigSchema` with Zod
