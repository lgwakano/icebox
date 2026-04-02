import { differenceInDays } from 'date-fns';
import { View, Text, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { FoodItem } from '../constants/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { QuickStepper } from './ui/QuickStepper';
import { getFoodIcon } from '../utils/foodIcons';

interface FoodItemCardProps {
  item: FoodItem;
  onRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
}

export default function FoodItemCard({ item, onRemove, onUpdateQuantity }: FoodItemCardProps) {
  const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
  
  let statusVariant: 'success' | 'warning' | 'danger' = 'success';
  if (daysLeft < 0) statusVariant = 'danger';
  else if (daysLeft <= 3) statusVariant = 'warning';

  const borderColor = statusVariant === 'success' ? 'border-green-500' : statusVariant === 'warning' ? 'border-yellow-500' : 'border-red-500';
  const iconColor = statusVariant === 'success' ? '#22c55e' : statusVariant === 'warning' ? '#eab308' : '#ef4444';

  return (
    <Card className={`mb-3 border-l-4 ${borderColor} flex-row items-center justify-between pl-3 pr-4 py-3`}>
      <View className="mr-3 bg-gray-50 p-2 rounded-full border border-gray-100">
        <MaterialCommunityIcons name={getFoodIcon(item.name, item.category || '')} size={28} color={iconColor} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-lg font-semibold text-gray-900 mr-2 flex-1" numberOfLines={1}>{item.name}</Text>
          {daysLeft < 0 ? (
            <Badge label="Expired" variant="danger" />
          ) : daysLeft <= 3 ? (
            <Badge label="Expiring" variant="warning" />
          ) : (
            <Badge label="Fresh" variant="success" />
          )}
        </View>

        <View className="flex-row items-center opacity-70 mb-2">
          {item.location && <Text className="text-sm mr-3">📍 {item.location}</Text>}
          {item.category && <Text className="text-sm mr-3">🏷️ {item.category}</Text>}
          <Text className="text-sm">🗓️ {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}</Text>
        </View>

        <View className="flex-row items-center mt-1">
          <QuickStepper 
            value={item.quantity} 
            onChange={(val) => {
              if (val <= 0) onRemove();
              else onUpdateQuantity(val);
            }} 
            className="mr-4"
          />
          <Pressable onPress={onRemove} className="p-2 bg-red-50 rounded-full">
            <Feather name="trash-2" size={16} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
