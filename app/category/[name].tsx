import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image, Pressable, FlatList } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFridge } from '../context/FridgeContext';
import DetailedItemCard from '../../components/DetailedItemCard';

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  All: { icon: 'fridge-outline', color: '#64748b' },
  Fruits: { icon: 'fruit-grapes', color: '#f97316' },
  Vegetables: { icon: 'carrot', color: '#22c55e' },
  Meat: { icon: 'food-steak', color: '#ef4444' },
  Fish: { icon: 'fish', color: '#0ea5e9' },
  Dairy: { icon: 'cheese', color: '#facc15' },
  Beverages: { icon: 'cup-water', color: '#38bdf8' },
  Snacks: { icon: 'peanut', color: '#d946ef' },
};

export default function CategoryDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { items } = useFridge();
  const router = useRouter();

  const filteredItems = useMemo(() => {
    if (name === 'All') return items;
    return items.filter(item => item.category === name);
  }, [items, name]);

  const meta = CATEGORY_META[name!] || { icon: 'package-variant', color: '#94a3b8' };

  return (
    <View className="flex-1" style={{ backgroundColor: meta.color }}>
      {/* Header with Icon Background */}
      <View className="h-[240px] relative overflow-hidden">
        {/* Giant Translucent Icon */}
        <MaterialCommunityIcons 
          name={meta.icon as any} 
          size={260} 
          color="#ffffff" 
          style={{ position: 'absolute', right: -40, top: -20, opacity: 0.15 }} 
        />
        
        {/* Top Controls */}
        <View className="absolute top-16 left-6 flex-row items-center">
          <Pressable 
            onPress={() => router.back()}
            className="flex-row items-center bg-white/20 px-4 py-2 rounded-full border border-white/30"
          >
            <Feather name="chevron-left" size={20} color="#ffffff" />
            <Text className="ml-1 font-bold text-white">Back</Text>
          </Pressable>
        </View>

        {/* Category Branding */}
        <View className="absolute bottom-10 left-6">
           <Text className="text-5xl font-black text-white tracking-tighter">{name === 'All' ? 'All Items' : name}</Text>
           <Text className="text-xl text-white/80 font-bold mt-1">{filteredItems.length} items</Text>
        </View>
      </View>

      {/* Items List */}
      <View className="flex-1 bg-white -mt-6 rounded-t-[40px] px-6 pt-10">
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DetailedItemCard item={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-slate-400 font-medium italic">No items in this category yet.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
