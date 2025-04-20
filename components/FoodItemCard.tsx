import { differenceInDays } from 'date-fns';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FoodItem } from '../constants/types';

interface FoodItemCardProps {
    item: FoodItem;
    onRemove: () => void; // Handler passed from parent
  }

  const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onRemove }) => {
    const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());

  return (
    <View style={[styles.card, daysLeft <= 3 && styles.warning]}>
      <Text style={styles.name}>{item.name} ({item.quantity})</Text>
      <Text>Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</Text>
      <Button title="Remove" onPress={onRemove}/> {/* Button to remove */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warning: {
    backgroundColor: '#ffe4e4',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodItemCard;
