export interface SmartGuessResponse {
  category: string;
  location: 'Fridge' | 'Freezer' | 'Pantry';
  shelfLifeDays: number;
}

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

  // Basic heuristic engine mapping categories AND query strings to Fridge/Freezer/Pantry
  // This allows the app to work seamlessly even if the API throws a 503
  if (categoriesToTest.includes("dairy") || categoriesToTest.includes("milk") || categoriesToTest.includes("yogurt") || categoriesToTest.includes("cheese") || categoriesToTest.includes("butter")) {
    return { category: "Dairy", location: "Fridge", shelfLifeDays: 14 };
  }
  if (categoriesToTest.includes("meat") || categoriesToTest.includes("beef") || categoriesToTest.includes("chicken") || categoriesToTest.includes("pork") || categoriesToTest.includes("poultry")) {
    return { category: "Meat", location: "Fridge", shelfLifeDays: 5 };
  }
  if (categoriesToTest.includes("fish") || categoriesToTest.includes("salmon") || categoriesToTest.includes("tuna") || categoriesToTest.includes("seafood")) {
    return { category: "Fish", location: "Fridge", shelfLifeDays: 4 };
  }
  if (categoriesToTest.includes("frozen") || categoriesToTest.includes("ice cream") || categoriesToTest.includes("pizza")) {
    return { category: "Frozen", location: "Freezer", shelfLifeDays: 180 };
  }
  if (categoriesToTest.includes("vegetable") || categoriesToTest.includes("lettuce") || categoriesToTest.includes("carrot") || categoriesToTest.includes("spinach")) {
    return { category: "Vegetables", location: "Fridge", shelfLifeDays: 7 };
  }
  if (categoriesToTest.includes("fruit") || categoriesToTest.includes("apple") || categoriesToTest.includes("orange") || categoriesToTest.includes("banana")) {
    return { category: "Fruits", location: "Fridge", shelfLifeDays: 7 };
  }
  if (categoriesToTest.includes("beverage") || categoriesToTest.includes("drinks") || categoriesToTest.includes("juice") || categoriesToTest.includes("soda") || categoriesToTest.includes("water")) {
    return { category: "Beverages", location: "Fridge", shelfLifeDays: 30 };
  }
  if (categoriesToTest.includes("condiment") || categoriesToTest.includes("sauce") || categoriesToTest.includes("ketchup") || categoriesToTest.includes("mustard") || categoriesToTest.includes("mayo")) {
    return { category: "Condiments", location: "Fridge", shelfLifeDays: 90 };
  }
  if (categoriesToTest.includes("snack") || categoriesToTest.includes("biscuit") || categoriesToTest.includes("cookie") || categoriesToTest.includes("chips") || categoriesToTest.includes("crisps")) {
    return { category: "Snacks", location: "Pantry", shelfLifeDays: 180 };
  }
  if (categoriesToTest.includes("breakfast") || categoriesToTest.includes("cereal") || categoriesToTest.includes("bread") || categoriesToTest.includes("oats")) {
    return { category: "Breakfast", location: "Pantry", shelfLifeDays: 14 };
  }
  if (categoriesToTest.includes("pasta") || categoriesToTest.includes("rice") || categoriesToTest.includes("grain") || categoriesToTest.includes("noodle")) {
    return { category: "Carbs", location: "Pantry", shelfLifeDays: 365 };
  }
  
  // Default fallback if a product is found but we can't map its tags well
  return { category: "General", location: "Pantry", shelfLifeDays: 90 };
}
