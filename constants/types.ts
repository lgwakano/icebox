export type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  category?: string;
  photoUri?: string;
  location?: 'Fridge' | 'Freezer' | 'Pantry';
  unit?: string;
  notes?: string;
  barcodeId?: string;
  dateAdded?: string;
  scanned?: boolean;
};
