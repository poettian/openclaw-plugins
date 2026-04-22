import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { z } from "openclaw/plugin-sdk/zod";

export default definePluginEntry({
  id: "hello-tool",
  name: "Hello Tool",
  description: "A minimal tool + hook plugin template.",

  register(api) {
    // --- Tool: always available, no side effects ---
    api.registerTool({
      name: "hello_greet",
      description: "Returns a greeting for the given name.",
      parameters: z.object({
        name: z.string().describe("The name to greet."),
      }),
      async execute(_id, { name }) {
        return {
          content: [{ type: "text", text: `Hello, ${name}!` }],
        };
      },
    });

    // --- Tool: optional (has side effects / external calls) ---
    api.registerTool(
      {
        name: "hello_log",
        description: "Logs a message to the gateway console (side-effectful).",
        parameters: z.object({
          message: z.string().describe("Message to log."),
        }),
        async execute(_id, { message }) {
          console.log("[hello-tool]", message);
          return {
            content: [{ type: "text", text: `Logged: ${message}` }],
          };
        },
      },
      { optional: true },
    );

    // --- Hook: inspect every tool call before it runs ---
    api.registerHook("before_tool_call", async (ctx) => {
      // Return { block: true } to cancel, { requireApproval: true } to pause.
      // Return { block: false } (or nothing) to allow.
      console.log("[hello-tool] before_tool_call:", ctx.toolName);
      return { block: false };
    });
  },
});
