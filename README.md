

# Fashion Fusion 👗

**AI-Powered Fashion E-Commerce with Virtual Try-On & Smart Fit Analysis**

Fashion Fusion is a modern e-commerce application that combines real-time product data from Shopify with AI-powered features including virtual fitting room, try-on studio, and intelligent cart recommendations.

## 🌟 Features

- **🛍️ Real Product Fetching**: Get professional fashion products from Google Shopping via SerpAPI
- **📸 Professional Images**: High-quality product photos with clean, minimal backgrounds
- **👔 Virtual Try-On Studio**: Mix and match outfits across categories
- **📏 Smart Fitting Room**: AI-powered size recommendations based on body measurements
- **🛒 Intelligent Cart**: Automatic fit analysis and size warnings
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **⚡ Performance Optimized**: Image CDN optimization and lazy loading

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Shopify Store** (optional - works with demo data if not configured)

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

3. **Configure environment variables** (optional for SerpAPI)
   ```bash
   cp .env.example .env.local
   # Add your SerpAPI key to .env.local for real Google Shopping products
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

The app will start with demo data. To use **real Google Shopping products with professional images**, follow the SerpAPI setup below.

---

## 🛍️ SerpAPI Integration (Real Google Shopping Products)

### Why Use SerpAPI?

- Get **37+ real fashion products** from Google Shopping
- **Professional product photography** with clean backgrounds
- Real brands, accurate pricing, and detailed product info
- High-quality images optimized for e-commerce

### Quick Setup (5 minutes):

1. **Get API Key** from [serpapi.com](https://serpapi.com) (100 free searches/month)
2. **Add to `.env.local`**:
   ```env
   VITE_SERPAPI_KEY=your_actual_api_key_here
   ```
3. **Restart app**: `npm run dev`

**Done!** Real products with professional images load automatically.

📚 **Detailed Guide**: See [SERPAPI_SETUP.md](./SERPAPI_SETUP.md)

---

## 📚 Project Structure

```
fashion-fusion/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx       # Navigation with Shopify config
│   │   ├── ProductCatalog.tsx
│   │   ├── TryOnStudio.tsx
│   │   ├── FittingRoom.tsx
│   │   ├── AiCartDrawer.tsx
│   │   └── ShopifyConfig.tsx # Shopify setup UI
│   │
│   ├── services/            # API services
│   │   └── shopifyAPI.ts    # Shopify Storefront API client
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useProducts.tsx  # Product data management
│   │
│   ├── utils/               # Utility functions
│   │   ├── fitEngine.ts     # Size recommendation logic
│   │   └── imageOptimization.ts # Shopify CDN optimization
│   │
│   ├── types/               # TypeScript types
│   │   ├── fashion.ts       # App types
│   │   └── shopify.ts       # Shopify API types
│   │
│   ├── config/              # Configuration
│   │   └── shopify.ts       # Shopify config helper
│   │
│   └── data/
│       └── mockProducts.ts  # Demo data (fallback)
│
├── .env.example             # Environment variables template
├── .env.local              # Your local config (git-ignored)
└── package.json
```

---

## 🎨 Features Deep Dive

### 1. Product Catalog
- Browse products from Shopify or demo data
- Filter by category (tops, bottoms, outerwear, etc.)
- Real-time availability status
- Quick actions: Add to cart, Try in studio, Check fit

### 2. Virtual Try-On Studio
- Mix and match items across categories
- See complete outfit visualization
- AI styling suggestions
- Add entire outfits to cart

### 3. Virtual Fitting Room
- Input your body measurements
- Get AI-powered size recommendations
- See fit analysis for each product
- Visual fit indicators (perfect/caution/mismatch)

### 4. Intelligent Cart
- Automatic fit evaluation for each item
- Size conflict warnings
- Recommendations to optimize fit
- Update sizes without removing items

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

## 🎯 Next Steps: YouCam API Integration

Ready to add real virtual try-on? Check out the [Integration Plan](./INTEGRATION_PLAN.md) for:

- YouCam API setup and configuration
- Virtual try-on implementation guide
- User photo upload workflow
- Cost estimates and feasibility analysis

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 8
- **State Management**: React Context + Hooks
- **API Integration**: Shopify Storefront API (GraphQL)
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 📝 Environment Variables

```env
# Gemini AI (for future AI features)
GEMINI_API_KEY=your_gemini_api_key

# Shopify Integration
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
VITE_SHOPIFY_API_VERSION=2024-01

# Optional: YouCam API (future feature)
# VITE_YOUCAM_API_KEY=your_youcam_api_key
# VITE_YOUCAM_API_ENDPOINT=https://api.perfectcorp.com/v3
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is part of AI Studio and follows its licensing terms.

---

## 🆘 Support

Having issues? Check out:

1. **Shopify Setup**: See the [Shopify Integration](#-shopify-integration) section above
2. **Integration Plan**: Review [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) for detailed architecture
3. **Troubleshooting**: Check console logs for specific error messages

---

## 🔮 Roadmap

- [x] Shopify product integration
- [x] Smart fit analysis
- [x] Virtual try-on studio
- [x] Image optimization
- [ ] YouCam API integration for real photo try-on
- [ ] User authentication and profiles
- [ ] Order history and tracking
- [ ] Social sharing features
- [ ] Wishlist functionality

---

**Built with ❤️ for the future of fashion e-commerce**
