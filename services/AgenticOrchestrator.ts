import { AgentLogger } from './AgentLogger';
import { agentSkills } from './agentSkills';
import { guessItemProperties } from './SmartGuess';
import uuid from 'react-native-uuid';
import { addDays } from 'date-fns';
import { FoodItem } from '../constants/types';

export interface AgentResponse {
  message: string;
  success: boolean;
}

export interface ActionContext {
  addItem?: (item: FoodItem) => void;
}

export class AgenticOrchestrator {
  private static getApiKey(): string {
    // We expect the user to provide an EXPO_PUBLIC_LLM_API_KEY
    const key = process.env.EXPO_PUBLIC_LLM_API_KEY;
    if (!key) {
      throw new Error("Missing EXPO_PUBLIC_LLM_API_KEY environment variable. Please add it to your .env file.");
    }
    return key;
  }

  /**
   * Executes a task using the Agentic workflow.
   * @param userPrompt The instruction from the user (e.g., "I bought milk")
   * @param context The UI context functions (e.g., addItem)
   * @returns A final natural language response from the AI.
   */
  static async executeTask(userPrompt: string, context?: ActionContext): Promise<AgentResponse> {
    AgentLogger.logEvent(`Starting task execution for prompt: "${userPrompt}"`);
    
    let apiKey: string;
    try {
      apiKey = this.getApiKey();
    } catch (e: any) {
      AgentLogger.logError(e.message);
      return { message: "Error: API key is not configured.", success: false };
    }

    const messages = [
      {
        role: "system",
        content: "You are a smart inventory assistant for the Icebox app. Your job is to help the user manage their food inventory. Use the tools provided to look up information or perform actions. If a user tells you they bought something, you should FIRST use the guess_item_properties tool to figure out how to store it, and THEN use the add_item_to_inventory tool to add it to their fridge. Finally, give them a helpful summary of what you did."
      },
      {
        role: "user",
        content: userPrompt
      }
    ];

    try {
      AgentLogger.logEvent("Sending initial request to LLM...");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Using Groq's super fast, free LLaMA 3 model
          messages: messages,
          tools: agentSkills,
          tool_choice: "auto"
        })
      });

      if (!response.ok) {
        const err = await response.text();
        AgentLogger.logError(`LLM API Error: ${response.status} - ${err}`);
        return { message: "Sorry, I had trouble communicating with the brain.", success: false };
      }

      const data = await response.json();
      const responseMessage = data.choices[0].message;

      // Check if the LLM wants to call a tool
      if (responseMessage.tool_calls) {
        AgentLogger.logEvent(`LLM decided to call ${responseMessage.tool_calls.length} tools.`);
        
        // Append the assistant's message (which contains the tool calls) to the conversation
        messages.push(responseMessage);

        // Execute all requested tool calls
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          AgentLogger.logToolCall(functionName, functionArgs);

          let functionResult: any;

          if (functionName === 'guess_item_properties') {
            const result = await guessItemProperties(functionArgs.itemName);
            functionResult = result || { error: "Could not guess properties" };
          } else if (functionName === 'add_item_to_inventory') {
            if (context && context.addItem) {
              const now = new Date();
              const expiryDate = addDays(now, functionArgs.shelfLifeDays || 7);
              
              const newItem: FoodItem = {
                id: uuid.v4() as string,
                name: functionArgs.name,
                quantity: functionArgs.quantity || 1,
                category: functionArgs.category || 'General',
                location: functionArgs.location || 'Fridge',
                expiryDate: expiryDate.toISOString(),
                dateAdded: now.toISOString(),
                scanned: false
              };
              
              context.addItem(newItem);
              functionResult = { success: true, message: `Added ${functionArgs.quantity}x ${functionArgs.name} to ${functionArgs.location}.` };
            } else {
              functionResult = { error: "UI Context 'addItem' not provided. Item was not added." };
            }
          } else {
            functionResult = { error: "Unknown tool called" };
          }

          AgentLogger.logToolResult(functionName, functionResult);

          // Append the tool result back to the conversation
          messages.push({
            role: "tool",
            // @ts-ignore
            tool_call_id: toolCall.id,
            // @ts-ignore
            name: functionName,
            content: JSON.stringify(functionResult)
          });
        }

        // Send the results back to the LLM to get the final natural language answer
        AgentLogger.logEvent("Sending tool results back to LLM for final answer...");
        const finalResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages
          })
        });

        if (!finalResponse.ok) {
          throw new Error(`Second LLM API Error: ${finalResponse.status}`);
        }

        const finalData = await finalResponse.json();
        const finalMessage = finalData.choices[0].message.content;

        AgentLogger.logEvent("Task completed successfully.");
        return { message: finalMessage, success: true };
      } else {
        // The LLM didn't call any tools, it just answered directly
        AgentLogger.logEvent("No tools called. Task completed.");
        return { message: responseMessage.content, success: true };
      }
    } catch (error) {
      AgentLogger.logError(error);
      return { message: "An unexpected error occurred.", success: false };
    }
  }
}
