# Icebox - React Web App Features

## Core Functionality
Icebox is a food and grocery inventory management application designed to track items across different storage locations.

### 1. Storage Locations
- **Fridge**
- **Freezer**
- **Pantry**

### 2. Item Categorization
Items are strictly categorized to easily group them:
- Proteins
- Vegetables
- Seasonings
- Condiments
- Breakfast
- Beverages
- Carbs

### 3. Expiration Tracking
- Tracks the specific expiration date of each item.
- Calculates and displays expiration status: `fresh`, `warning` (approaching expiration), or `expired`.

### 4. Quantity & Unit Management
Tracks how much of an item is left using fine-grained units:
- Volume: `cups`, `tbsp`, `tsp`, `ml`, `l`
- Weight: `lbs`, `oz`
- Count: `pieces`

### 5. Detailed Item Metadata
Each food item supports storing:
- Item Name
- Category
- Location
- Expiration Date
- Quantity & Unit
- Optional Notes
- Optional Photo (Base64 string or URL)
- Optional Barcode ID
- Date Added

## Key Screens
1. **Home / Dashboard (`Home.tsx`)**
   - Displays listed inventory items grouped by location or category.
   - Shows quick-glance status of items (fresh vs expired).
   - Navigation to add or edit items.
2. **Add / Edit Item Form (`AddItem.tsx`)**
   - A multi-input form handling validation and submission of new inventory.
   - Allows inline editing for existing items.

## Current Web Tech Stack Context
- **UI:** React DOM, Tailwind CSS
- **Components:** Radix UI Primitives, `shadcn/ui` based
- **State Management:** React hooks + `@tanstack/react-query`
- **Routing:** React Router (conditionally rendered views via state currently in `App.tsx`)
