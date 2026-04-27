# 计划：event-logger 插件

## Context

用户想观察 OpenClaw 消息流中各阶段的事件内容，以便后续做统计分析。目标是新建一个只做日志打印的插件，覆盖消息接收、LLM 调用、消息发送全链路，让用户能直观看到每个事件对象的结构和数据。

## 涉及的钩子和事件类型

| 钩子 | 类型 | 字段 |
|---|---|---|
| `message_received` | 仅观察 | `from, content, timestamp?, metadata?` |
| `llm_input` | 仅观察 | `runId, sessionId, provider, model, systemPrompt?, prompt, historyMessages, imagesCount` |
| `llm_output` | 仅观察 | `runId, sessionId, provider, model, assistantTexts, lastAssistant?, usage?` |
| `message_sending` | 可取消（不取消） | `to, content, metadata?` |
| `message_sent` | 仅观察 | `to, content, success, error?` |

## 实现步骤

### 1. 创建插件目录结构

复制 `hello-tool/` 目录结构，新建 `event-logger/`：
- `event-logger/package.json`
- `event-logger/tsconfig.json`
- `event-logger/openclaw.plugin.json`
- `event-logger/src/index.ts`

### 2. 配置文件

**`package.json`** — 修改 `name` 为 `event-logger`，`openclaw.extensions` 改为 `["dist/index.js"]`

**`openclaw.plugin.json`** — 修改：
```json
{
  "id": "event-logger",
  "name": "Event Logger",
  "description": "Logs message and LLM lifecycle events for inspection."
}
```

**`tsconfig.json`** — 与 hello-tool 相同，只需调整路径引用

### 3. 实现 `src/index.ts`

```typescript
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "event-logger",
  name: "Event Logger",
  description: "Logs message and LLM lifecycle events for inspection.",

  register(api) {
    api.on("message_received", async (event) => {
      console.log("[event-logger] message_received:", JSON.stringify(event, null, 2));
    });

    api.on("llm_input", async (event) => {
      console.log("[event-logger] llm_input:", JSON.stringify(event, null, 2));
    });

    api.on("llm_output", async (event) => {
      console.log("[event-logger] llm_output:", JSON.stringify(event, null, 2));
    });

    api.on("message_sending", async (event) => {
      console.log("[event-logger] message_sending:", JSON.stringify(event, null, 2));
      // 仅观察，不取消
    });

    api.on("message_sent", async (event) => {
      console.log("[event-logger] message_sent:", JSON.stringify(event, null, 2));
    });
  },
});
```

### 4. 注册到 workspace

检查 `pnpm-workspace.yaml`，确认是否已包含所有子目录（通常是 `packages: ['*']`），若未包含则添加 `event-logger`。

## 关键文件

- 参考：`hello-tool/src/index.ts` — 插件入口模板
- 参考：`hello-tool/package.json`、`hello-tool/tsconfig.json` — 配置模板
- 类型来源：`~/Code/ai/openclaw/src/plugins/hook-message.types.ts` — 消息钩子类型
- 类型来源：`~/Code/ai/openclaw/src/plugins/hook-types.ts` — llm_input/llm_output 类型

## 验证方式

```bash
cd event-logger
pnpm build       # 编译，检查无 TS 错误
pnpm typecheck   # 类型检查
```

编译成功后，在 OpenClaw 中安装该插件，发送一条消息，观察 gateway console 中是否打印出各钩子的事件内容。
