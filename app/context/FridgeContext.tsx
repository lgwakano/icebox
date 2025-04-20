import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { FoodItem } from '../../constants/types';
import { loadItems, saveItems } from '../../services/storage';

interface FridgeContextType {
  items: FoodItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (id: string) => void;
}

const FridgeContext = createContext<FridgeContextType | undefined>(undefined);

export const useFridge = () => {
  const context = useContext(FridgeContext);
  if (!context) {
    throw new Error('useFridge must be used within a FridgeProvider');
  }
  return context;
};

interface FridgeProviderProps {
  children: ReactNode;
}

const FridgeProvider: React.FC<FridgeProviderProps> = ({ children }) => {
  const [items, setItems] = useState<FoodItem[]>([]);

  // Load items from storage when the provider is first mounted
  const loadFridgeItems = async () => {
    try {
      const loadedItems = await loadItems();
      setItems(loadedItems);
    } catch (error) {
      console.error('Error loading fridge items:', error);
    }
  };

  // Add a new item to the fridge and update state
  const addItem = async (newItem: FoodItem) => {
    try {
      const updatedItems = [newItem, ...items]; // Create a new array to trigger re-render
      await saveItems(updatedItems); // Save the updated list to storage
      setItems(updatedItems); // Update the state with the new list
    } catch (error) {
      console.error('Error adding item to fridge:', error);
    }
  };

  // Remove an item from the fridge and update state
  const removeItem = async (id: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== id); // Filter out the removed item
      await saveItems(updatedItems); // Save the updated list to storage
      setItems(updatedItems); // Update the state with the new list
    } catch (error) {
      console.error('Error removing item from fridge:', error);
    }
  };

  // Load items when the provider is mounted (i.e., on initial render)
  useEffect(() => {
    loadFridgeItems();
  }, []); // Empty dependency array means it runs once after initial render

  return (
    <FridgeContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </FridgeContext.Provider>
  );
};

export default FridgeProvider; // Add the default export
