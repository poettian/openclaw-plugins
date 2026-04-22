import { Type } from "@sinclair/typebox";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "hello-tool",
  name: "Hello Tool",
  description: "A minimal tool + hook plugin template.",

  register(api) {
    api.registerTool({
      name: "hello_greet",
      label: "Hello Greet",
      description: "Returns a greeting for the given name.",
      parameters: Type.Object({
        name: Type.String({ description: "The name to greet." }),
      }),
      async execute(_id, { name }) {
        return {
          content: [{ type: "text", text: `Hello, ${name}!` }],
          details: null,
        };
      },
    });

    api.registerTool(
      {
        name: "hello_log",
        label: "Hello Log",
        description: "Logs a message to the gateway console (side-effectful).",
        parameters: Type.Object({
          message: Type.String({ description: "Message to log." }),
        }),
        async execute(_id, { message }) {
          console.log("[hello-tool]", message);
          return {
            content: [{ type: "text", text: `Logged: ${message}` }],
            details: null,
          };
        },
      },
      { optional: true },
    );

    api.on("before_tool_call", async (event) => {
      console.log("[hello-tool] before_tool_call:", event.toolName);
      return { block: false };
    });
  },
});
