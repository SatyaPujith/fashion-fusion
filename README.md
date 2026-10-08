

# Fashion Fusion 👗

**AI-Powered Fashion E-Commerce with Virtual Try-On & Smart Fit Analysis**

Fashion Fusion is a modern e-commerce application that combines real-time product data from Google Shopping with AI-powered virtual try-on using YouCam API. Experience the future of online fashion shopping with realistic virtual try-on for clothing, shoes, bags, accessories, and more.

## 🌟 Features

- **🛍️ Real Product Fetching**: 100+ professional fashion products from Google Shopping via SerpAPI
- **📸 Professional Images**: High-quality product photos with clean, minimal backgrounds
- **👔 Virtual Try-On Studio**: AI-powered realistic try-on using YouCam API
  - Clothing (tops, bottoms, dresses, outerwear)
  - Shoes (sneakers, heels, boots)
  - Bags (handbags, backpacks, totes)
  - Accessories (scarves, hats)
- **📏 Smart Fitting Room**: AI-powered size recommendations based on body measurements
- **🎯 Gender-Based Filtering**: Separate Men's and Women's collections
- **🤖 AI Category Detection**: Automatic routing to correct try-on API for each product type
- **🛒 Intelligent Cart**: Automatic fit analysis and size warnings
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **⚡ Performance Optimized**: Image CDN optimization and lazy loading

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **SerpAPI Key** (for product fetching - 100 free searches/month)
- **YouCam API Key** (for virtual try-on - get from [makeupar.com](https://yce.makeupar.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fashion-fusion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # SerpAPI - For product fetching (REQUIRED)
   VITE_SERPAPI_KEY=your_serpapi_key_here
   
   # YouCam API - For virtual try-on (REQUIRED)
   VITE_YOUCAM_API_KEY=your_youcam_api_key
   VITE_YOUCAM_SECRET_KEY=your_youcam_secret_key
   VITE_YOUCAM_BASE_URL=https://yce-api-01.makeupar.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## � API Setup Guide

### 1. SerpAPI (Product Fetching)

**What it does**: Fetches 100+ real fashion products from Google Shopping with professional images

1. **Sign up** at [serpapi.com](https://serpapi.com) (100 free searches/month)
2. **Get your API key** from the dashboard
3. **Add to `.env.local`**:
   ```env
   VITE_SERPAPI_KEY=your_actual_api_key_here
   ```

**Products fetched**:
- Men's & Women's: Tops, Bottoms, Outerwear, Dresses
- Shoes (Men's & Women's)
- Bags (Handbags, Backpacks)
- Accessories (Scarves, Hats, Jewelry)

### 2. YouCam API (Virtual Try-On)

**What it does**: AI-powered realistic virtual try-on for fashion products

1. **Sign up** at [makeupar.com](https://yce.makeupar.com/api-console/en/api-keys/)
2. **Get your credentials**:
   - API Key
   - Secret Key (for authentication)
3. **Add to `.env.local`**:
   ```env
   VITE_YOUCAM_API_KEY=sk-xxxxx
   VITE_YOUCAM_SECRET_KEY=your_secret_key
   VITE_YOUCAM_BASE_URL=https://yce-api-01.makeupar.com
   ```

**Supported Categories**:
- ✅ **Clothing**: Tops, Bottoms, Dresses, Outerwear
- ✅ **Shoes**: All types (sneakers, heels, boots, etc.)
- ✅ **Bags**: Handbags, backpacks, totes
- ✅ **Scarves**: Scarves, shawls, wraps
- ✅ **Hats**: All headwear
- ❌ **Jewelry**: Not supported (API limitation)

📚 **Detailed Guide**: See [YOUCAM_API_WORKING_ENDPOINTS.md](./YOUCAM_API_WORKING_ENDPOINTS.md)

---

## 📚 Project Structure

```
fashion-fusion/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx       # Navigation
│   │   ├── ProductCatalog.tsx  # Product browsing with gender filters
│   │   ├── TryOnStudio.tsx     # Virtual try-on workflow
│   │   ├── FittingRoom.tsx     # Size recommendations
│   │   ├── AiCartDrawer.tsx    # Smart shopping cart
│   │   ├── GarmentSilhouette.tsx  # Product visualization
│   │   └── MannequinVisualizer.tsx
│   │
│   ├── services/            # API services
│   │   ├── serpAPI.ts       # Google Shopping product fetching
│   │   ├── youCamAPI.ts     # Virtual try-on API client
│   │   ├── productCategoryDetector.ts  # AI category detection
│   │   └── fashionAPI.ts    # Fallback API
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useProducts.tsx  # Product data management
│   │
│   ├── utils/               # Utility functions
│   │   └── fitEngine.ts     # Size recommendation logic
│   │
│   ├── types/               # TypeScript types
│   │   └── fashion.ts       # App types & interfaces
│   │
│   └── data/
│       └── mockProducts.ts  # Demo data (fallback)
│
├── .env.example             # Environment variables template
├── .env.local              # Your local config (git-ignored)
├── README.md               # This file
├── YOUCAM_API_WORKING_ENDPOINTS.md  # YouCam API reference
├── MULTI_CATEGORY_IMPLEMENTATION.md  # Technical docs
└── AI_PRODUCT_DETECTION_GUIDE.md    # AI detection guide
```

---

## 🎨 Features Deep Dive

### 1. Product Catalog
- Browse 100+ real products from Google Shopping
- **Gender-based filtering**: Men's Wear and Women's Wear sections
- Filter by 10+ categories (tops, bottoms, shoes, bags, scarves, hats, jewelry, etc.)
- Real-time availability status
- Professional product images
- Quick actions: Add to cart, Virtual Try-On, Check fit

### 2. Virtual Try-On Studio
- **3-Step Workflow**:
  1. Upload your photo (full body recommended)
  2. Select your gender (Men's/Women's)
  3. Choose products to try on
- **AI-Powered Category Detection**: Automatically routes to correct API for each product
- **Realistic Results**: Powered by YouCam API
- **Supported Items**:
  - Clothing (shirts, pants, dresses, jackets)
  - Shoes (all types)
  - Bags (handbags, backpacks)
  - Scarves (realistic draping)
  - Hats (perfect fit)
- Add successful try-ons directly to cart

### 3. Virtual Fitting Room
- Input your body measurements
- Get AI-powered size recommendations
- See fit analysis for each product
- Visual fit indicators (perfect/caution/mismatch)
- Personalized styling advice

### 4. Intelligent Shopping Cart
- Automatic fit evaluation for each item
- Size conflict warnings
- Recommendations to optimize fit
- Update sizes without removing items
- Calculate total with discounts

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run TypeScript type checking
npm run clean        # Remove build artifacts
```

---

## 🎯 How It Works

### Product Fetching
1. App fetches 100+ real products from Google Shopping via SerpAPI
2. Products are categorized by type and gender automatically
3. Professional images with clean backgrounds are used

### Virtual Try-On Process
1. **User uploads photo**: Full body photo recommended
2. **Gender selection**: Choose Men's or Women's
3. **Product selection**: Browse and select items to try
4. **AI Detection**: System automatically detects product category
5. **API Routing**: Routes to correct YouCam endpoint (clothing, shoes, bags, etc.)
6. **Generate**: AI generates realistic try-on image
7. **Review & Shop**: Add liked items to cart

### AI Category Detection
The app uses intelligent pattern matching to route products to the correct API:
- **Clothing** → cloth-v4 endpoint
- **Shoes** → shoes-transfer endpoint
- **Bags** → bag endpoint
- **Scarves** → scarf endpoint
- **Hats** → hat endpoint

See [AI_PRODUCT_DETECTION_GUIDE.md](./AI_PRODUCT_DETECTION_GUIDE.md) for details.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 5
- **State Management**: React Context + Hooks
- **APIs**: 
  - SerpAPI (Google Shopping product data)
  - YouCam API (Virtual try-on)
- **Icons**: Lucide React
- **Animations**: CSS Transitions

---

## 📝 Environment Variables

```env
# SerpAPI - Product Fetching (REQUIRED)
VITE_SERPAPI_KEY=your_serpapi_api_key

# YouCam API - Virtual Try-On (REQUIRED)
VITE_YOUCAM_API_KEY=sk-xxxxx
VITE_YOUCAM_SECRET_KEY=your_secret_key
VITE_YOUCAM_BASE_URL=https://yce-api-01.makeupar.com
```

**Getting API Keys**:
1. **SerpAPI**: Sign up at [serpapi.com](https://serpapi.com) (100 free searches/month)
2. **YouCam**: Register at [makeupar.com](https://yce.makeupar.com/api-console/en/api-keys/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is part of AI Studio and follows its licensing terms.

---

## 🆘 Support & Documentation

Having issues? Check out our comprehensive documentation:

1. **API Setup**:
   - [SerpAPI Integration](#1-serpapi-product-fetching)
   - [YouCam API Setup](#2-youcam-api-virtual-try-on)
   
2. **Technical Docs**:
   - [YOUCAM_API_WORKING_ENDPOINTS.md](./YOUCAM_API_WORKING_ENDPOINTS.md) - Complete API reference
   - [MULTI_CATEGORY_IMPLEMENTATION.md](./MULTI_CATEGORY_IMPLEMENTATION.md) - Architecture guide
   - [AI_PRODUCT_DETECTION_GUIDE.md](./AI_PRODUCT_DETECTION_GUIDE.md) - AI detection logic

3. **Troubleshooting**:
   - Check browser console for error messages
   - Verify API keys are correctly set in `.env.local`
   - Ensure all required environment variables are present

---

## 🔮 Roadmap

- [x] SerpAPI product integration (Google Shopping)
- [x] Smart fit analysis
- [x] Virtual try-on studio UI
- [x] YouCam API integration for real photo try-on
- [x] AI-powered category detection
- [x] Gender-based product filtering
- [x] Multi-category support (clothing, shoes, bags, accessories)
- [ ] User authentication and profiles
- [ ] Save favorite try-on results
- [ ] Order history and tracking
- [ ] Social sharing features
- [ ] Wishlist functionality
- [ ] Size profile saving

---

**Built with ❤️ for the future of fashion e-commerce**
