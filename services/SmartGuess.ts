export interface SmartGuessResponse {
  category: string;
  location: 'Fridge' | 'Freezer' | 'Pantry';
  shelfLifeDays: number;
}

const CATEGORY_MAP: Record<string, { location: 'Fridge' | 'Freezer' | 'Pantry'; shelfLifeDays: number; keywords: string[] }> = {
  Dairy: { location: "Fridge", shelfLifeDays: 14, keywords: ["dairy", "milk", "yogurt", "cheese", "butter", "cream", "kefir", "sour cream", "whey", "parmesan", "mozzarella"] },
  Meat: { location: "Fridge", shelfLifeDays: 5, keywords: ["meat", "beef", "chicken", "pork", "poultry", "lamb", "duck", "turkey", "veal", "steak", "bacon", "sausage", "ham", "prosciutto", "salami"] },
  Fish: { location: "Fridge", shelfLifeDays: 4, keywords: ["fish", "salmon", "tuna", "seafood", "shrimp", "prawns", "crab", "lobster", "cod", "trout", "halibut", "sushi"] },
  Frozen: { location: "Freezer", shelfLifeDays: 180, keywords: ["frozen", "ice cream", "pizza", "gelato", "sorbet", "popsicle"] },
  Vegetables: { location: "Fridge", shelfLifeDays: 7, keywords: ["vegetable", "lettuce", "carrot", "spinach", "broccoli", "onion", "tomato", "potato", "garlic", "cucumber", "pepper", "celery", "kale", "cabbage", "zucchini", "squash", "mushroom"] },
  Fruits: { location: "Fridge", shelfLifeDays: 7, keywords: ["fruit", "apple", "orange", "banana", "grape", "berry", "strawberry", "blueberry", "melon", "watermelon", "peach", "pear", "plum", "kiwi", "mango", "pineapple", "lemon", "lime"] },
  Beverages: { location: "Fridge", shelfLifeDays: 30, keywords: ["beverage", "drinks", "juice", "soda", "water", "coca cola", "pepsi", "tea", "coffee", "beer", "wine", "liquor", "sprite", "kombucha"] },
  Condiments: { location: "Fridge", shelfLifeDays: 90, keywords: ["condiment", "sauce", "ketchup", "mustard", "mayo", "mayonnaise", "dressing", "soy sauce", "hot sauce", "vinegar", "syrup", "jam", "jelly", "honey", "relish", "dip", "salsa"] },
  Snacks: { location: "Pantry", shelfLifeDays: 180, keywords: ["snack", "biscuit", "cookie", "chips", "crisps", "cracker", "popcorn", "pretzel", "nuts", "almonds", "peanuts", "candy", "chocolate"] },
  Breakfast: { location: "Pantry", shelfLifeDays: 14, keywords: ["breakfast", "cereal", "bread", "oats", "pancake", "waffle", "granola", "bagel", "croissant"] },
  Carbs: { location: "Pantry", shelfLifeDays: 365, keywords: ["pasta", "rice", "grain", "noodle", "spaghetti", "macaroni", "quinoa", "couscous", "flour"] }
};

export async function guessItemProperties(query: string): Promise<SmartGuessResponse | null> {
  if (!query) return null;

  console.log(`\\n[SmartGuess] 🔍 Analyzing: "${query}"`);
  const timeLabel = `[SmartGuess] ⏱️ API Time (${query})`;
  console.time(timeLabel);

  let categoriesToTest = query.toLowerCase();

  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags_en=${encodeURIComponent(query.toLowerCase())}&fields=product_name,categories_tags&sort_by=popularity_key&page_size=1`;
    console.log(`[SmartGuess] 🌐 Fetching from API...`);
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'IceBox/1.0 (Mobile App)',
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          const product = data.products[0];
          const tags = product.categories_tags || [];
          console.log(`[SmartGuess] ✅ OpenFoodFacts match: "${product.product_name || 'Unnamed Product'}" (${tags.length} tags)`);
          categoriesToTest += " " + tags.join(" ").toLowerCase();
        } else {
          console.log(`[SmartGuess] ℹ️ API returned 0 products. Falling back to local heuristic.`);
        }
      } else {
        const text = await res.text();
        console.warn(`[SmartGuess] ⚠️ API returned non-JSON response: ${text.substring(0, 100)}...`);
      }
    } else {
      console.warn(`[SmartGuess] ⚠️ API returned HTTP ${res.status}. Falling back to local heuristic.`);
    }
  } catch (error) {
    console.error("[SmartGuess] ❌ Network Error:", error);
  } finally {
    console.timeEnd(timeLabel);
  }

  console.log(`[SmartGuess] 🧩 Executing heuristic engine with string: "${categoriesToTest}"`);

  // Iterate through our category map to find matching tags
  for (const [category, config] of Object.entries(CATEGORY_MAP)) {
    if (config.keywords.some(keyword => categoriesToTest.includes(keyword))) {
      return { category, location: config.location, shelfLifeDays: config.shelfLifeDays };
    }
  }
  
  // Default fallback if a product is found but we can't map its tags well
  return { category: "General", location: "Pantry", shelfLifeDays: 90 };
}
