import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export function getFoodIcon(name: string, category: string): IconName {
  const text = `${name} ${category}`.toLowerCase();

  if (text.includes('egg')) return 'egg';
  if (text.includes('meat') || text.includes('beef') || text.includes('steak')) return 'food-steak';
  if (text.includes('chicken') || text.includes('poultry') || text.includes('turkey')) return 'food-drumstick';
  if (text.includes('fish') || text.includes('salmon') || text.includes('seafood')) return 'fish';
  if (text.includes('apple') || text.includes('fruit') || text.includes('produce')) return 'food-apple';
  if (text.includes('vegetable') || text.includes('carrot') || text.includes('lettuce')) return 'carrot';
  if (text.includes('cheese')) return 'cheese';
  if (text.includes('bread') || text.includes('toast') || text.includes('bakery')) return 'bread-slice';
  if (text.includes('pizza')) return 'pizza';
  if (text.includes('burger') || text.includes('hamburger')) return 'hamburger';
  if (text.includes('noodle') || text.includes('pasta')) return 'noodles';
  if (text.includes('ice cream') || text.includes('frozen') || text.includes('dessert')) return 'ice-cream';
  if (text.includes('milk') || text.includes('dairy')) return 'cup';
  if (text.includes('water') || text.includes('drink') || text.includes('beverage') || text.includes('soda')) return 'cup-water';
  if (text.includes('snack') || text.includes('chips') || text.includes('peanut')) return 'peanut';
  if (text.includes('coffee')) return 'coffee';

  // Premium, clean fallback for generic unmapped items
  return 'food-variant';
}
