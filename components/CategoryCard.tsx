import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryCardProps {
  name: string;
  itemCount: number;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function CategoryCard({ name, itemCount, icon, color, onPress }: CategoryCardProps) {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        { elevation: 0, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
      className="bg-white/70 rounded-[32px] p-6 w-[47%] mb-4 items-center justify-center border border-white overflow-hidden shadow-sm shadow-blue-900/5"
    >
      {({ pressed }) => (
        <>
          <View 
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: pressed ? `${color}30` : `${color}15` }}
          >
            <View className="bg-white rounded-full p-2 shadow-sm">
               <MaterialCommunityIcons name={icon as any} size={32} color={color} />
            </View>
          </View>
          <Text className="text-xl font-bold text-gray-900">{name}</Text>
          <Text className="text-gray-400 text-sm mt-1">{itemCount} items</Text>
          
          {pressed && (
            <View className="absolute inset-0 bg-black/5" />
          )}
        </>
      )}
    </Pressable>
  );
}
