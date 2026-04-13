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
        { 
          elevation: pressed ? 2 : 12,
          shadowColor: '#64748b',
          shadowOffset: { width: 0, height: pressed ? 2 : 10 },
          shadowOpacity: pressed ? 0.1 : 0.2,
          shadowRadius: pressed ? 4 : 15,
          transform: [{ scale: pressed ? 0.95 : 1 }] 
        }
      ]}
      className="bg-white/95 rounded-[32px] p-6 w-[47%] mb-6 items-center justify-center border border-slate-200/80"
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
            <View className="absolute inset-0 bg-slate-900/5 rounded-[32px]" />
          )}
        </>
      )}
    </Pressable>
  );
}
