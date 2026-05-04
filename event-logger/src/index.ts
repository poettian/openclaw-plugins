import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "event-logger",
  name: "Event Logger",
  description: "Logs all lifecycle events (except tool calls) to console for inspection.",

  register(api) {
    api.on("before_model_resolve", async (event) => {
      console.log("[event-logger] before_model_resolve:", JSON.stringify(event, null, 2));
    });

    api.on("before_prompt_build", async (event) => {
      console.log("[event-logger] before_prompt_build:", JSON.stringify(event, null, 2));
    });

    api.on("before_agent_start", async (event) => {
      console.log("[event-logger] before_agent_start:", JSON.stringify(event, null, 2));
    });

    api.on("before_agent_reply", async (event) => {
      console.log("[event-logger] before_agent_reply:", JSON.stringify(event, null, 2));
    });

    api.on("llm_input", async (event) => {
      console.log("[event-logger] llm_input:", JSON.stringify(event, null, 2));
    });

    api.on("llm_output", async (event) => {
      console.log("[event-logger] llm_output:", JSON.stringify(event, null, 2));
    });

    api.on("agent_end", async (event) => {
      console.log("[event-logger] agent_end:", JSON.stringify(event, null, 2));
    });

    api.on("before_compaction", async (event) => {
      console.log("[event-logger] before_compaction:", JSON.stringify(event, null, 2));
    });

    api.on("after_compaction", async (event) => {
      console.log("[event-logger] after_compaction:", JSON.stringify(event, null, 2));
    });

    api.on("before_reset", async (event) => {
      console.log("[event-logger] before_reset:", JSON.stringify(event, null, 2));
    });

    api.on("inbound_claim", async (event) => {
      console.log("[event-logger] inbound_claim:", JSON.stringify(event, null, 2));
    });

    api.on("message_received", async (event) => {
      console.log("[event-logger] message_received:", JSON.stringify(event, null, 2));
    });

    api.on("message_sending", async (event) => {
      console.log("[event-logger] message_sending:", JSON.stringify(event, null, 2));
    });

    api.on("message_sent", async (event) => {
      console.log("[event-logger] message_sent:", JSON.stringify(event, null, 2));
    });

    api.on("before_message_write", (event) => {
      console.log("[event-logger] before_message_write:", JSON.stringify(event, null, 2));
    });

    api.on("session_start", async (event) => {
      console.log("[event-logger] session_start:", JSON.stringify(event, null, 2));
    });

    api.on("session_end", async (event) => {
      console.log("[event-logger] session_end:", JSON.stringify(event, null, 2));
    });

    api.on("subagent_spawning", async (event) => {
      console.log("[event-logger] subagent_spawning:", JSON.stringify(event, null, 2));
    });

    api.on("subagent_delivery_target", async (event) => {
      console.log("[event-logger] subagent_delivery_target:", JSON.stringify(event, null, 2));
    });

    api.on("subagent_spawned", async (event) => {
      console.log("[event-logger] subagent_spawned:", JSON.stringify(event, null, 2));
    });

    api.on("subagent_ended", async (event) => {
      console.log("[event-logger] subagent_ended:", JSON.stringify(event, null, 2));
    });

    api.on("gateway_start", async (event) => {
      console.log("[event-logger] gateway_start:", JSON.stringify(event, null, 2));
    });

    api.on("gateway_stop", async (event) => {
      console.log("[event-logger] gateway_stop:", JSON.stringify(event, null, 2));
    });

    api.on("before_dispatch", async (event) => {
      console.log("[event-logger] before_dispatch:", JSON.stringify(event, null, 2));
    });

    api.on("reply_dispatch", async (event) => {
      console.log("[event-logger] reply_dispatch:", JSON.stringify(event, null, 2));
    });

    api.on("before_install", async (event) => {
      console.log("[event-logger] before_install:", JSON.stringify(event, null, 2));
    });
  },
});
