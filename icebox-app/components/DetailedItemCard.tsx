import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { differenceInDays, isPast } from 'date-fns';
import { FoodItem } from '../constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFoodEmoji } from '../utils/foodIcons';
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
  
  const emoji = getFoodEmoji(item.name, item.category || '');
  
  const dateAddedObj = item.dateAdded ? new Date(item.dateAdded) : null;
  // If dateAdded is unknown, assuming a default typical safe lifespan of 14 days
  const safeTotalLifespan = dateAddedObj ? differenceInDays(expiryDate, dateAddedObj) : Math.max(daysLeft, 14);
  const normalizedLifespan = safeTotalLifespan > 0 ? safeTotalLifespan : 1;
  const percentage = isExpired ? 0 : Math.max(0, Math.min(100, (daysLeft / normalizedLifespan) * 100));

  let barColorClass = 'bg-green-500';
  let badgeText = `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
  
  if (isExpired) {
    barColorClass = 'bg-red-500';
    badgeText = `Expired`;
  } else if (daysLeft === 0) {
    barColorClass = 'bg-red-500';
    badgeText = `Expires today`;
  } else if (percentage <= 20) {
    barColorClass = 'bg-red-500';
  } else if (percentage <= 50) {
    barColorClass = 'bg-yellow-500';
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
      <View className="bg-red-500 justify-center items-end px-8 mb-4 rounded-3xl h-20 self-center">
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
      <View className="flex-row items-center mb-4 bg-white rounded-3xl p-3 shadow-sm border border-slate-50">
        {/* Thumbnail */}
        <View className="w-16 h-16 bg-slate-50 rounded-2xl items-center justify-center mr-4">
          {item.photoUri ? (
            <Image source={{ uri: item.photoUri }} className="w-full h-full rounded-2xl" />
          ) : (
            <Text style={{ fontSize: 32 }}>{emoji}</Text>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 pr-2">
          <View className="flex-row justify-between items-start">
            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.name}</Text>
            <Text className="text-slate-400 text-sm font-medium">{item.quantity} {item.quantity === 1 ? 'item' : 'items'}</Text>
          </View>
          
          <View className="flex-row items-center mt-0.5 mb-3">
            <Text className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">{item.location || 'Fridge'}</Text>
            <View className="w-1 h-1 rounded-full bg-slate-300 mx-2" />
            <Text className={`text-[11px] font-bold uppercase tracking-wider ${isExpired || percentage <= 20 ? 'text-red-500' : percentage <= 50 ? 'text-yellow-600' : 'text-slate-500'}`}>{badgeText}</Text>
          </View>

          {/* Freshness Bar */}
          <View className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <View className={`h-full rounded-full ${barColorClass}`} style={{ width: `${percentage}%` }} />
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
