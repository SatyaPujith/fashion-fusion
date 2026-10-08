# 🚀 SerpAPI Quick Start

## ⚡ 3-Step Setup (2 Minutes)

### Step 1: Get Free API Key
```
1. Visit: https://serpapi.com/users/sign_up
2. Sign up (no credit card needed)
3. Copy your API key from dashboard
```

### Step 2: Add to App
```bash
# Create .env.local file
echo "VITE_SERPAPI_KEY=paste_your_key_here" > .env.local
```

### Step 3: Run
```bash
npm run dev
```

**Done!** Open `http://localhost:3000` and see real Google Shopping products!

---

## 🎯 What You Get

### Without SerpAPI (Free APIs):
- 20 products from FakeStore API
- Basic product images
- Generic product data

### With SerpAPI (Real Google Shopping):
- **37 real fashion products**
- **Professional photography**
- **Clean backgrounds**
- **Real brands (Zara, Nike, H&M, etc.)**
- **Accurate pricing**
- **High-quality images (1000x1000+)**

---

## 💰 Cost

**FREE TIER:**
- 100 searches/month
- No credit card required
- Perfect for development

**App Usage:**
- 6 searches per load
- ~16 loads/month on free tier
- Ideal for testing!

---

## 🔍 How It Works

### Search Queries:
```
1. "women fashion tops elegant" → 8 products
2. "men fashion shirts premium" → 6 products
3. "fashion trousers pants elegant" → 8 products
4. "fashion blazer jacket premium" → 6 products
5. "fashion shoes elegant" → 5 products
6. "fashion bag accessory premium" → 4 products
```

### Product Sources:
- Google Shopping (via SerpAPI)
- Major fashion retailers
- Professional product listings

---

## 📸 Image Quality

### What You Get:
✅ Professional product photography  
✅ White/minimal backgrounds  
✅ Multiple angles available  
✅ High resolution (1000x1000+)  
✅ E-commerce ready  
✅ CDN-hosted (fast loading)  

### Image Examples:
- Clean studio shots
- Consistent lighting
- Professional composition
- Product-focused framing
- Minimal distractions

---

## 🎨 Customization

### Change Search Queries:
Edit `src/services/serpAPI.ts`:

```typescript
const categories = [
  // Change these to your preferences
  { query: 'luxury women fashion tops', category: 'tops', count: 10 },
  { query: 'designer mens shirts', category: 'tops', count: 8 },
  // Add more categories...
];
```

### Filter by Brand:
```typescript
{ query: 'Zara women blouse', category: 'tops', count: 10 }
```

### Filter by Price:
```typescript
{ query: 'fashion tops under $100', category: 'tops', count: 10 }
```

---

## 🐛 Troubleshooting

### No Products Loading?

**Check Console (F12):**
```
✅ Good: "Fetched 37 products from SerpAPI!"
❌ Bad: "SerpAPI Error: Invalid API Key"
```

**Solutions:**
1. Verify `.env.local` exists in project root
2. Check API key is correct (no extra spaces)
3. Restart dev server after adding key
4. Check free tier limit (100/month)

### Images Not Loading?

**Check:**
- Network tab in DevTools
- CORS errors (images are CDN-hosted)
- Internet connection

**Solution:**
Images come from Google CDN - should work by default!

---

## 📊 Console Output

### Success:
```
🔍 Fetching products from Google Shopping via SerpAPI...
✅ Fetched 37 products from SerpAPI!
```

### Fallback (no API key):
```
🌐 Fetching fashion products from free APIs...
✅ Fetched 23 products from Fashion APIs
```

---

## 🎯 Expected Results

### Product Catalog:
- 37 real fashion items
- Professional images
- Real brand names
- Accurate prices
- Multiple categories

### Categories:
- 8 Women's Tops
- 6 Men's Shirts
- 8 Pants/Trousers
- 6 Blazers/Jackets
- 5 Shoes
- 4 Bags/Accessories

---

## 💡 Pro Tips

1. **Free Tier Management**: Use during development, upgrade for production
2. **Cache Results**: Products are cached per session (no repeated API calls)
3. **Customize Searches**: Tailor queries to your target audience
4. **Monitor Usage**: Check SerpAPI dashboard for usage stats
5. **Upgrade Later**: Start free, upgrade when needed

---

## 📚 Resources

- **SerpAPI Dashboard**: [serpapi.com/dashboard](https://serpapi.com/dashboard)
- **API Playground**: [serpapi.com/playground](https://serpapi.com/playground)
- **Documentation**: [serpapi.com/google-shopping-api](https://serpapi.com/google-shopping-api)
- **Pricing**: [serpapi.com/pricing](https://serpapi.com/pricing)

---

## ✅ Quick Checklist

- [ ] Sign up at serpapi.com
- [ ] Get API key
- [ ] Create `.env.local`
- [ ] Add `VITE_SERPAPI_KEY=your_key`
- [ ] Run `npm run dev`
- [ ] See real products!

---

**Ready? Get your key: [serpapi.com/users/sign_up](https://serpapi.com/users/sign_up)** 🚀

**Questions? Check [SERPAPI_SETUP.md](./SERPAPI_SETUP.md) for detailed guide!**
