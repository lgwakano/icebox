import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFridge } from '../context/FridgeContext';
import DetailedItemCard from '../../components/DetailedItemCard';

const CATEGORY_ASSETS: Record<string, string> = {
  All: 'file:///home/admin2/.gemini/antigravity/brain/a0efdded-3113-4e7c-b618-1b31085a8701/fruit_illustration_1776049909294.png',
  Fruits: 'file:///home/admin2/.gemini/antigravity/brain/a0efdded-3113-4e7c-b618-1b31085a8701/fruit_illustration_1776049909294.png',
  Vegetables: 'file:///home/admin2/.gemini/antigravity/brain/a0efdded-3113-4e7c-b618-1b31085a8701/vegetable_illustration_1776050204690.png',
  Meat: 'file:///home/admin2/.gemini/antigravity/brain/a0efdded-3113-4e7c-b618-1b31085a8701/meat_illustration_1776050223700.png',
  Fish: 'file:///home/admin2/.gemini/antigravity/brain/a0efdded-3113-4e7c-b618-1b31085a8701/fish_illustration_1776050246232.png',
};

export default function CategoryDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { items } = useFridge();
  const router = useRouter();

  const filteredItems = useMemo(() => {
    if (name === 'All') return items;
    return items.filter(item => item.category === name);
  }, [items, name]);

  const headerImage = CATEGORY_ASSETS[name!] || CATEGORY_ASSETS['Fruits'];

  return (
    <View className="flex-1 bg-white">
      {/* Header with Illustration */}
      <View className="h-[240px] relative">
        <Image 
          source={{ uri: headerImage }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Top Controls */}
        <View className="absolute top-16 left-6 flex-row items-center">
          <Pressable 
            onPress={() => router.back()}
            className="flex-row items-center bg-white/80 px-4 py-2 rounded-full border border-white"
          >
            <Feather name="chevron-left" size={20} color="#1e293b" />
            <Text className="ml-1 font-bold text-slate-800">Back</Text>
          </Pressable>
        </View>

        {/* Category Branding */}
        <View className="absolute bottom-10 left-6">
           <Text className="text-5xl font-black text-slate-900 tracking-tighter">{name === 'All' ? 'All Items' : name}</Text>
           <Text className="text-xl text-slate-500 font-bold mt-1">{filteredItems.length} items</Text>
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
