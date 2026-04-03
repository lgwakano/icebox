import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useFridge } from '../context/FridgeContext';
import { guessItemProperties, SmartGuessResponse } from '../../services/SmartGuess';
import { addDays, formatISO } from 'date-fns';
import uuid from 'react-native-uuid';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getFoodIcon } from '../../utils/foodIcons';

export default function AddItemScreen() {
  const router = useRouter();
  const { addItem } = useFridge();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState<SmartGuessResponse | null>(null);

  // Debounced API call
  useEffect(() => {
    if (name.length < 3) {
      setGuess(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await guessItemProperties(name);
      setGuess(res);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [name]);

  const handleSave = () => {
    if (!name) return;

    const expiryDays = guess?.shelfLifeDays || 7;
    const expiryDate = formatISO(addDays(new Date(), expiryDays));

    addItem({
      id: uuid.v4().toString(),
      name,
      quantity: 1,
      expiryDate,
      category: guess?.category || 'General',
      location: guess?.location || 'Fridge',
      dateAdded: formatISO(new Date()),
      scanned: false,
    });

    router.replace('/');
  };

  return (
    <View className="flex-1 bg-white pt-16 px-6">
      <View className="flex-row items-center mb-8">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text className="text-2xl font-bold">Add Item</Text>
      </View>

      <Text className="text-gray-500 mb-2 font-medium ml-1">What are you adding?</Text>
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-6">
        <Feather name="search" size={20} color="gray" className="mr-3" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Milk, Apples, Chicken"
          className="flex-1 text-lg"
          autoFocus
        />
        {name.length > 0 && (
          <Pressable onPress={() => setName('')}>
            <Feather name="x-circle" size={20} color="gray" />
          </Pressable>
        )}
      </View>

      {/* Smart Guess Card */}
      {loading ? (
        <View className="items-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text className="text-slate-500 font-medium mt-4 tracking-wide uppercase text-[10px]">Thinking...</Text>
        </View>
      ) : guess ? (
        <Card className="bg-blue-50 border-blue-100 mb-8 items-center border-l-4 border-blue-500 p-6">
          <View className="bg-white p-4 rounded-full border border-blue-100 mb-4 shadow-sm">
            <MaterialCommunityIcons name={getFoodIcon(name, guess.category)} size={32} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-slate-900 mb-2">Smart Match Found</Text>
          <Text className="text-slate-500 text-center mb-6 leading-relaxed">
             We'll put it in the {guess.location.toLowerCase()}, mark it as {guess.category}, and remind you in {guess.shelfLifeDays} days.
          </Text>
          <View className="flex-row items-center justify-center">
            <Badge icon="map-pin" label={guess.location} variant="default" className="mr-2" />
            <Badge icon="tag" label={guess.category} variant="warning" className="mr-2" />
            <Badge icon="calendar" label={`+${guess.shelfLifeDays} d`} variant="success" />
          </View>
        </Card>
      ) : name.length >= 3 ? (
        <Card className="bg-slate-50 border-slate-200 mb-8 items-center py-8">
          <Feather name="help-circle" size={24} color="#94a3b8" className="mb-2" />
          <Text className="text-slate-500 font-medium">No smart match found. Using defaults.</Text>
        </Card>
      ) : (
        <View className="items-center py-20 opacity-20">
           <MaterialCommunityIcons name="fridge-outline" size={80} color="#94a3b8" />
        </View>
      )}

      <View className="flex-1" />

      {/* Buttons */}
      <Pressable
        onPress={handleSave}
        disabled={name.length === 0}
        className={`py-5 rounded-2xl items-center mb-6 shadow-md shadow-blue-200 ${name.length > 0 ? 'bg-blue-600 active:opacity-80' : 'bg-slate-200'}`}
      >
        <Text className="text-white text-lg font-black tracking-tight">Add to IceBox</Text>
      </Pressable>
    </View>
  );
}
