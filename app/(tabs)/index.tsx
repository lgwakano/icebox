import { useRouter } from 'expo-router';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { differenceInDays } from 'date-fns';
import FoodItemCard from '../../components/FoodItemCard';
import { useFridge } from '../context/FridgeContext';
import { Card } from '../../components/ui/Card';

export default function HomeScreen() {
  const { items, removeItem, updateItem } = useFridge();
  const router = useRouter();

  // Calculate metrics
  const today = new Date();
  const freshCount = items.filter(i => differenceInDays(new Date(i.expiryDate), today) > 3).length;
  const soonCount = items.filter(i => {
    const diff = differenceInDays(new Date(i.expiryDate), today);
    return diff >= 0 && diff <= 3;
  }).length;
  const expiredCount = items.filter(i => differenceInDays(new Date(i.expiryDate), today) < 0).length;

  return (
    <View className="flex-1 bg-gray-50 pt-16 px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">🧊 IceBox</Text>
        <Pressable onPress={() => router.push('/add')} className="bg-blue-600 rounded-full w-10 h-10 items-center justify-center shadow-sm">
          <Feather name="plus" size={24} color="white" />
        </Pressable>
      </View>

      {/* Metrics Row */}
      <View className="flex-row justify-between mb-6">
        <Card className="flex-1 items-center mr-2 py-4">
          <Text className="text-2xl font-bold text-green-600">{freshCount}</Text>
          <Text className="text-xs text-gray-500 mt-1">Fresh</Text>
        </Card>
        <Card className="flex-1 items-center mx-1 py-4">
          <Text className="text-2xl font-bold text-yellow-600">{soonCount}</Text>
          <Text className="text-xs text-gray-500 mt-1">Soon</Text>
        </Card>
        <Card className="flex-1 items-center ml-2 py-4">
          <Text className="text-2xl font-bold text-red-600">{expiredCount}</Text>
          <Text className="text-xs text-gray-500 mt-1">Expired</Text>
        </Card>
      </View>

      {/* List */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800 mb-4">Inventory</Text>
        {items.length === 0 ? (
          <View className="items-center justify-center py-10 opacity-50">
            <Feather name="package" size={48} color="black" className="mb-4" />
            <Text className="text-lg">Your Icebox is empty.</Text>
            <Text className="text-sm mt-2">Tap the + to add items instantly.</Text>
          </View>
        ) : (
          <FlatList
            data={items.sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <FoodItemCard
                item={item}
                onRemove={() => removeItem(item.id)}
                onUpdateQuantity={(quantity) => updateItem(item.id, { quantity })}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
