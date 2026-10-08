# Shopify Setup Guide for Fashion Fusion

This guide will walk you through connecting your Shopify store to Fashion Fusion in under 10 minutes.

## 📋 Prerequisites

- Active Shopify store
- Admin access to Shopify dashboard
- At least a few products published in your store

---

## 🔐 Step-by-Step Setup

### Step 1: Enable Custom App Development (First Time Only)

1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to **Settings** (bottom left)
3. Click **Apps and sales channels**
4. Click **Develop apps** button
5. If prompted, click **Allow custom app development**

### Step 2: Create Your Custom App

1. Click **Create an app**
2. Enter app name: `Fashion Fusion` (or any name you prefer)
3. Select **App developer**: (yourself or your team)
4. Click **Create app**

### Step 3: Configure Storefront API Access

1. In your new app, click **Configuration** tab
2. Find **Storefront API integration** section
3. Click **Configure**
4. Enable these scopes:
   ```
   ✅ unauthenticated_read_product_listings
   ✅ unauthenticated_read_product_inventory  
   ✅ unauthenticated_read_product_tags
   ✅ unauthenticated_read_collection_listings
   ```
5. Click **Save**

### Step 4: Install the App

1. Click **API credentials** tab
2. Click **Install app** button
3. Review permissions and click **Install**

### Step 5: Get Your Access Token

1. In the **API credentials** tab, find **Storefront API access token**
2. Click **Reveal token once** (⚠️ Save this immediately!)
3. Copy the token (starts with `shpat_`)
4. Also note your **Store domain** (e.g., `my-fashion-store.myshopify.com`)

**⚠️ Important**: You can only view the token once. If you lose it, you'll need to regenerate it.

---

## 🎯 Connecting to Fashion Fusion

### Method 1: Using the UI (Easiest)

1. Run Fashion Fusion: `npm run dev`
2. Open: `http://localhost:3000`
3. Click **"Setup Shopify"** button in the top navigation bar
4. Enter your details:
   - **Store Domain**: `your-store.myshopify.com`
   - **Access Token**: `shpat_xxxxxxxxxxxxx`
5. Click **"Test Connection"**
6. If successful ✅, click **"Save & Load Products"**
7. Done! Your products are now live in the app

### Method 2: Using Environment Variables

1. Create/edit `.env.local` file in project root:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
   VITE_SHOPIFY_API_VERSION=2024-01
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. Products will load automatically!

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Green "Connected to Shopify" banner appears at the top
- [ ] Your actual products appear in the catalog
- [ ] Product images load correctly
- [ ] Product prices match your Shopify store
- [ ] Size and color variants are available
- [ ] "Add to cart" functionality works

---

## 🐛 Troubleshooting

### Issue: "Connection Failed"

**Possible causes:**
- Incorrect store domain format
- Invalid access token
- Network/firewall blocking the request

**Solutions:**
1. Verify domain is exactly: `your-store.myshopify.com` (no https://)
2. Regenerate access token in Shopify admin
3. Check browser console for specific error messages

### Issue: "No Products Found"

**Possible causes:**
- Products not published
- Products don't have correct product types

**Solutions:**
1. Go to Shopify Admin → Products
2. Ensure products are **Published** (not draft)
3. Set **Product type** to one of:
   - `Tops` / `Shirts` / `Blouses`
   - `Bottoms` / `Pants` / `Trousers`
   - `Outerwear` / `Jackets` / `Coats`
   - `Shoes` / `Footwear`
   - `Accessories` / `Bags`
   - `Dresses`

### Issue: "Images Not Loading"

**Possible causes:**
- Shopify CDN blocking
- Missing product images

**Solutions:**
1. Check that products have images in Shopify
2. Clear browser cache
3. Try incognito/private browsing mode

### Issue: "Access Token Expired"

**Solutions:**
1. Go back to Shopify Admin
2. Navigate to your custom app
3. Go to API credentials
4. Click "Regenerate" on Storefront API token
5. Update the token in Fashion Fusion

---

## 📊 Optimizing Your Product Data

For the best experience in Fashion Fusion, ensure your Shopify products have:

### 1. Product Images
- **Minimum resolution**: 1000x1000px
- **Recommended**: 2000x2000px or higher
- **Background**: White or transparent for garments
- **Multiple angles**: Front, back, detail shots

### 2. Product Information
- **Title**: Clear, descriptive product name
- **Description**: Include fabric, fit, care instructions
- **Product Type**: Set to appropriate category
- **Vendor**: Brand name

### 3. Variants
- **Sizes**: Use standard sizing (XS, S, M, L, XL, XXL)
- **Colors**: Name variants clearly (Black, White, Navy, etc.)
- **SKUs**: Unique identifier for each variant
- **Inventory**: Keep stock levels updated

### 4. Tags (Optional but Helpful)
Add tags for better categorization:
- Style tags: `casual`, `formal`, `minimalist`, `luxury`
- Fit tags: `slim-fit`, `relaxed-fit`, `oversized`
- Season tags: `summer`, `winter`, `all-season`
- Feature tag: `featured` (for homepage display)

---

## 🔄 Updating Products

Products sync in real-time from Shopify. Changes in your Shopify admin will appear in Fashion Fusion:

1. **Immediately**: Price changes, inventory updates
2. **On refresh**: New products, updated descriptions
3. **Cached**: Images (may take a few minutes to update)

To manually refresh products:
- Reload the page, or
- Click the Shopify config button and click "Save & Load Products"

---

## 🔒 Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use separate tokens** for development and production
3. **Regenerate tokens** if compromised
4. **Limit API scopes** to only what's needed (read-only for products)
5. **Monitor API usage** in Shopify admin

---

## 📈 Next Steps

Once Shopify is connected:

1. ✅ Test the complete shopping flow
2. ✅ Verify all product categories work
3. ✅ Check fit recommendations in Fitting Room
4. ✅ Test Try-On Studio with your products
5. 🔜 Add YouCam API for photo virtual try-on (see INTEGRATION_PLAN.md)

---

## 💡 Tips for Success

- Start with 10-20 products to test the integration
- Use high-quality product photography
- Keep product descriptions detailed
- Tag your bestsellers with `featured`
- Regularly update inventory levels
- Test on mobile devices

---

## 📞 Need Help?

- Check the main [README.md](./README.md) for general info
- Review [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) for architecture details
- Open browser DevTools console for error messages
- Check Shopify API status: https://www.shopifystatus.com

---

**Happy Selling! 🎉**
