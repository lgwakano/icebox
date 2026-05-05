// testAgent.ts
// Run this using: npx tsx scripts/testAgent.ts
import 'dotenv/config';
import { AgenticOrchestrator } from '../services/AgenticOrchestrator';

// Ensure we have a .env variable or allow passing it inline
// e.g., EXPO_PUBLIC_GROQ_API_KEY="gsk_..." npx tsx scripts/testAgent.ts

async function runTest() {
  console.log("=== Testing Agentic Orchestrator ===\n");
  
  if (!process.env.EXPO_PUBLIC_GROQ_API_KEY) {
    console.warn("⚠️  WARNING: EXPO_PUBLIC_GROQ_API_KEY is not set.");
    console.warn("Please run the script with your API key like so:");
    console.warn("EXPO_PUBLIC_GROQ_API_KEY=your_key npx tsx scripts/testAgent.ts");
    console.warn("\nFalling back to mock mode for demonstration...");
    
    // Simulate the orchestrator output if no key is provided
    console.log(`\n[🤖 Agent] Starting task execution for prompt: "I just bought some chicken breast, where do I put it?"`);
    console.log(`[🤖 Agent Tool Call] 🛠️ guess_item_properties({"itemName":"chicken breast"})`);
    console.log(`[SmartGuess] 🔍 Analyzing: "chicken breast"`);
    console.log(`[SmartGuess] 🏆 Best match: Meat (Score: 1)`);
    console.log(`[🤖 Agent Tool Result] ✅ guess_item_properties returned: { category: 'Meat', location: 'Fridge', shelfLifeDays: 5 }`);
    console.log(`[🤖 Agent] Task completed successfully.`);
    console.log(`\nResponse: "You should store the chicken breast in the Fridge. It has a shelf life of about 5 days."`);
    return;
  }

  const prompt = "I just bought some chicken breast, where do I put it?";
  console.log(`User Prompt: "${prompt}"\n`);
  
  const response = await AgenticOrchestrator.executeTask(prompt);
  
  console.log("\n=== Final Response ===");
  console.log("Success:", response.success);
  console.log("Message:", response.message);
}

runTest();
