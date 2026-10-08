# SerpAPI Setup Guide

## 🎯 What is SerpAPI?

SerpAPI fetches **real fashion products** from Google Shopping with:
- ✅ Professional product images
- ✅ Clean/minimal backgrounds
- ✅ Real pricing and brands
- ✅ High-quality product data

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your API Key

1. Go to [https://serpapi.com/](https://serpapi.com/)
2. Click **"Sign Up"** or **"Get API Key"**
3. Create a free account
4. Copy your API key from the dashboard

### Step 2: Add to Your App

Create `.env.local` file:

```bash
VITE_SERPAPI_KEY=your_serpapi_key_here
```

Replace `your_serpapi_key_here` with your actual API key.

### Step 3: Restart the App

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

**That's it!** Your app will now fetch real products from Google Shopping.

---

## 📊 What You Get

### Product Sources:
- **Women's Fashion Tops** (8 items)
- **Men's Fashion Shirts** (6 items)
- **Fashion Trousers/Pants** (8 items)
- **Fashion Blazers/Jackets** (6 items)
- **Fashion Shoes** (5 items)
- **Fashion Bags/Accessories** (4 items)

**Total: 37 real fashion products!**

### Product Quality:
- ✅ Professional photography
- ✅ White/minimal backgrounds
- ✅ Multiple angles available
- ✅ Real brand names
- ✅ Accurate pricing
- ✅ Product details

---

## 💰 Pricing

### Free Tier:
- **100 searches/month** - FREE
- Perfect for development & testing
- No credit card required

### Paid Plans:
- **$50/month**: 5,000 searches
- **$125/month**: 15,000 searches
- **Enterprise**: Custom pricing

**For this app:**
- Loads 6 search queries on startup
- 6 searches per app load
- Free tier = ~16 app loads/month
- Perfect for development!

---

## 🔧 How It Works

### Priority System:

```
1️⃣ SerpAPI (if API key configured)
      ↓ (if no API key)
2️⃣ Fashion APIs (FakeStore)
      ↓ (if APIs fail)
3️⃣ Mock Data (fallback)
```

### Search Queries:
```
- "women fashion tops elegant"
- "men fashion shirts premium"
- "fashion trousers pants elegant"
- "fashion blazer jacket premium"
- "fashion shoes elegant"
- "fashion bag accessory premium"
```

---

## 🎨 Product Images

### What You Get:
- High-resolution images (typically 1000x1000+)
- Professional product photography
- Clean backgrounds (white/minimal)
- Multiple product angles
- Consistent lighting

### Image Quality:
SerpAPI returns Google Shopping images which are:
- Professionally photographed
- E-commerce ready
- Optimized for display
- CDN-hosted (fast loading)

---

## 📝 Configuration Options

### Search Parameters:
You can customize searches in `src/services/serpAPI.ts`:

```typescript
const categories = [
  { query: 'women fashion tops elegant', category: 'tops', count: 8 },
  // Add more or modify existing queries
];
```

### Filters:
- `gl: 'us'` - Country (US)
- `hl: 'en'` - Language (English)
- `num: 10` - Results per query

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: Check your API key
```bash
# Verify .env.local exists
cat .env.local

# Check key format (should start with a long alphanumeric string)
```

### Issue: "Rate Limit Exceeded"
**Solution**: You've hit the free tier limit
- Wait until next month
- Or upgrade to paid plan
- Or use Fashion API fallback (automatic)

### Issue: "No products loading"
**Solution**: Check console logs
```javascript
// Open DevTools (F12) → Console
// Look for error messages
```

### Issue: "Images not loading"
**Solution**: 
- Check network tab in DevTools
- Images are CDN-hosted, may have CORS issues
- Use proxy if needed

---

## 🔄 Fallback Behavior

### If SerpAPI fails:
- App automatically falls back to Fashion APIs
- Then to mock data if needed
- User sees products regardless
- **Zero downtime**

### Console Output:

**With SerpAPI:**
```
🔍 Fetching products from Google Shopping via SerpAPI...
✅ Fetched 37 products from SerpAPI!
```

**Without SerpAPI:**
```
🌐 Fetching fashion products from free APIs...
✅ Fetched 23 products from Fashion APIs
```

---

## 💡 Pro Tips

### 1. Customize Queries
Edit `serpAPI.ts` to search for specific brands:
```typescript
{ query: 'Zara women blouse elegant', category: 'tops', count: 10 }
```

### 2. Filter by Price
Add price filters to queries:
```typescript
{ query: 'fashion tops under $100', category: 'tops', count: 10 }
```

### 3. Target Specific Stores
```typescript
{ query: 'H&M fashion tops', category: 'tops', count: 10 }
```

### 4. Use Advanced Filters
SerpAPI supports many filters - see docs:
[https://serpapi.com/google-shopping-api](https://serpapi.com/google-shopping-api)

---

## 📚 Resources

- **SerpAPI Dashboard**: [https://serpapi.com/dashboard](https://serpapi.com/dashboard)
- **API Documentation**: [https://serpapi.com/google-shopping-api](https://serpapi.com/google-shopping-api)
- **Playground**: [https://serpapi.com/playground](https://serpapi.com/playground)
- **Pricing**: [https://serpapi.com/pricing](https://serpapi.com/pricing)

---

## ✅ Success Checklist

- [ ] Created SerpAPI account
- [ ] Got API key
- [ ] Added to `.env.local`
- [ ] Restarted app
- [ ] Seeing real products
- [ ] Images loading correctly
- [ ] Professional backgrounds

---

## 🎯 Expected Results

### Before SerpAPI:
- FakeStore API products
- Basic product images
- Limited variety

### After SerpAPI:
- **37 real fashion products**
- **Professional photography**
- **Clean backgrounds**
- **Real brands & prices**
- **High-quality images**

---

**Ready to get started? Sign up at [serpapi.com](https://serpapi.com)!** 🚀
