import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterChipProps {
  label: string;
  count?: number;
  isActive: boolean;
  onPress: () => void;
  icon?: string;
  iconType?: 'feather' | 'material';
}

export default function FilterChip({ label, count, isActive, onPress, icon, iconType = 'feather' }: FilterChipProps) {
  return (
    <Pressable 
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
        isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-100'
      }`}
    >
      {icon && iconType === 'feather' && (
        <Feather 
          name={icon as any} 
          size={14} 
          color={isActive ? 'white' : '#64748b'} 
          className="mr-2"
        />
      )}
      {icon && iconType === 'material' && (
        <MaterialCommunityIcons 
          name={icon as any} 
          size={14} 
          color={isActive ? 'white' : '#64748b'} 
          className="mr-2"
        />
      )}
      <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
        {label} {count !== undefined ? `(${count})` : ''}
      </Text>
    </Pressable>
  );
}
