import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { differenceInDays, addDays } from 'date-fns';
import FoodItemCard from '../../components/FoodItemCard';
import { useFridge } from '../context/FridgeContext';
import SearchBar from '../../components/ui/SearchBar';
import QuickAddCard from '../../components/ui/QuickAddCard';
import FilterChip from '../../components/ui/FilterChip';

const QUICK_ADD_ITEMS = [
  { name: 'Milk', category: 'Breakfast', duration: 7 },
  { name: 'Bread', category: 'Carbs', duration: 5 },
  { name: 'Eggs', category: 'Proteins', duration: 14 },
  { name: 'Lettuce', category: 'Vegetables', duration: 4 },
  { name: 'Yogurt', category: 'Breakfast', duration: 10 },
  { name: 'Chicken', category: 'Proteins', duration: 3 },
];

const FILTERS = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'fresh', label: 'Fresh', icon: 'check-circle' },
  { id: 'soon', label: 'Soon', icon: 'alert-triangle' },
  { id: 'expired', label: 'Expired', icon: 'x-circle' },
  { id: 'fridge', label: 'Fridge', icon: 'thermometer', iconType: 'material' },
];

export default function HomeScreen() {
  const { items, removeItem, updateItem, addItem } = useFridge();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Calculate metrics
  const today = new Date();
  const freshCount = items.filter(i => differenceInDays(new Date(i.expiryDate), today) > 3).length;
  const soonCount = items.filter(i => {
    const diff = differenceInDays(new Date(i.expiryDate), today);
    return diff >= 0 && diff <= 3;
  }).length;
  const expiredCount = items.filter(i => differenceInDays(new Date(i.expiryDate), today) < 0).length;

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        // Search filter (Only search if >= 3 characters)
        let matchesSearch = true;
        const query = searchQuery.trim().toLowerCase();
        
        if (query.length >= 3) {
          matchesSearch = Boolean(
            item.name?.toLowerCase().includes(query) || 
            item.category?.toLowerCase().includes(query)
          );
        }
        
        if (!matchesSearch) return false;

        // Category/Status filter
        if (activeFilter === 'all') return true;
        if (activeFilter === 'fridge') return item.location === 'Fridge';
        
        const diff = differenceInDays(new Date(item.expiryDate), today);
        if (activeFilter === 'fresh') return diff > 3;
        if (activeFilter === 'soon') return diff >= 0 && diff <= 3;
        if (activeFilter === 'expired') return diff < 0;
        
        return true;
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [items, searchQuery, activeFilter]);

  const handleQuickAdd = (item: typeof QUICK_ADD_ITEMS[0]) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      quantity: 1,
      unit: 'pcs',
      expiryDate: addDays(new Date(), item.duration).toISOString(),
      category: item.category,
      location: 'Fridge' as const,
      dateAdded: new Date().toISOString(),
    };
    addItem(newItem);
  };

  const renderHeader = () => (
    <View className="mb-6">
      {/* Search Bar */}
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        className="mb-8"
      />

      {/* Quick Add Section */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Feather name="zap" size={18} color="#3b82f6" className="mr-2" />
          <Text className="text-lg font-bold text-gray-800">Quick Add</Text>
        </View>
        <View className="flex-row flex-wrap justify-between">
          {QUICK_ADD_ITEMS.map((item) => (
            <QuickAddCard 
              key={item.name} 
              name={item.name} 
              category={item.category} 
              onPress={() => handleQuickAdd(item)} 
            />
          ))}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2 -mx-4 px-4 h-12">
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            icon={filter.icon}
            iconType={filter.iconType as any}
            isActive={activeFilter === filter.id}
            onPress={() => setActiveFilter(filter.id)}
            count={filter.id === 'all' ? items.length : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Persistent Header */}
      <View className="pt-16 px-4 pb-4 bg-white flex-row justify-between items-start">
        <View>
          <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-lg self-start mb-1">
             <MaterialCommunityIcons name="fridge-bottom" size={16} color="#3b82f6" />
             <Text className="text-[10px] font-bold text-blue-600 ml-1 uppercase">Smart Inventory</Text>
          </View>
          <Text className="text-3xl font-black text-slate-900 tracking-tight">IceBox</Text>
        </View>
        <View className="flex-row gap-2 mt-2">
           <View className="bg-green-100 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-green-700 font-bold text-xs">{freshCount}</Text>
           </View>
           <View className="bg-yellow-100 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-yellow-700 font-bold text-xs">{soonCount}</Text>
           </View>
           <View className="bg-red-100 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-red-700 font-bold text-xs">{expiredCount}</Text>
           </View>
        </View>
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListHeaderComponent={renderHeader()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View className="items-center justify-center py-20 bg-gray-50 rounded-3xl mt-4">
            <View className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Feather name="package" size={48} color="#cbd5e1" />
            </View>
            <Text className="text-xl font-bold text-gray-800">Empty Inventory</Text>
            <Text className="text-gray-500 mt-2 text-center px-10">
              {searchQuery ? "No items found matching your search." : "Start by adding items to your fridge using Quick Add or the + button."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <FoodItemCard
            item={item}
            onRemove={() => removeItem(item.id)}
            onUpdateQuantity={(quantity) => updateItem(item.id, { quantity })}
          />
        )}
      />

      {/* Floating Action Button */}
      <Pressable 
        onPress={() => router.push('/add')}
        className="absolute bottom-8 right-6 w-16 h-16 bg-cyan-500 rounded-full items-center justify-center shadow-xl elevation-5 active:bg-cyan-600 active:opacity-80"
      >
        <Feather name="plus" size={32} color="white" />
      </Pressable>
    </View>
  );
}

