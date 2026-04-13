const fs = require('fs');
const path = require('path');

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const mockData = [
  { id: 'mock-1', name: 'Waitrose Pineapple', quantity: 1, expiryDate: addDays(5), dateAdded: new Date().toISOString(), category: 'Fruits', location: 'Fridge' },
  { id: 'mock-2', name: 'Ribeye Steak', quantity: 2, expiryDate: addDays(2), dateAdded: new Date().toISOString(), category: 'Meat', location: 'Fridge' },
  { id: 'mock-3', name: 'Organic Carrots', quantity: 1, expiryDate: addDays(9), dateAdded: new Date().toISOString(), category: 'Vegetables', location: 'Fridge' },
  { id: 'mock-4', name: 'Atlantic Salmon', quantity: 2, expiryDate: addDays(-1), dateAdded: new Date().toISOString(), category: 'Fish', location: 'Fridge' },
  { id: 'mock-5', name: 'Cheddar Cheese', quantity: 1, expiryDate: addDays(14), dateAdded: new Date().toISOString(), category: 'Dairy', location: 'Fridge' },
  { id: 'mock-6', name: 'Coca Cola', quantity: 6, expiryDate: addDays(30), dateAdded: new Date().toISOString(), category: 'Beverages', location: 'Fridge' },
  { id: 'mock-7', name: 'Potato Chips', quantity: 1, expiryDate: addDays(60), dateAdded: new Date().toISOString(), category: 'Snacks', location: 'Pantry' },
];

const targetPath = path.join(__dirname, '../constants/mockData.json');
fs.writeFileSync(targetPath, JSON.stringify(mockData, null, 2));

console.log('✅ Successfully seeded mock data to constants/mockData.json');
console.log('Restart or reload your Expo app to see the changes.');
