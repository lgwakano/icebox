import { differenceInDays, formatDistanceToNow, isPast } from 'date-fns';
import { View, Text, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { FoodItem } from '../constants/types';
import { Card } from './ui/Card';
import { useRouter } from 'expo-router';
import { getFoodIcon } from '../utils/foodIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface FoodItemCardProps {
  item: FoodItem;
  onRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
}

export default function FoodItemCard({ item, onRemove, onUpdateQuantity }: FoodItemCardProps) {
  const router = useRouter();
  const expiryDate = new Date(item.expiryDate);
  const daysLeft = differenceInDays(expiryDate, new Date());
  const isExpired = isPast(expiryDate);
  
  let statusColor = 'text-green-600';
  let badgeBg = 'bg-green-50';
  let statusIcon: any = null;
  let statusText = `Expiring ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;

  if (isExpired) {
    statusColor = 'text-red-600';
    badgeBg = 'bg-red-50';
    statusIcon = 'alert-circle';
    statusText = `Expired ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
  } else if (daysLeft <= 3) {
    statusColor = 'text-yellow-600';
    badgeBg = 'bg-yellow-50';
    statusIcon = 'alert-triangle';
    statusText = `Expiring soon (${daysLeft}d left)`;
  }

  const iconName = getFoodIcon(item.name, item.category || '');

  const renderRightActions = () => {
    return (
      <Pressable
        onPress={onRemove}
        className="bg-red-500 justify-center items-center w-20 rounded-2xl ml-2"
      >
        <Feather name="trash-2" size={24} color="white" />
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} containerStyle={{ marginBottom: 12 }}>
      <Card className={`border-l-4 border-transparent bg-white shadow-sm rounded-2xl flex-row items-center p-4 overflow-hidden`}>
        {/* Visual Indicator Layer */}
      <View className={`absolute left-0 top-0 bottom-0 w-1 ${isExpired ? 'bg-red-500' : daysLeft <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`} />
      
      {/* Food Icon */}
      <View className="mr-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <MaterialCommunityIcons name={iconName as any} size={32} color="#475569" />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-xl font-bold text-gray-900 mr-2" numberOfLines={1}>{item.name}</Text>
          {statusIcon && (
            <Feather name={statusIcon} size={16} color={isExpired ? '#ef4444' : '#eab308'} />
          )}
        </View>

        <View className="flex-row items-center mb-2">
          <View className="flex-row items-center mr-3">
             <Feather name="package" size={12} color="#94a3b8" className="mr-1" />
             <Text className="text-xs font-semibold text-slate-500">{item.quantity} {item.unit}</Text>
          </View>
          <View className="flex-row items-center">
             <Feather name="map-pin" size={12} color="#94a3b8" className="mr-1" />
             <Text className="text-xs font-semibold text-slate-500">{item.location}</Text>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <Feather name="calendar" size={12} color={isExpired ? '#ef4444' : daysLeft <= 3 ? '#eab308' : '#94a3b8'} className="mr-1" />
          <Text className={`text-xs font-medium ${statusColor}`}>
            {statusText}
          </Text>
        </View>

        {item.category && (
          <View className="flex-row">
            <View className="bg-green-100 px-2 py-0.5 rounded-md">
              <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">{item.category}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Navigate to Details */}
      <Pressable onPress={() => router.push(`/item/${item.id}`)} className="ml-2 p-2 rounded-full active:bg-gray-100">
        <Feather name="chevron-right" size={20} color="#cbd5e1" />
      </Pressable>
      </Card>
    </Swipeable>
  );
}

