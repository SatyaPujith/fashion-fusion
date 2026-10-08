# Quick Reference Guide - Fashion Fusion

## 🚀 Getting Started (30 Seconds)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run the app
npm run dev

# 3. Open browser
http://localhost:3000
```

App works immediately with demo data!

---

## 🛍️ Connect Shopify (5 Minutes)

### Get Credentials:
1. Shopify Admin → Settings → Apps → Develop apps
2. Create app → Configure Storefront API
3. Enable: `unauthenticated_read_product_listings`
4. Copy token (shpat_xxx) + domain

### Configure:
Click "Setup Shopify" button in app → Enter credentials → Test → Save

OR add to `.env.local`:
```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
```

---

## 📂 Project Structure

```
src/
├── services/
│   └── shopifyAPI.ts          # Shopify API client
├── hooks/
│   └── useProducts.tsx        # Product data hook
├── components/
│   ├── ShopifyConfig.tsx      # Setup UI
│   ├── ProductCatalog.tsx     # Product grid
│   ├── TryOnStudio.tsx        # Virtual try-on
│   └── FittingRoom.tsx        # Size recommendations
├── utils/
│   ├── fitEngine.ts           # Size logic
│   └── imageOptimization.ts   # Image helpers
└── types/
    ├── fashion.ts             # App types
    └── shopify.ts             # Shopify types
```

---

## 🔑 Key Code Examples

### Fetch Products:
```typescript
import { useProducts } from './hooks/useProducts';

function MyComponent() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{products.map(p => ...)}</div>;
}
```

### Optimize Images:
```typescript
import { ImageSizes } from './utils/imageOptimization';

const thumbnailUrl = ImageSizes.thumbnail(product.image.url);
const largeUrl = ImageSizes.large(product.image.url);
```

### Test Shopify Connection:
```typescript
import { createShopifyService } from './services/shopifyAPI';

const service = createShopifyService(config);
const result = await service.testConnection();
console.log(result.success); // true/false
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| "No products" | Check product types in Shopify (Tops, Bottoms, etc.) |
| "Connection failed" | Verify token and domain format |
| "Images not loading" | Check Shopify CDN access |
| Dependencies error | Use `npm install --legacy-peer-deps` |

---

## 📝 Environment Variables

```env
# Required for Shopify
VITE_SHOPIFY_STORE_DOMAIN=store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
VITE_SHOPIFY_API_VERSION=2024-01

# Optional
GEMINI_API_KEY=xxx
APP_URL=http://localhost:3000
```

---

## 🎯 Common Tasks

### Add New Product Category:
1. Update `ProductCategory` type in `src/types/fashion.ts`
2. Add mapping in `shopifyAPI.ts` → `mapProductTypeToCategory()`
3. Add SVG shape in `mapCategoryToSvgShape()`

### Change Product Query:
Edit `src/services/shopifyAPI.ts` → `buildProductQuery()`:
```typescript
query: 'product_type:YOUR_TYPE OR tag:YOUR_TAG'
```

### Customize Image Sizes:
Edit `src/utils/imageOptimization.ts` → `ImageSizes`:
```typescript
myCustomSize: (url: string) => 
  transformShopifyImage(url, { width: 500, height: 600 })
```

---

## 🧪 Testing Checklist

**Before Committing:**
- [ ] App runs: `npm run dev`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Works without Shopify (demo data)
- [ ] Works with Shopify credentials
- [ ] Mobile responsive
- [ ] Images load
- [ ] Cart functions work

---

## 📚 Documentation Links

- **Full Setup**: [`SHOPIFY_SETUP_GUIDE.md`](./SHOPIFY_SETUP_GUIDE.md)
- **Architecture**: [`INTEGRATION_PLAN.md`](./INTEGRATION_PLAN.md)
- **Summary**: [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)
- **Main Docs**: [`README.md`](./README.md)

---

## 🚀 Deployment

### Build for Production:
```bash
npm run build
```

### Environment Variables (Production):
Set in your hosting platform:
- Vercel/Netlify: Add in dashboard
- Docker: Use .env file
- Cloud: Use secrets manager

---

## 💡 Pro Tips

1. **Use demo data first** - Test features before connecting Shopify
2. **Start with 10 products** - Easier to verify integration
3. **Check console logs** - Detailed error messages
4. **Test connection** - Use the "Test Connection" button before saving
5. **Mobile testing** - Most fashion shoppers use mobile

---

## 🔥 Hot Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Test production build

# Maintenance
npm run lint             # Type check
npm run clean            # Clean build files
npm install --legacy-peer-deps  # Fix dependency issues
```

---

## 📞 Need Help?

1. Check browser console for errors
2. Review documentation files
3. Test with demo data first
4. Verify Shopify credentials
5. Check network tab in DevTools

---

**Quick Reference Version 1.0**  
Last Updated: October 7, 2026
