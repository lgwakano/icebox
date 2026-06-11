# AI Roadmap for Icebox

Given that Icebox is a "Scanner First" Micro SaaS dashboard focused on managing food inventory, here is the ranked roadmap of modern AI paradigms we will leverage to make the app feel truly "smart" and frictionless.

## 1. Agentic Workflows & Tool Use ("Skills") 🏆
**What it is:** Instead of just generating text, the AI acts as an autonomous agent equipped with specific "Skills" (functions/tools) it can use to interact with the app. 
**How it fits Icebox:** We create a "Smart Assistant" that takes an unstructured input (e.g., "I just bought a gallon of milk and some carrots") or a raw OCR receipt, and uses its Skills to:
- `CategorizeItem(name)` -> Uses the existing SmartGuess API.
- `CalculateExpiry(category)` -> Determines the shelf life.
- `UpdateInventory(item, location, expiry)` -> Automatically adds the item to the database.

## 2. Vision-Language Models (VLM) for Frictionless Scanning
**What it is:** Models like GPT-4o or Claude 3.5 Sonnet that can understand and reason about images natively.
**How it fits Icebox:** A "Magic Fridge Scan" feature where the user simply takes a picture of their open fridge or pantry. The VLM identifies all the visible food items, estimates quantities, and maps them to categories.

## 3. Retrieval-Augmented Generation (RAG) for Zero-Waste Cooking
**What it is:** Feeding specific, context-relevant data into an LLM so it can answer questions based on your specific database.
**How it fits Icebox:** A recipe generation chatbot that retrieves the user's *current inventory*, specifically filtering for items that are nearing expiration. The user can ask, "What can I make for dinner tonight?" and the AI will generate a recipe that perfectly utilizes the expiring items.

## 4. Predictive Machine Learning (Forecasting)
**What it is:** Analyzing historical data to predict future events.
**How it fits Icebox:** Analyzing how quickly the user consumes items over time to automatically generate smart grocery lists (e.g., "You typically run out of eggs every 6 days; adding eggs to your shopping list").

---
*Generated May 2026*
