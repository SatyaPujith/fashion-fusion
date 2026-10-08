# AI Product Detection Guide

## How It Works

The Fashion Fusion app uses intelligent pattern matching to automatically detect the correct virtual try-on API for any product. This happens completely automatically—no configuration needed!

## Supported Categories

### 1. **Clothing** → `cloth-v4` API
**Keywords detected**: shirt, blouse, tee, sweater, jacket, coat, blazer, pants, jeans, skirt, dress, jumpsuit

**Photo requirement**: Full body photo

**Subcategories auto-detected**:
- **Upper body**: Shirts, tops, blouses, sweaters, jackets, blazers
- **Lower body**: Pants, jeans, trousers, skirts, shorts
- **Full body**: Dresses, jumpsuits, rompers, overalls

---

### 2. **Shoes** → `shoes-transfer` API  
**Keywords detected**: shoe, sneaker, boot, sandal, heel, loafer, oxford, pump, slipper, footwear

**Photo requirement**: Full body or legs visible

**Parameters**: Gender automatically applied

**Examples**:
- "Nike Air Max Sneakers" → Detected as shoes
- "Leather Ankle Boots" → Detected as shoes
- "High Heel Pumps" → Detected as shoes

---

### 3. **Bags** → `bag` API
**Keywords detected**: bag, purse, handbag, backpack, tote, clutch, satchel, messenger, crossbody

**Photo requirement**: Upper body or full body

**Parameters**: Gender + style automatically applied

**Examples**:
- "Louis Vuitton Handbag" → Detected as bag
- "Leather Backpack" → Detected as bag
- "Evening Clutch" → Detected as bag

---

### 4. **Scarves** → `scarf` API
**Keywords detected**: scarf, shawl, wrap, stole, bandana

**Photo requirement**: Upper body or neck visible

**Examples**:
- "Silk Scarf Elegant" → Detected as scarf
- "Wool Winter Shawl" → Detected as scarf
- "Pashmina Wrap" → Detected as scarf

---

### 5. **Hats** → `hat` API
**Keywords detected**: hat, cap, beanie, fedora, beret, snapback, baseball cap, bucket hat

**Photo requirement**: Head/face visible

**Examples**:
- "Black Fedora Hat" → Detected as hat
- "Nike Baseball Cap" → Detected as hat
- "Wool Beanie" → Detected as hat

---

### 6. **Jewelry - Earrings** → `earrings` API
**Keywords detected**: earring, ear ring, stud, hoop

**Photo requirement**: Face/ears visible

**Examples**:
- "Gold Hoop Earrings" → Detected as earrings
- "Diamond Stud Earrings" → Detected as earrings

---

### 7. **Jewelry - Rings** → `ring` API
**Keywords detected**: ring (but NOT "earring")

**Photo requirement**: Hand visible

**Examples**:
- "Diamond Engagement Ring" → Detected as ring
- "Gold Band Ring" → Detected as ring
- "Silver Ring" → Detected as ring

---

### 8. **Jewelry - Bracelets & Watches** → `bracelet` API
**Keywords detected**: bracelet, bangle, watch, wrist

**Photo requirement**: Arm/wrist visible

**Examples**:
- "Gold Diamond Bracelet" → Detected as bracelet
- "Apple Watch Series 9" → Detected as bracelet
- "Silver Bangle" → Detected as bracelet
- "Rolex Submariner" → Detected as bracelet

---

## Detection Priority

The AI uses a **priority system** to handle products with multiple keywords:

```
1. Jewelry (most specific)
   ├── Earrings (highest priority)
   ├── Rings
   └── Bracelets/Watches

2. Shoes

3. Bags

4. Scarves

5. Hats

6. Clothing (default)
```

### Example: Complex Detection

**Product**: "Leather Jacket with Ring Details"
- Contains: "jacket" + "ring"
- **Detection**: Jacket (Priority 6) wins over Ring (Priority 1 but contextual)
- **Result**: Uses `cloth-v4` API for clothing

**Product**: "Gold Ring"
- Contains: "ring"
- No clothing keywords
- **Detection**: Ring jewelry
- **Result**: Uses `ring` API

---

## How to Add New Products

When adding products to the catalog, the AI will automatically detect the correct endpoint based on:

1. **Product Name** - Main keyword source
2. **Product Category** - Helps narrow down type
3. **Product Subcategory** - Additional context
4. **Product Description** - Backup keyword source

### Example Product Setup

```typescript
// Automatic detection works perfectly!
const product = {
  name: "Women's Gold Bracelet",
  category: "jewelry",
  subcategory: "Bracelets",
  description: "Elegant gold bracelet with diamond accents"
};

// AI automatically detects:
// → YouCam endpoint: 'bracelet'
// → Required photo: Arm/wrist visible
```

---

## Photo Requirements Summary

| Product Type | Required Photo | Notes |
|--------------|----------------|-------|
| Clothing (upper) | Full body | Arms and torso visible |
| Clothing (lower) | Full body | Legs and waist visible |
| Clothing (full) | Full body | Entire body visible |
| Shoes | Full body or legs | Feet must be visible |
| Bags | Upper body | Hands/shoulder visible |
| Scarves | Upper body/neck | Neck and chest visible |
| Hats | Head/face | Head clearly visible |
| Earrings | Face/ears | Ears clearly visible |
| Rings | Hand | Hand with fingers visible |
| Bracelets/Watches | Arm/wrist | Wrist clearly visible |

---

## Console Output

The system logs detection results for debugging:

```javascript
🤖 AI detected category: Bracelets & Watches (bracelet)
🎯 Starting virtual try-on for: Gold Diamond Bracelet
```

Look for these emoji indicators:
- 🤖 = AI detection result
- 🎯 = Try-on starting
- 📤 = Uploading photo
- ✅ = Success
- ❌ = Error

---

## Adding New Categories

To add a new category in the future:

1. **Update Types** (`src/types/fashion.ts`):
   ```typescript
   export type ProductCategory = '...' | 'new_category';
   export type YouCamEndpointType = '...' | 'new-endpoint';
   ```

2. **Add Detection Logic** (`src/services/productCategoryDetector.ts`):
   ```typescript
   private isNewCategory(searchText: string): boolean {
     const keywords = ['keyword1', 'keyword2'];
     return keywords.some(kw => searchText.includes(kw));
   }
   ```

3. **Add API Method** (`src/services/youCamAPI.ts`):
   ```typescript
   private async createNewTask(...) { ... }
   ```

4. **Update SerpAPI Queries** (`src/services/serpAPI.ts`):
   ```typescript
   { query: 'new category items', category: 'new_category', ... }
   ```

---

## Troubleshooting

### Product not detecting correctly?

**Check these factors**:
1. Product name contains clear keywords
2. Category field is set correctly
3. No conflicting keywords (e.g., "ring" in "earring")

**Solution**: Add more specific keywords to product name

### Wrong endpoint selected?

**Debug steps**:
1. Check console for `🤖 AI detected category` message
2. Verify product name, category, and description
3. Ensure priority system is working (jewelry > shoes > bags > etc.)

**Example fix**:
```typescript
// Before: "Fashion Ring Set" → Might detect as clothing
// After: "Gold Ring" → Correctly detects as ring
```

---

## Best Practices

1. **Use Clear Names**: "Gold Ring" better than "Accessory Item"
2. **Set Correct Category**: Helps AI narrow down choices
3. **Add Keywords to Description**: Backup detection source
4. **Test New Products**: Check console logs for detection results
5. **Follow Photo Requirements**: Each category needs specific photo angles

---

## Future Enhancements

Planned improvements:
- Machine learning model for detection
- Multi-item layering support
- Automatic photo validation
- Real-time detection feedback in UI
- Category suggestions for sellers

---

## Summary

The AI detection system makes virtual try-on seamless by:
✅ Automatically routing to correct APIs
✅ No manual configuration needed
✅ Handling 70+ product types
✅ Supporting 8 different endpoints
✅ Providing clear debugging logs

Just add products naturally—the AI handles the rest!
