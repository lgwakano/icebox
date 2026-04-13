import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { differenceInDays, formatDistanceToNow, isPast } from 'date-fns';
import { FoodItem } from '../constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFoodIcon } from '../utils/foodIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useFridge } from '../app/context/FridgeContext';

interface DetailedItemCardProps {
  item: FoodItem;
}

export default function DetailedItemCard({ item }: DetailedItemCardProps) {
  const { removeItem } = useFridge();
  
  const expiryDate = new Date(item.expiryDate);
  const now = new Date();
  const daysLeft = differenceInDays(expiryDate, now);
  const isExpired = isPast(expiryDate);
  
  const iconName = getFoodIcon(item.name, item.category || '');
  
  let badgeColor = 'bg-green-500';
  let badgeText = `+${daysLeft} days`;
  
  if (isExpired) {
    badgeColor = 'bg-red-500';
    badgeText = `Expired`;
  } else if (daysLeft === 0) {
    badgeColor = 'bg-yellow-500';
    badgeText = `Today`;
  } else if (daysLeft <= 3) {
    badgeColor = 'bg-orange-500';
    badgeText = `${daysLeft} days left`;
  } else {
    badgeText = `${daysLeft} days left`;
  }

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    return (
      <View className="bg-red-500 justify-center items-end px-8 mb-6 rounded-2xl h-20 self-center">
        <Animated.View style={{ opacity, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="trash-can-outline" size={28} color="white" />
          <Text className="text-white font-bold ml-2">Delete</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => removeItem(item.id)}
      rightThreshold={100}
      friction={2}
      overshootRight={false}
    >
      <View className="flex-row items-center mb-6 bg-white rounded-2xl p-2">
        {/* Thumbnail */}
        <View className="w-20 h-20 bg-gray-50 rounded-2xl items-center justify-center mr-4 border border-gray-100 overflow-hidden">
          {item.photoUri ? (
            <Image source={{ uri: item.photoUri }} className="w-full h-full" />
          ) : (
            <MaterialCommunityIcons name={iconName as any} size={40} color="#cbd5e1" />
          )}
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className={`self-start px-2 py-0.5 rounded-full ${badgeColor} mb-1`}>
            <Text className="text-white text-[10px] font-bold uppercase">{badgeText}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900" numberOfLines={1}>{item.name}</Text>
        </View>

        {/* Quantity */}
        <View>
          <Text className="text-gray-400 text-sm font-medium">{item.quantity} {item.quantity === 1 ? 'item' : 'items'}</Text>
        </View>
      </View>
    </Swipeable>
  );
}
