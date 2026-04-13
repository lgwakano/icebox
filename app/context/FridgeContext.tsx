import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { FoodItem } from '../../constants/types';
import { loadItems, saveItems } from '../../services/storage';
import { addDays } from 'date-fns';

const MOCK_DATA: FoodItem[] = [
  { id: 'mock-1', name: 'Waitrose Pineapple', quantity: 1, expiryDate: addDays(new Date(), 5).toISOString(), dateAdded: new Date().toISOString(), category: 'Fruits', location: 'Fridge' },
  { id: 'mock-2', name: 'Ribeye Steak', quantity: 2, expiryDate: addDays(new Date(), 2).toISOString(), dateAdded: new Date().toISOString(), category: 'Meat', location: 'Fridge' },
  { id: 'mock-3', name: 'Organic Carrots', quantity: 1, expiryDate: addDays(new Date(), 9).toISOString(), dateAdded: new Date().toISOString(), category: 'Vegetables', location: 'Fridge' },
  { id: 'mock-4', name: 'Atlantic Salmon', quantity: 2, expiryDate: addDays(new Date(), -1).toISOString(), dateAdded: new Date().toISOString(), category: 'Fish', location: 'Fridge' },
  { id: 'mock-5', name: 'Cheddar Cheese', quantity: 1, expiryDate: addDays(new Date(), 14).toISOString(), dateAdded: new Date().toISOString(), category: 'Dairy', location: 'Fridge' },
  { id: 'mock-6', name: 'Coca Cola', quantity: 6, expiryDate: addDays(new Date(), 30).toISOString(), dateAdded: new Date().toISOString(), category: 'Beverages', location: 'Fridge' },
  { id: 'mock-7', name: 'Potato Chips', quantity: 1, expiryDate: addDays(new Date(), 60).toISOString(), dateAdded: new Date().toISOString(), category: 'Snacks', location: 'Pantry' },
];

interface FridgeContextType {
  items: FoodItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<FoodItem>) => void;
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
      
      // Inject our master mock data if it's not already there
      const existingIds = new Set(loadedItems.map(i => i.id));
      const freshMocks = MOCK_DATA.filter(i => !existingIds.has(i.id));
      
      const finalItems = [...freshMocks, ...loadedItems];
      setItems(finalItems);
      
      if (freshMocks.length > 0) {
        await saveItems(finalItems);
      }
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

  // Update an existing item
  const updateItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const updatedItems = items.map(item => item.id === id ? { ...item, ...updates } : item);
      await saveItems(updatedItems);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating item in fridge:', error);
    }
  };

  // Load items when the provider is mounted (i.e., on initial render)
  useEffect(() => {
    loadFridgeItems();
  }, []); // Empty dependency array means it runs once after initial render

  return (
    <FridgeContext.Provider value={{ items, addItem, removeItem, updateItem }}>
      {children}
    </FridgeContext.Provider>
  );
};

export default FridgeProvider; // Add the default export
