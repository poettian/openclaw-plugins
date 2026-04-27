import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "event-logger",
  name: "Event Logger",
  description: "Logs message and LLM lifecycle events to console for inspection.",

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
    });

    api.on("message_sent", async (event) => {
      console.log("[event-logger] message_sent:", JSON.stringify(event, null, 2));
    });
  },
});
