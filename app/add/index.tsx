// app/add/index.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import { FoodItem } from '../../constants/types';
import { useFridge } from '../context/FridgeContext';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const {addItem} = useFridge();
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !quantity || !expiryDate) {
      Alert.alert('All fields required');
      return;
    }

    const newItem: FoodItem = {
      id: uuid.v4().toString(),
      name,
      quantity: parseInt(quantity),
      expiryDate,
    };
    
    console.log("New item to save:", newItem);
    await addItem(newItem); // Add item to fridge context
    router.back(); // Close the modal
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#D3D3D3" // Light gray placeholder for good contrast
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#D3D3D3" // Light gray placeholder for good contrast
      />
      <TextInput
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={expiryDate}
        onChangeText={setExpiryDate}
        style={styles.input}
        placeholderTextColor="#D3D3D3" // Light gray placeholder for good contrast
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black', // Black background for the container
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: 'white', // White text color for input fields
    backgroundColor: '#333', // Dark background for the input fields
  },
});
