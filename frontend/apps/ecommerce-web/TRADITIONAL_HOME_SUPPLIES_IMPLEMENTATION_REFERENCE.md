# Traditional Home Supplies Implementation Reference

## CRITICAL: Read This Before Any Changes

This document serves as the definitive reference for the Traditional Home Supplies feature. This is NOT a typical e-commerce product page - it implements an authentic Indian household provisional list concept that must be preserved.

## Core Implementation Principle

**"Monthly Household Supplies List, Not Individual Products"**

The Traditional Home Supplies feature allows customers to prepare their monthly household needs in a single list, see the total amount automatically update, and add the ENTIRE list to cart as ONE item. This mirrors how Indian families traditionally shop for monthly groceries.

## Key Implementation Files

### Frontend Files (Desktop Web)
```
frontend/apps/ecommerce-web/src/pages/traditional.tsx - Main page implementation
frontend/apps/ecommerce-web/src/types/traditional.ts - TypeScript interfaces
frontend/apps/ecommerce-web/src/lib/stores/useCartStore.ts - Cart integration
frontend/apps/ecommerce-web/src/lib/stores/useBranchStore.ts - Branch context
frontend/apps/ecommerce-web/src/lib/stores/useAuthStore.ts - Authentication
```

### Backend Integration Points
```
server/traditional-orders-service.js - Traditional Orders microservice (port 3050)
server/unified-gateway-fixed.js - Gateway routing (/api/traditional/*)
server/direct-data-gateway.js - Data access layer (port 8081)
```

### Database Tables
```
traditional_items - Master item list with Telugu translations
branch_traditional_items - Branch-specific pricing for 3 quality tiers
traditional_categories - Item categories with Telugu names
traditional_orders - Complete provisional list orders
traditional_order_items - Individual items within each order
```

## Implementation Architecture

### State Management Pattern
```typescript
// Essential state variables
const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
const [quantities, setQuantities] = useState<{[key: number]: number}>({});
const [qualityTier, setQualityTier] = useState<QualityTier>('medium');
const [viewMode, setViewMode] = useState<'list' | 'box'>('list');

// Core calculation function
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
```

### Critical Cart Integration
```typescript
// NEVER add individual items - always add as complete list
const addProvisionalListToCart = () => {
  const totalAmount = calculateTotalAmount();
  const itemCount = selectedItems.size;
  
  // Create description of selected items
  const selectedItemsList: string[] = [];
  selectedItems.forEach(itemId => {
    const item = items.find(i => i.id === itemId);
    const quantity = quantities[itemId] || 0;
    if (item && quantity > 0) {
      selectedItemsList.push(`${quantity} ${item.unit} ${item.name_telugu || item.name}`);
    }
  });

  // Add as SINGLE cart item representing entire provisional list
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

  // Reset state after successful addition
  setSelectedItems(new Set());
  setQuantities({});
};
```

### API Integration Pattern
```typescript
// Fetch traditional items with branch context
const fetchTraditionalItems = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/traditional/items?branchId=${selectedBranch?.id || 1}`);
    const data = await response.json();
    setItems(data.items || []);
    setCategories(data.categories || []);
  } catch (error) {
    console.error('Failed to load traditional items:', error);
    toast.error('Failed to load items');
  } finally {
    setLoading(false);
  }
};
```

## User Interface Guidelines

### Essential UI Components

1. **Hero Section**
   - Clearly identify as "Traditional Home Supplies"
   - Include Telugu translation: "సాంప్రదాయ గృహావసరాలు"
   - Show key features: "2-Min Order", "Bulk Orders", "3 Quality Tiers"

2. **View Mode Toggle**
   - List View: Quick checkbox selection with quantity buttons
   - Box View: Detailed item cards with images and descriptions

3. **Quality Tier Selector**
   - Ordinary (సాధారణ): Budget-friendly option
   - Medium (మధ్యమ): Standard quality (default)
   - Best (అత్యుత్తమ): Premium quality

4. **Running Total Display**
   - Fixed at bottom of page
   - Shows selected item count and total amount
   - Updates automatically as items are selected/deselected

5. **Action Button**
   - Text: "Add Entire List to Cart"
   - Telugu: "మొత్తం జాబితాను కార్ట్‌కు జోడించండి"
   - Only enabled when items are selected

### Visual Design Standards
```css
/* Hero gradient */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Quality tier colors */
.ordinary { color: #6b7280; } /* Gray */
.medium { color: #10b981; }   /* Green */
.best { color: #f59e0b; }     /* Amber */

/* Total amount styling */
.total-display {
  position: fixed;
  bottom: 0;
  background: white;
  border-top: 2px solid #10b981;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Data Flow Architecture

### 1. Page Load Sequence
```
User visits /traditional → Check authentication → Load branch context → 
Fetch traditional items → Display items with pricing → Ready for selection
```

### 2. Item Selection Flow
```
User checks item → Add to selectedItems Set → User sets quantity → 
Update quantities object → Recalculate total → Update UI display
```

### 3. Order Submission Flow
```
User clicks "Add Entire List" → Validate selections → Calculate total → 
Create cart item → Add to cart → Show success message → Reset state
```

## Database Interaction Patterns

### Item Loading Query
```sql
SELECT 
    ti.id, ti.name, ti.name_telugu, ti.category, ti.unit,
    bti.ordinary_price, bti.medium_price, bti.best_price,
    bti.is_available
FROM traditional_items ti
INNER JOIN branch_traditional_items bti ON ti.id = bti.item_id
WHERE ti.is_available = true 
    AND bti.branch_id = ? 
    AND bti.is_available = true
ORDER BY ti.category, ti.name;
```

### Order Creation Transaction
```sql
BEGIN;
-- Create main order
INSERT INTO traditional_orders (...) VALUES (...);
-- Add order items
INSERT INTO traditional_order_items (...) VALUES (...);
COMMIT;
```

## Quality Assurance Checklist

### Before Making Changes
- [ ] Read this entire document
- [ ] Understand the provisional list concept
- [ ] Review existing implementation
- [ ] Test with actual Telugu data

### Testing Requirements
- [ ] Verify total calculation accuracy
- [ ] Test all three quality tiers
- [ ] Confirm cart integration works
- [ ] Validate Telugu translations display
- [ ] Check branch-specific pricing
- [ ] Test view mode switching
- [ ] Verify mobile responsiveness

### Common Mistakes to Avoid
1. **Converting to product catalog** - This is NOT an e-commerce product page
2. **Adding individual items to cart** - Always add entire list as one item
3. **Removing total calculation** - Running total is essential to concept
4. **Breaking Telugu support** - All text must support dual language
5. **Ignoring quality tiers** - Three-tier pricing is core feature

## Debugging Guidelines

### Common Issues and Solutions

1. **Items not loading**
   - Check branch context in API call
   - Verify database has branch_traditional_items data
   - Confirm Traditional Orders service is running (port 3050)

2. **Total calculation incorrect**
   - Debug getPrice() function for quality tier selection
   - Verify quantities state is updating correctly
   - Check for floating point precision issues

3. **Cart integration failing**
   - Ensure cart store is properly imported
   - Verify addItem function signature matches
   - Check for missing branchId in cart item

4. **Telugu text not displaying**
   - Verify font supports Telugu script
   - Check database has name_telugu values
   - Confirm proper encoding in API responses

### Development Environment Setup
```bash
# Start Traditional Orders service
cd server && node traditional-orders-service.js

# Start frontend with proper environment
cd frontend/apps/ecommerce-web && npm run dev

# Verify database connection
psql -d leafyhealth -c "SELECT COUNT(*) FROM traditional_items;"
```

## Performance Considerations

### Optimization Strategies
1. **Lazy load images** - Only load item images when in view
2. **Debounce calculations** - Prevent excessive total recalculations
3. **Cache category data** - Categories rarely change
4. **Pagination for mobile** - Limit initial item load

### Memory Management
```typescript
// Cleanup effect for component unmount
useEffect(() => {
  return () => {
    setSelectedItems(new Set());
    setQuantities({});
  };
}, []);
```

## Future Enhancement Guidelines

### Approved Enhancement Areas
1. **Saved Lists** - Allow customers to save favorite provisional lists
2. **Smart Suggestions** - Recommend items based on family size
3. **Seasonal Collections** - Special festival-specific item groups
4. **Bulk Discounts** - Volume-based pricing for large orders

### Forbidden Changes
1. **Individual product purchasing** - Breaks core concept
2. **Removing total display** - Essential to user experience
3. **English-only interface** - Must maintain Telugu support
4. **Standard e-commerce patterns** - This is intentionally different

## Contact and Support

When modifying this feature:
1. Always refer to this documentation first
2. Test with authentic Telugu data
3. Maintain the provisional list concept
4. Preserve cultural authenticity
5. Document any changes in replit.md

**Remember: This is an authentic Indian household supplies ordering system, not a typical e-commerce product catalog. The implementation must reflect traditional Indian family shopping patterns.**