import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFridge } from '@/app/context/FridgeContext';
import { getFoodIcon } from '@/utils/foodIcons';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { QuickStepper } from '@/components/ui/QuickStepper';
import { format, differenceInDays, isPast } from 'date-fns';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, removeItem, updateItem } = useFridge();

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Feather name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-xl font-bold mt-4">Item Not Found</Text>
        <Pressable 
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const expiryDate = new Date(item.expiryDate);
  const isExpired = isPast(expiryDate);
  const daysLeft = differenceInDays(expiryDate, new Date());
  const iconName = getFoodIcon(item.name, item.category || '');

  const handleDelete = () => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${item.name} from your inventory?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            removeItem(item.id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-16 pb-4 px-6 flex-row items-center border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </Pressable>
        <Text className="text-xl font-bold text-slate-900 flex-1" numberOfLines={1}>Item Details</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Visual Hero Section */}
        <View className="items-center py-10 bg-slate-50">
          <View className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 mb-6">
            <MaterialCommunityIcons name={iconName as any} size={80} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-black text-slate-900 mb-2">{item.name}</Text>
          <View className="flex-row gap-2">
            {isExpired ? (
              <Badge label="Expired" variant="danger" icon="alert-circle" />
            ) : daysLeft <= 3 ? (
              <Badge label="Expiring Soon" variant="warning" icon="alert-triangle" />
            ) : (
              <Badge label="Fresh" variant="success" icon="check-circle" />
            )}
            <Badge label={item.category || 'General'} variant="default" icon="tag" />
          </View>
        </View>

        <View className="px-6 py-8">
          {/* Status Grid */}
          <View className="flex-row flex-wrap justify-between mb-8">
             <Card className="w-[48%] p-4 mb-4 border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Location</Text>
                <View className="flex-row items-center">
                   <Feather name="map-pin" size={16} color="#3b82f6" className="mr-2" />
                   <Text className="text-slate-900 font-bold">{item.location}</Text>
                </View>
             </Card>
             <Card className="w-[48%] p-4 mb-4 border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Quantity</Text>
                <View className="flex-row items-center">
                   <Feather name="package" size={16} color="#3b82f6" className="mr-2" />
                   <Text className="text-slate-900 font-bold">{item.quantity} {item.unit || 'pcs'}</Text>
                </View>
             </Card>
          </View>

          {/* Detailed Info */}
          <View className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <View className="flex-row justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <View>
                   <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Expiration Date</Text>
                   <Text className="text-slate-900 font-bold text-lg">{format(expiryDate, 'MMM d, yyyy')}</Text>
                </View>
                <View className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                   <Text className={`font-bold ${isExpired ? 'text-red-500' : 'text-blue-500'}`}>
                      {isExpired ? 'EXPIRED' : `${daysLeft} days`}
                   </Text>
                </View>
             </View>

             <View className="flex-row justify-between items-center">
                <View>
                   <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Date Added</Text>
                   <Text className="text-slate-900 font-semibold">{item.dateAdded ? format(new Date(item.dateAdded), 'MMM d, yyyy') : 'Recently'}</Text>
                </View>
                {item.barcodeId && (
                  <View className="bg-slate-200 px-3 py-1 rounded-full">
                     <Text className="text-[10px] font-bold text-slate-600">ID: {item.barcodeId}</Text>
                  </View>
                )}
             </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-slate-900 font-bold text-lg mb-4 ml-1">Edit Inventory</Text>
          <Card className="p-6 mb-10 border border-slate-100 items-center">
             <Text className="text-slate-500 mb-4 font-medium text-center">Adjust quantity manually or mark as consumed.</Text>
             <QuickStepper 
               value={item.quantity} 
               onChange={(val: number) => {
                 if (val <= 0) handleDelete();
                 else updateItem(item.id, { quantity: val });
               }}
               className="scale-125 mb-6"
             />
             
             <View className="w-full flex-row gap-3">
                <Pressable 
                  onPress={() => updateItem(item.id, { quantity: item.quantity - 1 || 0 })}
                  className="flex-1 bg-blue-50 py-4 rounded-2xl items-center border border-blue-100"
                >
                   <Text className="text-blue-600 font-bold">Quick -1</Text>
                </Pressable>
                <Pressable 
                  onPress={handleDelete}
                  className="flex-1 bg-red-50 py-4 rounded-2xl items-center border border-red-100"
                >
                   <Text className="text-red-600 font-bold">Remove All</Text>
                </Pressable>
             </View>
          </Card>

          {item.notes && (
            <View className="mb-10">
               <Text className="text-slate-900 font-bold text-lg mb-4 ml-1">Notes</Text>
               <View className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <Text className="text-yellow-900 leading-relaxed italic">"{item.notes}"</Text>
               </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
