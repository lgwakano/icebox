import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import CategoryCard from '../../components/CategoryCard';
import { useFridge } from '../context/FridgeContext';
import { differenceInDays, isPast } from 'date-fns';

const CATEGORIES = [
  { id: 'All', name: 'All Items', icon: 'fridge-outline', color: '#64748b' },
  { id: 'Fruits', name: 'Fruit', icon: 'fruit-grapes', color: '#f97316' },
  { id: 'Vegetables', name: 'Vegetable', icon: 'carrot', color: '#22c55e' },
  { id: 'Meat', name: 'Meat', icon: 'food-steak', color: '#ef4444' },
  { id: 'Fish', name: 'Fish', icon: 'fish', color: '#0ea5e9' },
  { id: 'Dairy', name: 'Dairy', icon: 'cheese', color: '#facc15' },
  { id: 'Beverages', name: 'Drinks', icon: 'cup-water', color: '#38bdf8' },
  { id: 'Snacks', name: 'Snacks', icon: 'peanut', color: '#d946ef' },
];

export default function HomeScreen() {
  const { items } = useFridge();
  const router = useRouter();

  const { categoryCounts, freshnessCounts } = useMemo(() => {
    const catCounts: Record<string, number> = { All: items.length };
    const freshCounts = { expired: 0, soon: 0, fresh: 0 };
    
    const now = new Date();
    
    items.forEach(item => {
      // Category counts
      const cat = item.category || 'Other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
      
      // Freshness counts
      const expiryDate = new Date(item.expiryDate);
      const isExpired = isPast(expiryDate);
      const daysLeft = differenceInDays(expiryDate, now);
      
      if (isExpired) {
        freshCounts.expired++;
      } else if (daysLeft <= 3) {
        freshCounts.soon++;
      } else {
        freshCounts.fresh++;
      }
    });
    
    return { categoryCounts: catCounts, freshnessCounts: freshCounts };
  }, [items]);

  return (
    <View className="flex-1 bg-white">
      {/* Premium Apple-style Food Image Background (Positioned Absolute) */}
      <View className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
        <Image
          source={{ uri: 'file:///home/admin2/.gemini/antigravity/brain/3d9b5339-c545-42aa-b4c4-b552b356cf6e/apple_style_food_bg_1776054099177.png' }}
          className="w-full h-full opacity-60"
          resizeMode="cover"
        />
        {/* Soft Frosting */}
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-white/40" />
      </View>
      
      {/* Subtle Glassmorphism Overlay */}
      <BlurView intensity={40} tint="light" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header section */}
      <View className="relative px-6 pt-16 pb-4">

        {/* Sidebar Trigger */}
        <Pressable className="mb-10 w-10 h-10 items-center justify-center">
          <Feather name="menu" size={28} color="#1e293b" />
        </Pressable>

        {/* Greeting Section */}
        <View className="mt-4">
          <Text className="text-4xl font-black text-slate-900 tracking-tight">Hello, Waka</Text>
          <Text className="text-lg text-slate-500 font-medium mt-1">This is what's in your fridge.</Text>
        </View>

        {/* Info Meta / Status Report */}
        <View className="mt-8 flex-row items-center justify-between">
          <View>
            <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Freshness Report</Text>
            <View className="flex-row mt-2 space-x-4">
              <View className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                <Text className="text-red-700 font-bold">{freshnessCounts.expired}</Text>
              </View>
              <View className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                <View className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                <Text className="text-orange-700 font-bold">{freshnessCounts.soon}</Text>
              </View>
              <View className="flex-row items-center bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <Text className="text-green-700 font-bold">{freshnessCounts.fresh}</Text>
              </View>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Temp</Text>
            <Text className="text-2xl font-bold text-slate-800 mt-1">7°</Text>
          </View>
        </View>
      </View>

      {/* Categories Grid */}
      <View className="px-6 pb-20">
        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              itemCount={categoryCounts[cat.id] || 0}
              icon={cat.icon}
              color={cat.color}
              onPress={() => router.push(`/category/${cat.id}`)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
    </View>
  );
}


