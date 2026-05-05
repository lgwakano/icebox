export const agentSkills = [
  {
    type: "function",
    function: {
      name: "guess_item_properties",
      description: "Guesses the category, storage location (Fridge/Freezer/Pantry), and shelf life (in days) of a given food item based on its name. Use this tool whenever you need to know how or where to store a new item, or how long it will last.",
      parameters: {
        type: "object",
        properties: {
          itemName: {
            type: "string",
            description: "The name of the food item (e.g., 'milk', 'chicken', 'apple')"
          }
        },
        required: ["itemName"]
      }
    }
  }
];
