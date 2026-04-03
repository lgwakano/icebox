import React from 'react';
import { View, TextInput, ViewProps, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchBarProps extends ViewProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = "Search items...", className, ...props }: SearchBarProps) {
  return (
    <View {...props} className={`flex-row items-center bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm ${className}`}>
      <Feather name="search" size={20} color="#94a3b8" className="mr-3" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className="flex-1 text-base text-gray-900"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} className="p-1 active:opacity-50">
          <Feather name="x-circle" size={18} color="#94a3b8" />
        </Pressable>
      )}
    </View>
  );
}
