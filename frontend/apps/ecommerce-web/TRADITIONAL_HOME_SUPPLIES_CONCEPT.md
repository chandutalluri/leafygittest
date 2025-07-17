# Traditional Home Supplies Concept Documentation

## Overview

The Traditional Home Supplies feature implements an authentic Indian household provisional list system that fundamentally differs from typical e-commerce product purchasing. This is NOT a product page - it's a monthly household supplies preparation system that mirrors traditional Indian family shopping patterns.

## Core Concept

### What It Is
- **Monthly Provisional List**: Customers prepare their entire month's household supplies list at once
- **Bulk Selection**: Items are selected with flexible quantities starting from 10g for expensive spices
- **Single Cart Addition**: The entire provisional list is added to cart as ONE item, not individual products
- **Total Amount Calculation**: Running total automatically updates as items are selected

### What It Is NOT
- Individual product purchasing
- Regular e-commerce shopping experience
- Item-by-item cart additions
- Standard product catalog browsing

## Technical Implementation

### Frontend Architecture

#### Key Components
1. **Traditional Orders Page** (`/pages/traditional.tsx`)
   - Dual view modes: List view (quick selection) and Box view (detailed browsing)
   - Automatic total calculation
   - Bulk item selection with checkboxes
   - Quantity selectors with predefined increments

2. **State Management**
   - `selectedItems`: Set of selected item IDs
   - `quantities`: Object mapping item ID to selected quantity
   - `qualityTier`: Current quality level (ordinary/medium/best)
   - `viewMode`: Current display mode (list/box)

#### Critical Functions

```typescript
// Calculate total amount for provisional list
const calculateTotalAmount = (): number => {
  let total = 0;
  selectedItems.forEach(itemId => {
    const item = items.find(i => i.id === itemId);
    const quantity = quantities[itemId] || 0;
    if (item && quantity > 0) {
      total += getPrice(item) * quantity;
    }
  });
  return total;
};

// Add entire provisional list as single cart item
const addProvisionalListToCart = () => {
  const totalAmount = calculateTotalAmount();
  const itemCount = selectedItems.size;
  
  // Create list description
  const selectedItemsList: string[] = [];
  selectedItems.forEach(itemId => {
    const item = items.find(i => i.id === itemId);
    const quantity = quantities[itemId] || 0;
    if (item && quantity > 0) {
      selectedItemsList.push(`${quantity} ${item.unit} ${item.name_telugu || item.name}`);
    }
  });

  // Add as single cart item
  addItem({
    id: `traditional-${Date.now()}`,
    name: `Traditional Home Supplies (${itemCount} items)`,
    name_telugu: `సాంప్రదాయ గృహావసరాలు (${itemCount} వస్తువులు)`,
    price: totalAmount,
    unit: 'list',
    category: 'Traditional Provisional List',
    branchId: selectedBranch?.id?.toString() || '1',
    description: selectedItemsList.join(', ')
  });
};
```

### Backend Integration

#### API Endpoints
- **GET /api/traditional/items** - Retrieve all traditional items with Telugu translations
- **GET /api/traditional/categories** - Get item categories
- **POST /api/traditional/orders** - Submit provisional list orders

#### Database Tables

1. **traditional_items**
   ```sql
   CREATE TABLE traditional_items (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     name_telugu VARCHAR(255),
     category VARCHAR(100),
     unit VARCHAR(50),
     base_price DECIMAL(10,2),
     is_available BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **branch_traditional_items**
   ```sql
   CREATE TABLE branch_traditional_items (
     id SERIAL PRIMARY KEY,
     branch_id INTEGER REFERENCES branches(id),
     item_id INTEGER REFERENCES traditional_items(id),
     ordinary_price DECIMAL(10,2),
     medium_price DECIMAL(10,2),
     best_price DECIMAL(10,2),
     is_available BOOLEAN DEFAULT true
   );
   ```

3. **traditional_orders**
   ```sql
   CREATE TABLE traditional_orders (
     id SERIAL PRIMARY KEY,
     customer_id INTEGER,
     branch_id INTEGER,
     total_amount DECIMAL(10,2),
     quality_tier VARCHAR(20),
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

#### Service Integration

The Traditional Orders service (port 3050) integrates with:
- **Marketplace Management** (port 3036) - Vendor relationships
- **Order Management** (port 3023) - Order processing
- **Multi-Language** (port 3019) - Telugu translations
- **Payment Processing** (port 3026) - Transaction handling
- **Notification** (port 3017) - Order confirmations
- **Shipping Delivery** (port 3031) - Logistics
- **Identity Access** (port 3020) - Authentication
- **Integration Hub** (port 3032) - External services

### Data Flow

1. **Page Load**: Fetch traditional items and categories from API
2. **Item Selection**: User checks items and sets quantities
3. **Real-time Calculation**: Total amount updates automatically
4. **List Submission**: Entire provisional list added as single cart item
5. **Order Processing**: Standard checkout flow processes the list

### Quality Tiers

Three pricing levels available:
- **Ordinary** (సాధారణ): Base pricing for budget-conscious families
- **Medium** (మధ్యమ): Standard quality with moderate pricing
- **Best** (అత్యుత్తమ): Premium quality for discerning customers

### Branch-Specific Features

- Each branch can enable/disable traditional orders service
- Branch-specific pricing for all three quality tiers
- Availability varies by branch location
- Settings stored in `branches.settings` JSONB field

## User Experience Guidelines

### Design Principles
1. **Speed**: 2-minute ordering concept for busy families
2. **Familiarity**: Mirrors traditional Indian shopping lists
3. **Flexibility**: Quantity options from 10g to 1kg+ for various items
4. **Clarity**: Total amount always visible and updating
5. **Efficiency**: Bulk selection with single cart addition

### Mobile Optimization
- Touch-friendly quantity selectors
- Sticky total amount display at bottom
- Optimized for one-handed operation
- Quick selection buttons for common quantities

### Telugu Localization
- All item names in Telugu script
- Category names translated
- Quality tier descriptions in Telugu
- Full bi-lingual support throughout interface

## Development Guidelines

### Code Standards
- Use TypeScript interfaces for all data structures
- Implement proper error handling for API calls
- Maintain state consistency across view modes
- Follow established naming conventions

### Testing Considerations
- Test with various item combinations
- Verify total calculations across quality tiers
- Ensure proper cart integration
- Validate branch-specific pricing

### Performance Optimization
- Pre-load traditional items data
- Cache category and branch information
- Minimize re-renders during quantity updates
- Optimize API calls with proper caching

## Future Enhancements

### Planned Features
- Saved provisional list templates
- Seasonal item recommendations
- Family size-based quantity suggestions
- Recurring monthly orders
- Festival-specific item collections

### Integration Opportunities
- Nutrition tracking for selected items
- Budget planning tools
- Inventory availability alerts
- Bulk discount calculations
- Community sharing of lists

## Important Notes

### Critical Implementation Rules
1. **Never treat as individual products** - Always maintain list concept
2. **Single cart item only** - Entire list becomes one cart entry
3. **Preserve Telugu authenticity** - Maintain cultural accuracy
4. **Branch context required** - All operations need branch selection
5. **Quality tier consistency** - Maintain pricing tier throughout selection

### Common Pitfalls to Avoid
- Converting to standard product catalog
- Adding items individually to cart
- Losing total amount calculation
- Breaking Telugu translations
- Ignoring branch-specific settings

This documentation serves as the definitive guide for understanding and maintaining the Traditional Home Supplies provisional list concept. Always refer to this document before making changes to ensure the authentic Indian household shopping experience is preserved.