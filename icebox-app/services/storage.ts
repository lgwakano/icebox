import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../constants/types';

const STORAGE_KEY = '@fridge_items';

export async function saveItems(items: FoodItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function loadItems(): Promise<FoodItem[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}
