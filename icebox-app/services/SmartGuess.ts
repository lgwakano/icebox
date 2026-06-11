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

  console.log(`\n[SmartGuess] 🔍 Analyzing: "${query}"`);
  const timeLabel = `[SmartGuess] ⏱️ API Time (${query})`;
  console.time(timeLabel);

  let categoriesToTest = query.toLowerCase();

  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags_en=${encodeURIComponent(query.toLowerCase())}&fields=product_name,categories_tags&sort_by=popularity_key&page_size=1`;
    const headers = {
      'User-Agent': 'FridgeManagerApp/1.0 (lgwakano@gmail.com)',
      'Accept': 'application/json'
    };

    console.log(`[SmartGuess] 🌐 Fetching from API...`);
    console.log(`[SmartGuess] 📋 Request Details:\n   GET ${url}\n   Headers: ${JSON.stringify(headers)}`);

    const delays = [300, 800];
    let res: Response | null = null;

    for (let attempt = 0; attempt <= 2; attempt++) {
      res = await fetch(url, { headers });

      if (res.status === 503 && attempt < 2) {
        const reqId = res.headers.get('x-request-id') || 'unknown';
        console.warn(`[SmartGuess] ⚠️ API returned 503 (ReqID: ${reqId}). Retrying in ${delays[attempt]}ms (Attempt ${attempt + 1}/2)...`);
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        continue;
      }
      break;
    }

    if (res && res.ok) {
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
        console.warn(`[SmartGuess] ⚠️ API returned non-JSON response: ${text.substring(0, 200)}...`);
      }
    } else if (res) {
      const reqId = res.headers.get('x-request-id') || 'unknown';
      const text = await res.text().catch(() => 'Could not read body');
      console.warn(`[SmartGuess] ⚠️ API returned HTTP ${res.status} (ReqID: ${reqId}). Body preview: ${text.replace(/\\n/g, ' ').substring(0, 150)}... Falling back to heuristic.`);
    }
  } catch (error) {
    console.error("[SmartGuess] ❌ Network Error:", error);
  } finally {
    console.timeEnd(timeLabel);
  }

  console.log(`[SmartGuess] 🧩 Executing heuristic engine with string: "${categoriesToTest}"`);

  let bestCategory = { category: "General", location: "Pantry" as const, shelfLifeDays: 90 };
  let maxScore = 0;

  for (const [category, config] of Object.entries(CATEGORY_MAP)) {
    let score = 0;
    for (const keyword of config.keywords) {
      // Split by keyword to count occurrences (e.g. 2 pieces means 1 match)
      const matches = categoriesToTest.split(keyword).length - 1;
      score += matches;
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = { category, location: config.location, shelfLifeDays: config.shelfLifeDays };
    }
  }

  if (maxScore > 0) {
    console.log(`[SmartGuess] 🏆 Best match: ${bestCategory.category} (Score: ${maxScore})`);
  } else {
    console.log(`[SmartGuess] 🤷 No matches found. Defaulting to General.`);
  }

  return bestCategory;
}
