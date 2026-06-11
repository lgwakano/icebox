export class AgentLogger {
  static logEvent(event: string, details?: any) {
    if (details) {
      console.log(`[🤖 Agent] ${event}`, details);
    } else {
      console.log(`[🤖 Agent] ${event}`);
    }
  }

  static logToolCall(toolName: string, args: any) {
    console.log(`[🤖 Agent Tool Call] 🛠️ ${toolName}(${JSON.stringify(args)})`);
  }

  static logToolResult(toolName: string, result: any) {
    console.log(`[🤖 Agent Tool Result] ✅ ${toolName} returned:`, result);
  }

  static logError(error: any) {
    console.error(`[🤖 Agent Error] ❌`, error);
  }
}
