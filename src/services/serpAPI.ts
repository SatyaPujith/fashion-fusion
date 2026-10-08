import { Product, GarmentColor, ProductCategory, FitType, StretchType, Gender } from '../types/fashion';

/**
 * SerpAPI Service - Fetches real fashion products from Google Shopping
 * with professional images and clean backgrounds
 */

interface SerpAPIProduct {
  position: number;
  title: string;
  link: string;
  product_link: string;
  product_id: string;
  serpapi_product_api: string;
  source: string;
  price: string;
  extracted_price: number;
  old_price?: string;
  extracted_old_price?: number;
  thumbnail: string;
  delivery?: string;
  rating?: number;
  reviews?: number;
  extensions?: string[];
  second_hand_condition?: string;
}

interface SerpAPIResponse {
  shopping_results?: SerpAPIProduct[];
  inline_shopping?: SerpAPIProduct[];
  error?: string;
}

export class SerpAPIService {
  private apiKey: string;
  private baseUrl = '/api/serpapi'; // Use Vite proxy to avoid CORS

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch fashion products from Google Shopping via SerpAPI
   */
  async fetchFashionProducts(): Promise<Product[]> {
    try {
      console.log('🔍 Fetching real fashion products from Google Shopping via SerpAPI...');

      const categories = [
        // Clothing - Tops (10 each = 20 total)
        { query: 'men fashion shirts premium', category: 'tops' as ProductCategory, gender: 'men' as Gender, count: 10 },
        { query: 'women fashion tops elegant blouse', category: 'tops' as ProductCategory, gender: 'women' as Gender, count: 10 },
        
        // Clothing - Bottoms (8 each = 16 total)
        { query: 'men fashion trousers pants premium', category: 'bottoms' as ProductCategory, gender: 'men' as Gender, count: 8 },
        { query: 'women fashion pants trousers elegant', category: 'bottoms' as ProductCategory, gender: 'women' as Gender, count: 8 },
        
        // Clothing - Outerwear (6 each = 12 total)
        { query: 'men fashion jacket blazer premium', category: 'outerwear' as ProductCategory, gender: 'men' as Gender, count: 6 },
        { query: 'women fashion blazer jacket elegant', category: 'outerwear' as ProductCategory, gender: 'women' as Gender, count: 6 },
        
        // Shoes (5 each = 10 total)
        { query: 'men fashion shoes sneakers leather premium', category: 'shoes' as ProductCategory, gender: 'men' as Gender, count: 5 },
        { query: 'women fashion shoes heels elegant', category: 'shoes' as ProductCategory, gender: 'women' as Gender, count: 5 },
        
        // Bags (5 each = 10 total)
        { query: 'men fashion bag leather backpack premium', category: 'bags' as ProductCategory, gender: 'men' as Gender, count: 5 },
        { query: 'women fashion handbag purse luxury', category: 'bags' as ProductCategory, gender: 'women' as Gender, count: 5 },
        
        // Scarves (3 each = 6 total)
        { query: 'men fashion scarf wool premium', category: 'scarves' as ProductCategory, gender: 'men' as Gender, count: 3 },
        { query: 'women fashion scarf silk elegant', category: 'scarves' as ProductCategory, gender: 'women' as Gender, count: 3 },
        
        // Hats (3 each = 6 total)
        { query: 'men fashion hat cap premium', category: 'hats' as ProductCategory, gender: 'men' as Gender, count: 3 },
        { query: 'women fashion hat elegant', category: 'hats' as ProductCategory, gender: 'women' as Gender, count: 3 },
        
        // Jewelry - Rings (3 each = 6 total)
        { query: 'men jewelry ring silver premium', category: 'jewelry' as ProductCategory, gender: 'men' as Gender, count: 3 },
        { query: 'women jewelry ring gold diamond elegant', category: 'jewelry' as ProductCategory, gender: 'women' as Gender, count: 3 },
        
        // Jewelry - Bracelets/Watches (3 each = 6 total)
        { query: 'men jewelry watch premium', category: 'jewelry' as ProductCategory, gender: 'men' as Gender, count: 3 },
        { query: 'women jewelry bracelet gold elegant', category: 'jewelry' as ProductCategory, gender: 'women' as Gender, count: 3 },
        
        // Jewelry - Earrings (women only = 3 total)
        { query: 'women jewelry earrings elegant', category: 'jewelry' as ProductCategory, gender: 'women' as Gender, count: 3 },
        
        // Accessories (3 each = 6 total)
        { query: 'men fashion accessories belt premium', category: 'accessories' as ProductCategory, gender: 'men' as Gender, count: 3 },
        { query: 'women fashion accessories elegant', category: 'accessories' as ProductCategory, gender: 'women' as Gender, count: 3 },
      ];

      const allProducts: Product[] = [];

      // Fetch products for each category
      for (const { query, category, gender, count } of categories) {
        try {
          const products = await this.searchProducts(query, category, gender, count);
          allProducts.push(...products);
          
          // Small delay between requests to respect rate limits
          await this.delay(500);
        } catch (error) {
          console.warn(`Failed to fetch ${category}:`, error);
        }
      }

      console.log(`✅ Fetched ${allProducts.length} real fashion products from Google Shopping!`);
      return allProducts;
    } catch (error) {
      console.error('❌ SerpAPI fetch error:', error);
      throw error;
    }
  }

  /**
   * Search products for a specific query
   */
  private async searchProducts(
    query: string,
    category: ProductCategory,
    gender: Gender,
    limit: number
  ): Promise<Product[]> {
    const params = new URLSearchParams({
      engine: 'google_shopping',
      q: query,
      api_key: this.apiKey,
      num: limit.toString(),
      gl: 'us', // Country
      hl: 'en', // Language
    });

    const url = `${this.baseUrl}?${params}`;
    console.log(`🔍 SerpAPI Request: ${query}`);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ SerpAPI HTTP Error: ${response.status}`, errorText);
      throw new Error(`SerpAPI Error: ${response.status} ${response.statusText}`);
    }

    const data: SerpAPIResponse = await response.json();
    console.log(`📦 SerpAPI Response for "${query}":`, data);

    if (data.error) {
      console.error(`❌ SerpAPI API Error:`, data.error);
      throw new Error(`SerpAPI Error: ${data.error}`);
    }

    const serpProducts = data.shopping_results || [];
    
    if (serpProducts.length === 0) {
      console.warn(`⚠️ No products found for query: ${query}`);
    } else {
      console.log(`✅ Found ${serpProducts.length} products for: ${query}`);
    }

    return serpProducts.slice(0, limit).map(item => this.transformSerpProduct(item, category, gender));
  }

  /**
   * Transform SerpAPI product to our Product type
   */
  private transformSerpProduct(item: SerpAPIProduct, category: ProductCategory, gender: Gender): Product {
    // Extract brand from title or source
    const brand = this.extractBrand(item.title, item.source);
    
    // Clean product name
    const name = this.cleanProductName(item.title);
    
    // Get price
    const price = item.extracted_price || 99;
    const originalPrice = item.extracted_old_price;

    // Extract colors from extensions or generate defaults
    const colors = this.extractColors(item.extensions || []);

    // Generate product ID
    const id = `serp-${item.product_id || item.position}`;

    // Get image URL from SerpAPI response
    const imageUrl = item.thumbnail;

    console.log(`📸 Product: ${name} | Image: ${imageUrl ? '✅' : '❌'}`);

    return {
      id,
      name,
      category,
      subcategory: this.getSubcategory(category, name),
      brand,
      price: Math.round(price),
      originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
      description: this.generateDescription(name, brand, category),
      fabric: this.inferFabric(name),
      care: this.getDefaultCareInstructions(category),
      stretch: this.inferStretch(name),
      fitType: this.inferFitType(name),
      colors,
      sizes: this.getStandardSizes(category),
      measurements: this.generateStandardMeasurements(category),
      harmonyTags: this.generateTags(name, category),
      stylingAdvice: this.generateStylingAdvice(category, name),
      svgShape: this.mapCategoryToSvgShape(category),
      imageUrl, // Add the real image URL
      gender, // Add gender classification
      inStock: true,
      featured: item.rating && item.rating >= 4.5,
    };
  }

  /**
   * Extract brand from title or source
   */
  private extractBrand(title: string, source: string): string {
    // Common fashion brands
    const brands = ['Zara', 'H&M', 'Nike', 'Adidas', 'Gucci', 'Prada', 'Chanel', 
                    'Dior', 'Versace', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren',
                    'Levi\'s', 'Gap', 'Uniqlo', 'Mango', 'Forever 21'];
    
    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase()) || 
          source.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }

    // Use source as brand if available
    if (source && source.length < 30) {
      return source.split('.')[0].toUpperCase();
    }

    return 'PREMIUM';
  }

  /**
   * Clean product name
   */
  private cleanProductName(title: string): string {
    // Remove price, extra details, and clean up
    return title
      .replace(/\$[\d,.]+/g, '') // Remove prices
      .replace(/\d+%\s*off/gi, '') // Remove discounts
      .replace(/\([^)]*\)/g, '') // Remove parentheses content
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .slice(0, 60); // Limit length
  }

  /**
   * Extract colors from extensions
   */
  private extractColors(extensions: string[]): GarmentColor[] {
    const colorMap: Record<string, { hex: string; border: string }> = {
      black: { hex: '#000000', border: '#333333' },
      white: { hex: '#FFFFFF', border: '#DDDDDD' },
      blue: { hex: '#0066CC', border: '#004C99' },
      navy: { hex: '#000080', border: '#00005A' },
      red: { hex: '#CC0000', border: '#990000' },
      green: { hex: '#006600', border: '#004400' },
      yellow: { hex: '#FFCC00', border: '#CC9900' },
      grey: { hex: '#808080', border: '#666666' },
      gray: { hex: '#808080', border: '#666666' },
      beige: { hex: '#F5F5DC', border: '#D9D9C0' },
      brown: { hex: '#8B4513', border: '#6B3410' },
      pink: { hex: '#FFB6C1', border: '#FF9AA2' },
    };

    const foundColors: GarmentColor[] = [];
    const extensionStr = extensions.join(' ').toLowerCase();

    for (const [colorName, colorValue] of Object.entries(colorMap)) {
      if (extensionStr.includes(colorName)) {
        foundColors.push({
          name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
          ...colorValue,
        });
      }
    }

    // Default colors if none found
    if (foundColors.length === 0) {
      foundColors.push(
        { name: 'Black', hex: '#000000', border: '#333333' },
        { name: 'White', hex: '#FFFFFF', border: '#DDDDDD' },
        { name: 'Navy', hex: '#000080', border: '#00005A' }
      );
    }

    return foundColors;
  }

  /**
   * Get subcategory from name and category
   */
  private getSubcategory(category: ProductCategory, name: string): string {
    const lower = name.toLowerCase();
    
    switch (category) {
      case 'tops':
        if (lower.includes('shirt')) return 'Shirts';
        if (lower.includes('blouse')) return 'Blouses';
        if (lower.includes('tee') || lower.includes('t-shirt')) return 'T-Shirts';
        if (lower.includes('tank')) return 'Tanks';
        if (lower.includes('sweater')) return 'Sweaters';
        return 'Tops';
      
      case 'bottoms':
        if (lower.includes('jean')) return 'Jeans';
        if (lower.includes('pant') || lower.includes('trouser')) return 'Pants';
        if (lower.includes('skirt')) return 'Skirts';
        return 'Bottoms';
      
      case 'outerwear':
        if (lower.includes('jacket')) return 'Jackets';
        if (lower.includes('coat')) return 'Coats';
        if (lower.includes('blazer')) return 'Blazers';
        return 'Outerwear';
      
      case 'shoes':
      case 'footwear':
        if (lower.includes('sneaker')) return 'Sneakers';
        if (lower.includes('boot')) return 'Boots';
        if (lower.includes('heel')) return 'Heels';
        if (lower.includes('sandal')) return 'Sandals';
        return 'Shoes';
      
      case 'bags':
        if (lower.includes('handbag')) return 'Handbags';
        if (lower.includes('backpack')) return 'Backpacks';
        if (lower.includes('tote')) return 'Totes';
        if (lower.includes('clutch')) return 'Clutches';
        return 'Bags';
      
      case 'scarves':
        return 'Scarves';
      
      case 'hats':
        if (lower.includes('cap')) return 'Caps';
        if (lower.includes('beanie')) return 'Beanies';
        if (lower.includes('fedora')) return 'Fedoras';
        return 'Hats';
      
      case 'jewelry':
        if (lower.includes('ring')) return 'Rings';
        if (lower.includes('bracelet')) return 'Bracelets';
        if (lower.includes('earring')) return 'Earrings';
        if (lower.includes('watch')) return 'Watches';
        if (lower.includes('necklace')) return 'Necklaces';
        return 'Jewelry';
      
      case 'accessories':
        if (lower.includes('bag')) return 'Bags';
        if (lower.includes('belt')) return 'Belts';
        return 'Accessories';
      
      default:
        return 'General';
    }
  }

  /**
   * Generate description
   */
  private generateDescription(name: string, brand: string, category: ProductCategory): string {
    return `Premium ${category} from ${brand}. ${name} features high-quality materials and expert craftsmanship. Perfect for modern fashion enthusiasts who value style and comfort.`;
  }

  /**
   * Infer fabric from product name
   */
  private inferFabric(name: string): string {
    const lower = name.toLowerCase();
    
    if (lower.includes('cotton')) return '100% Cotton';
    if (lower.includes('silk')) return 'Silk';
    if (lower.includes('wool')) return 'Wool';
    if (lower.includes('leather')) return 'Genuine Leather';
    if (lower.includes('denim')) return 'Denim';
    if (lower.includes('linen')) return 'Linen';
    if (lower.includes('cashmere')) return 'Cashmere';
    
    return 'Premium Fabric Blend';
  }

  /**
   * Infer stretch
   */
  private inferStretch(name: string): StretchType {
    const lower = name.toLowerCase();
    
    if (lower.includes('stretch') || lower.includes('elastic')) return 'high';
    if (lower.includes('slim') || lower.includes('fit')) return 'medium';
    if (lower.includes('rigid')) return 'rigid';
    
    return 'slight';
  }

  /**
   * Infer fit type
   */
  private inferFitType(name: string): FitType {
    const lower = name.toLowerCase();
    
    if (lower.includes('slim')) return 'slim';
    if (lower.includes('relaxed') || lower.includes('loose')) return 'relaxed';
    if (lower.includes('oversized')) return 'oversized';
    if (lower.includes('tailored') || lower.includes('fitted')) return 'tailored';
    
    return 'tailored';
  }

  /**
   * Get default care instructions
   */
  private getDefaultCareInstructions(category: ProductCategory): string {
    if (category === 'outerwear') return 'Dry clean only';
    if (category === 'footwear') return 'Wipe clean with damp cloth';
    if (category === 'accessories') return 'Spot clean as needed';
    return 'Machine wash cold, tumble dry low';
  }

  /**
   * Get standard sizes
   */
  private getStandardSizes(category: ProductCategory): ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[] {
    if (category === 'footwear') {
      return ['S', 'M', 'L', 'XL']; // Represents shoe size ranges
    }
    return ['XS', 'S', 'M', 'L', 'XL'];
  }

  /**
   * Generate standard measurements
   */
  private generateStandardMeasurements(category: ProductCategory): Record<string, any> {
    if (category === 'footwear') {
      return {
        S: { length: 24 },
        M: { length: 26 },
        L: { length: 27.5 },
        XL: { length: 29 },
      };
    }

    return {
      XS: { chest: 86, waist: 68, hips: 92, shoulder: 38, length: 60 },
      S: { chest: 90, waist: 72, hips: 96, shoulder: 39, length: 62 },
      M: { chest: 94, waist: 76, hips: 100, shoulder: 40, length: 64 },
      L: { chest: 99, waist: 81, hips: 105, shoulder: 41, length: 66 },
      XL: { chest: 104, waist: 86, hips: 110, shoulder: 42, length: 68 },
    };
  }

  /**
   * Generate styling tags
   */
  private generateTags(name: string, category: ProductCategory): string[] {
    const tags: string[] = [];
    const lower = name.toLowerCase();
    
    if (lower.includes('casual')) tags.push('casual');
    if (lower.includes('formal') || lower.includes('elegant')) tags.push('formal');
    if (lower.includes('premium') || lower.includes('luxury')) tags.push('luxury');
    if (lower.includes('classic')) tags.push('classic');
    if (lower.includes('modern')) tags.push('modern');
    if (lower.includes('vintage')) tags.push('vintage');
    
    // Add category-based tags
    tags.push(category);
    tags.push('versatile');
    
    return tags;
  }

  /**
   * Generate styling advice
   */
  private generateStylingAdvice(category: ProductCategory, name: string): string {
    const advice: Record<ProductCategory, string> = {
      tops: 'Pairs beautifully with tailored pants or jeans for a polished everyday look.',
      bottoms: 'Style with tucked-in blouses or casual tees depending on the occasion.',
      outerwear: 'Layer over any outfit for instant sophistication and warmth.',
      footwear: 'Complete your look with these versatile shoes that work from day to night.',
      accessories: 'The perfect finishing touch to elevate any ensemble.',
      dresses: 'Wear alone or layer with jackets for different styling options.',
    };

    return advice[category] || 'A versatile piece for your wardrobe.';
  }

  /**
   * Map category to SVG shape
   */
  private mapCategoryToSvgShape(category: ProductCategory): any {
    const shapeMap: Record<ProductCategory, string> = {
      tops: 'shirt',
      bottoms: 'trousers',
      outerwear: 'blazer',
      footwear: 'loafers',
      shoes: 'loafers',
      bags: 'bag',
      scarves: 'scarf',
      hats: 'hat',
      jewelry: 'ring',
      accessories: 'bag',
      dresses: 'dress',
    };

    return shapeMap[category] || 'shirt';
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create SerpAPI service instance
 */
export function createSerpAPIService(apiKey: string): SerpAPIService {
  return new SerpAPIService(apiKey);
}
