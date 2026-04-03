# Icebox - Smart Food Inventory Features

## Core Functionality
Icebox is a primary "Scanner First" Micro SaaS mobile application designed to track food items across different storage locations with a premium, friction-less experience.

### 1. Storage Locations & Filtering
- **Fridge** (Default)
- **Freezer**
- **Pantry**
- **Quick Filters:** All, Fresh, Soon, Expired, and location-based tabs.

### 2. Item Categorization
Items are categorized for efficient tracking and visual identification:
- Proteins (e.g. Chicken, Eggs)
- Vegetables (e.g. Lettuce, Spinach)
- Breakfast (e.g. Milk, Yogurt)
- Carbs (e.g. Bread)
- Seasonings & Condiments
- Beverages

### 3. Expiration Tracking (Intelligence)
- **Automatic Classification:** Integration with OpenFoodFacts API for automated item classification.
- **Visual Status:**
  - `Fresh`: Safe to consume.
  - `Soon`: Approaching expiration (within 3 days).
  - `Expired`: Past expiration date.
- **Smart Notifications:** (Planned) Push updates for items nearing expiration.

### 4. Quantity & Unit Management
- Flexible unit tracking: `oz`, `lbs`, `ml`, `l`, `cups`, `pieces`.
- Real-time quantity updates from the dashboard items cards.

### 5. Quick Actions & Discovery
- **Quick Add:** One-tap entry for common items (Milk, Bread, Eggs, etc.) with pre-filled defaults.
- **Global Search:** Real-time search across all inventory items by name, category, or location.
- **Scanner Integration:** (Mobile Priority) Barcode scanning via OpenFoodFacts for instant data entry.

## Key UI/UX Elements (Mobile First)
1. **Dynamic Dashboard (`index.tsx`)**
   - **Integrated Header:** Displays "IceBox" branding with live status counts (Fresh/Soon/Expired).
   - **Search & Filters:** Prominent search bar and horizontal scrolling filter chips.
   - **Quick Add Grid:** Visual tiles for frequently added items.
   - **Premium Item Cards:** Detailed cards showing food icon, status alerts, quantity, location, and expiration countdown.
   - **Floating Action Button (FAB):** Persistent access to scan/add new items.

2. **Add / Edit Item Flow (`add.tsx`)**
   - Premium form experience with native-first UI primitives.
   - Intelligent auto-completion based on item name or barcode.

## Technology Stack
- **Framework:** Expo (React Native) SDK 54
- **Styling:** NativeWind (Tailwind CSS for Native)
- **Icons:** Feather & Material Icons
- **Data Persistence:** React Hooks + Context (Planned transition to local SQLite/AsyncStorage)
- **API:** OpenFoodFacts (External Service)
- **Date Handling:** `date-fns`
