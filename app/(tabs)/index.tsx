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
    <View className="flex-1 bg-[#38bdf8]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header section (Hero) */}
        <View className="relative px-6 pt-16 pb-16 overflow-hidden">
          {/* Giant Translucent Icon */}
          <MaterialCommunityIcons 
            name="snowflake" 
            size={280} 
            color="#ffffff" 
            style={{ position: 'absolute', right: -60, top: -20, opacity: 0.15 }} 
          />

          {/* Sidebar Trigger */}
          <Pressable className="mb-10 w-10 h-10 items-center justify-center bg-white/20 rounded-full border border-white/30">
            <Feather name="menu" size={24} color="#ffffff" />
          </Pressable>

          {/* Greeting Section */}
          <View className="mt-2">
            <Text className="text-4xl font-black text-white tracking-tight">Hello, Waka</Text>
            <Text className="text-lg text-white/90 font-medium mt-1">This is what's in your fridge.</Text>
          </View>

          {/* Info Meta / Status Report */}
          <View className="mt-10 flex-row items-center justify-between">
            <View>
              <Text className="text-white/70 text-sm font-semibold uppercase tracking-widest">Freshness</Text>
              <View className="flex-row mt-3 space-x-3">
                <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                  <View className="w-2 h-2 rounded-full bg-red-400 mr-2" />
                  <Text className="text-white font-bold">{freshnessCounts.expired}</Text>
                </View>
                <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                  <View className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                  <Text className="text-white font-bold">{freshnessCounts.soon}</Text>
                </View>
                <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                  <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                  <Text className="text-white font-bold">{freshnessCounts.fresh}</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-white/70 text-sm font-semibold uppercase tracking-widest">Temp</Text>
              <Text className="text-3xl font-bold text-white mt-1">7°</Text>
            </View>
          </View>
        </View>

        {/* Categories Grid (White Overlapping Card) */}
        <View className="flex-1 bg-white -mt-10 rounded-t-[40px] px-6 pt-10 pb-20 shadow-lg" style={{ minHeight: 600 }}>
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


