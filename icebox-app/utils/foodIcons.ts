export function getFoodEmoji(name: string, category: string): string {
  const text = `${name} ${category}`.toLowerCase();

  // Fruits
  if (text.includes('pineapple')) return '🍍';
  if (text.includes('apple')) return '🍎';
  if (text.includes('banana')) return '🍌';
  if (text.includes('orange') || text.includes('lemon')) return '🍊';
  if (text.includes('grape')) return '🍇';
  if (text.includes('strawberry')) return '🍓';
  if (text.includes('watermelon')) return '🍉';
  if (text.includes('peach')) return '🍑';
  if (text.includes('cherry')) return '🍒';
  if (text.includes('fruit')) return '🍎';

  // Veggies
  if (text.includes('carrot')) return '🥕';
  if (text.includes('corn')) return '🌽';
  if (text.includes('broccoli')) return '🥦';
  if (text.includes('potato')) return '🥔';
  if (text.includes('onion')) return '🧅';
  if (text.includes('garlic')) return '🧄';
  if (text.includes('tomato')) return '🍅';
  if (text.includes('pepper')) return '🫑';
  if (text.includes('vegetable')) return '🥬';

  // Meat / Dairy / Bakery
  if (text.includes('steak') || text.includes('beef') || text.includes('meat')) return '🥩';
  if (text.includes('chicken') || text.includes('poultry') || text.includes('turkey')) return '🍗';
  if (text.includes('bacon') || text.includes('pork')) return '🥓';
  if (text.includes('fish') || text.includes('salmon') || text.includes('seafood')) return '🐟';
  if (text.includes('shrimp')) return '🍤';
  if (text.includes('egg')) return '🥚';
  if (text.includes('cheese')) return '🧀';
  if (text.includes('milk') || text.includes('dairy')) return '🥛';
  if (text.includes('bread') || text.includes('toast') || text.includes('bakery')) return '🍞';
  if (text.includes('pizza')) return '🍕';
  if (text.includes('burger') || text.includes('hamburger')) return '🍔';
  if (text.includes('noodle') || text.includes('pasta')) return '🍝';
  if (text.includes('ice cream') || text.includes('frozen') || text.includes('dessert')) return '🍦';
  
  // Drinks/Snacks
  if (text.includes('water')) return '💧';
  if (text.includes('coffee')) return '☕';
  if (text.includes('beer') || text.includes('alcohol')) return '🍺';
  if (text.includes('wine')) return '🍷';
  if (text.includes('juice')) return '🧃';
  if (text.includes('snack') || text.includes('chips')) return '🍟';
  if (text.includes('peanut') || text.includes('nut')) return '🥜';

  return '🍱'; // vibrant generic fallback
}

export function getFoodIcon(name: string, category: string): string {
  const text = `${name} ${category}`.toLowerCase();

  if (text.includes('apple')) return 'food-apple';
  if (text.includes('grape')) return 'fruit-grapes';
  if (text.includes('watermelon')) return 'fruit-watermelon';
  if (text.includes('cherry')) return 'fruit-cherries';
  if (text.includes('pineapple')) return 'fruit-pineapple';
  if (text.includes('fruit')) return 'fruit-citrus';
  
  if (text.includes('carrot')) return 'carrot';
  if (text.includes('corn')) return 'corn';
  if (text.includes('mushroom')) return 'mushroom';
  if (text.includes('onion') || text.includes('garlic')) return 'garlic';
  if (text.includes('pepper')) return 'pepper';
  if (text.includes('vegetable')) return 'leaf';
  
  if (text.includes('steak') || text.includes('beef') || text.includes('meat')) return 'food-steak';
  if (text.includes('chicken') || text.includes('poultry') || text.includes('turkey')) return 'food-drumstick';
  if (text.includes('bacon') || text.includes('pork')) return 'pig';
  if (text.includes('fish') || text.includes('salmon') || text.includes('seafood')) return 'fish';
  if (text.includes('egg')) return 'egg';
  if (text.includes('cheese')) return 'cheese';
  if (text.includes('milk') || text.includes('dairy')) return 'cup-water';
  if (text.includes('bread') || text.includes('toast') || text.includes('bakery')) return 'bread-slice';
  if (text.includes('pizza')) return 'pizza';
  if (text.includes('burger') || text.includes('hamburger')) return 'hamburger';
  if (text.includes('noodle') || text.includes('pasta')) return 'noodles';
  if (text.includes('ice cream') || text.includes('frozen') || text.includes('dessert')) return 'ice-cream';
  
  if (text.includes('water')) return 'water';
  if (text.includes('coffee')) return 'coffee';
  if (text.includes('beer') || text.includes('alcohol')) return 'beer';
  if (text.includes('wine')) return 'glass-wine';
  if (text.includes('juice')) return 'cup-water';
  if (text.includes('snack') || text.includes('chips')) return 'peanut';
  if (text.includes('peanut') || text.includes('nut')) return 'peanut';

  return 'food';
}
