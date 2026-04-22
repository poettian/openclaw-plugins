# OpenClaw Plugin SDK — Channel Plugins

Channel plugins connect OpenClaw to a messaging platform (Discord, IRC, Slack, etc.).

Verified against openclaw source (`~/Code/ai/openclaw`) and official docs (https://docs.openclaw.ai).

See `doc/common.md` for package setup, imports, and TypeBox patterns.

---

## Entry point

Channel plugins use a different entry function:

```typescript
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/core";

export default defineChannelPluginEntry({
  // ...
});
```

---

<!-- Add verified patterns here as they are discovered from source or official docs -->
