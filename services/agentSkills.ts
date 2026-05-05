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
  },
  {
    type: "function",
    function: {
      name: "add_item_to_inventory",
      description: "Adds a new food item to the user's Icebox inventory. ALWAYS use `guess_item_properties` first to determine the correct category, location, and shelfLifeDays if they are not explicitly provided by the user.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the food item (e.g., 'Milk', 'Chicken Breast')"
          },
          category: {
            type: "string",
            description: "The category of the item (e.g., 'Dairy', 'Meat', 'Vegetables')"
          },
          location: {
            type: "string",
            description: "Where to store the item. Must be one of: 'Fridge', 'Freezer', 'Pantry'"
          },
          quantity: {
            type: "number",
            description: "The number of items to add. Default to 1 if not specified."
          },
          shelfLifeDays: {
            type: "number",
            description: "The estimated shelf life in days."
          }
        },
        required: ["name", "category", "location", "quantity", "shelfLifeDays"]
      }
    }
  }
];
