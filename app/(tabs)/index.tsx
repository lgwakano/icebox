import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Button, FlatList, View } from 'react-native';
import FoodItemCard from '../../components/FoodItemCard';
import { useFridge } from '../context/FridgeContext'; // Import the fridge context

export default function HomeScreen() {
  const { items, removeItem } = useFridge(); // Get items and removeItem from context
  const router = useRouter();

  useEffect(() => {
    console.log('items updated:', items);
  }, [items]);

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => removeItem(id), // Call removeItem from context
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodItemCard
            item={item}
            onRemove={() => handleRemoveItem(item.id)} // Pass remove handler to card
          />
        )}
      />
      <Button title="Add Item" onPress={() => router.push('/add')} />
    </View>
  );
}
