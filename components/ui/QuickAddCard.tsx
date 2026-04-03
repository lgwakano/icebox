import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFoodIcon } from '../../utils/foodIcons';

interface QuickAddCardProps {
  name: string;
  category: string;
  onPress: () => void;
}

export default function QuickAddCard({ name, category, onPress }: QuickAddCardProps) {
  const icon = getFoodIcon(name, category);
  
  return (
    <Pressable 
      onPress={onPress}
      className="bg-white border border-gray-100 rounded-2xl items-center justify-center p-4 w-[31%] mb-3 shadow-sm active:bg-gray-50 active:opacity-80"
    >
      <View className="mb-2 bg-gray-50 p-2 rounded-full">
        <MaterialCommunityIcons name={icon as any} size={24} color="#3b82f6" />
      </View>
      <Text className="text-xs font-semibold text-gray-700 text-center" numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}
