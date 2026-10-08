import { Product, GarmentColor, ProductCategory, FitType, StretchType, Gender } from '../types/fashion';

/**
 * Fashion API Service - Automatically fetches fashion products from free APIs
 * Sources: FakeStore API, Fashion Products API, etc.
 */

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface FashionProductAPIItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  brand?: string;
  description?: string;
}

export class FashionAPIService {
  private readonly fakeStoreAPI = 'https://fakestoreapi.com';
  private readonly fashionAPIBase = 'https://fakestoreapi.in/api/products/category';
  
  /**
   * Fetch fashion products from multiple free APIs
   */
  async fetchFashionProducts(): Promise<Product[]> {
    try {
      console.log('🔍 Fetching fashion products from free APIs...');
      
      // Fetch from multiple sources in parallel
      const [fakeStoreProducts, additionalProducts] = await Promise.all([
        this.fetchFromFakeStore(),
        this.fetchAdditionalFashionItems(),
      ]);

      const allProducts = [
        ...fakeStoreProducts,
        ...additionalProducts,
      ];

      console.log(`✅ Fetched ${allProducts.length} fashion products automatically!`);
      return allProducts;
    } catch (error) {
      console.error('❌ Error fetching fashion products:', error);
      throw error;
    }
  }

  /**
   * Fetch from FakeStore API (has clothing category)
   */
  private async fetchFromFakeStore(): Promise<Product[]> {
    try {
      const categories = ["men's clothing", "women's clothing"];
      const allProducts: Product[] = [];

      for (const category of categories) {
        const response = await fetch(
          `${this.fakeStoreAPI}/products/category/${encodeURIComponent(category)}`
        );
        
        if (!response.ok) {
          console.warn(`Failed to fetch ${category} from FakeStore`);
          continue;
        }

        const products: FakeStoreProduct[] = await response.json();
        const transformed = products.map(p => this.transformFakeStoreProduct(p, category));
        allProducts.push(...transformed);
      }

      return allProducts;
    } catch (error) {
      console.error('Error fetching from FakeStore:', error);
      return [];
    }
  }

  /**
   * Generate additional fashion items with variations
   */
  private async fetchAdditionalFashionItems(): Promise<Product[]> {
    // Generate curated fashion products with realistic data
    return this.generateCuratedFashionProducts();
  }

  /**
   * Transform FakeStore product to our Product type
   */
  private transformFakeStoreProduct(item: FakeStoreProduct, category: string): Product {
    const isMens = category.includes("men's");
    const productCategory = this.mapToProductCategory(item.title, item.description);
    const gender: Gender = isMens ? 'men' : 'women';
    
    return {
      id: `fakestore-${item.id}`,
      name: item.title,
      category: productCategory,
      subcategory: this.getSubcategory(productCategory, item.title),
      brand: isMens ? 'URBAN STYLE' : 'CHIC COLLECTION',
      price: Math.round(item.price),
      description: item.description || `Premium ${productCategory} with excellent quality and style.`,
      fabric: this.inferFabric(item.title, item.description),
      care: 'Machine wash cold, tumble dry low',
      stretch: this.inferStretch(item.title, item.description),
      fitType: this.inferFitType(item.title, item.description),
      colors: this.generateColors(item.title),
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: this.generateStandardMeasurements(),
      harmonyTags: this.generateTags(item.title, item.description),
      stylingAdvice: `Versatile ${productCategory} perfect for various occasions.`,
      svgShape: this.mapCategoryToSvgShape(productCategory),
      imageUrl: item.image, // Add real image URL from FakeStore API
      gender, // Add gender classification
      inStock: true,
      featured: item.rating.rate > 4.0,
    };
  }

  /**
   * Map product title/description to our category
   */
  private mapToProductCategory(title: string, description: string): ProductCategory {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.match(/jacket|blazer|coat|cardigan|hoodie/)) return 'outerwear';
    if (text.match(/shirt|top|tee|blouse|tank|polo/)) return 'tops';
    if (text.match(/pant|jean|trouser|short|chino/)) return 'bottoms';
    if (text.match(/dress/)) return 'dresses';
    if (text.match(/shoe|boot|sneaker/)) return 'footwear';
    if (text.match(/bag|backpack|wallet|belt|watch/)) return 'accessories';
    
    // Default based on common patterns
    if (text.match(/sleeve|collar|cotton|slim|fit/)) return 'tops';
    return 'tops'; // default
  }

  /**
   * Get subcategory from title
   */
  private getSubcategory(category: ProductCategory, title: string): string {
    const lower = title.toLowerCase();
    
    switch (category) {
      case 'outerwear':
        if (lower.includes('jacket')) return 'Jackets';
        if (lower.includes('coat')) return 'Coats';
        if (lower.includes('blazer')) return 'Blazers';
        return 'Outerwear';
      
      case 'tops':
        if (lower.includes('shirt')) return 'Shirts';
        if (lower.includes('tee') || lower.includes('t-shirt')) return 'T-Shirts';
        if (lower.includes('tank')) return 'Tanks';
        return 'Tops';
      
      case 'bottoms':
        if (lower.includes('jean')) return 'Jeans';
        if (lower.includes('pant') || lower.includes('trouser')) return 'Pants';
        return 'Bottoms';
      
      case 'dresses':
        return 'Dresses';
      
      case 'footwear':
        return 'Shoes';
      
      case 'accessories':
        return 'Accessories';
      
      default:
        return 'General';
    }
  }

  /**
   * Infer fabric from title/description
   */
  private inferFabric(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('cotton')) return '100% Cotton';
    if (text.includes('denim')) return 'Denim';
    if (text.includes('leather')) return 'Genuine Leather';
    if (text.includes('wool')) return 'Wool Blend';
    if (text.includes('polyester')) return 'Polyester';
    
    return 'Premium Fabric Blend';
  }

  /**
   * Infer stretch type
   */
  private inferStretch(title: string, description: string): StretchType {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('stretch') || text.includes('elastic')) return 'high';
    if (text.includes('slim') || text.includes('fit')) return 'medium';
    if (text.includes('rigid') || text.includes('stiff')) return 'rigid';
    
    return 'slight';
  }

  /**
   * Infer fit type
   */
  private inferFitType(title: string, description: string): FitType {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('slim')) return 'slim';
    if (text.includes('relaxed') || text.includes('loose')) return 'relaxed';
    if (text.includes('oversized')) return 'oversized';
    
    return 'tailored';
  }

  /**
   * Generate color variants
   */
  private generateColors(title: string): GarmentColor[] {
    const lower = title.toLowerCase();
    const colors: GarmentColor[] = [];
    
    // Common fashion colors
    const colorOptions = [
      { name: 'Black', hex: '#000000', border: '#333333' },
      { name: 'White', hex: '#FFFFFF', border: '#DDDDDD' },
      { name: 'Navy Blue', hex: '#001F3F', border: '#003366' },
      { name: 'Charcoal', hex: '#36454F', border: '#2C3539' },
      { name: 'Olive', hex: '#808000', border: '#6B6B00' },
      { name: 'Burgundy', hex: '#800020', border: '#66001A' },
      { name: 'Beige', hex: '#F5F5DC', border: '#D9D9C0' },
      { name: 'Grey', hex: '#808080', border: '#666666' },
    ];
    
    // Add colors based on title
    if (lower.includes('black')) {
      colors.push(colorOptions[0]);
    }
    if (lower.includes('white')) {
      colors.push(colorOptions[1]);
    }
    if (lower.includes('blue')) {
      colors.push(colorOptions[2]);
    }
    
    // Default colors if none specified
    if (colors.length === 0) {
      colors.push(colorOptions[0], colorOptions[1], colorOptions[3]); // Black, White, Charcoal
    }
    
    return colors;
  }

  /**
   * Generate standard measurements
   */
  private generateStandardMeasurements(): Record<string, any> {
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
  private generateTags(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const tags: string[] = [];
    
    if (text.includes('casual')) tags.push('casual');
    if (text.includes('formal')) tags.push('formal');
    if (text.includes('slim')) tags.push('slim-fit');
    if (text.includes('classic')) tags.push('classic');
    if (text.includes('modern')) tags.push('modern');
    if (text.includes('vintage')) tags.push('vintage');
    
    if (tags.length === 0) {
      tags.push('versatile', 'classic');
    }
    
    return tags;
  }

  /**
   * Map category to SVG shape
   */
  private mapCategoryToSvgShape(category: ProductCategory): any {
    switch (category) {
      case 'outerwear': return 'blazer';
      case 'tops': return 'shirt';
      case 'bottoms': return 'trousers';
      case 'dresses': return 'dress';
      case 'footwear': return 'loafers';
      case 'accessories': return 'bag';
      default: return 'shirt';
    }
  }

  /**
   * Generate curated fashion products with high quality
   */
  private generateCuratedFashionProducts(): Product[] {
    return [
      {
        id: 'auto-tops-001',
        name: 'Premium Cotton Oxford Shirt',
        category: 'tops',
        subcategory: 'Shirts',
        brand: 'ELEGANCE',
        price: 79,
        description: 'Classic button-down oxford shirt crafted from premium cotton. Features a refined collar, chest pocket, and timeless design perfect for both casual and business settings.',
        fabric: '100% Premium Cotton',
        care: 'Machine wash cold, hang dry',
        stretch: 'slight',
        fitType: 'tailored',
        colors: [
          { name: 'White', hex: '#FFFFFF', border: '#DDDDDD' },
          { name: 'Light Blue', hex: '#ADD8E6', border: '#87CEEB' },
          { name: 'Pink', hex: '#FFB6C1', border: '#FF9AA2' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        measurements: this.generateStandardMeasurements(),
        harmonyTags: ['classic', 'versatile', 'professional'],
        stylingAdvice: 'Pairs perfectly with chinos or dress pants for a polished look.',
        svgShape: 'shirt',
        inStock: true,
        featured: true,
      },
      {
        id: 'auto-bottoms-001',
        name: 'Stretch Slim Fit Chinos',
        category: 'bottoms',
        subcategory: 'Pants',
        brand: 'MODERN FIT',
        price: 89,
        description: 'Contemporary slim-fit chinos with stretch technology for all-day comfort. Features a clean front, back welt pockets, and a modern tapered leg.',
        fabric: '97% Cotton, 3% Elastane',
        care: 'Machine wash warm, tumble dry low',
        stretch: 'medium',
        fitType: 'slim',
        colors: [
          { name: 'Khaki', hex: '#C3B091', border: '#A89968' },
          { name: 'Navy', hex: '#000080', border: '#00005A' },
          { name: 'Olive', hex: '#808000', border: '#666600' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        measurements: {
          S: { waist: 72, hips: 98, inseam: 80, length: 105 },
          M: { waist: 76, hips: 102, inseam: 81, length: 107 },
          L: { waist: 81, hips: 107, inseam: 82, length: 109 },
          XL: { waist: 86, hips: 112, inseam: 83, length: 111 },
        },
        harmonyTags: ['modern', 'comfortable', 'versatile'],
        stylingAdvice: 'Style with dress shoes for business casual or sneakers for weekend wear.',
        svgShape: 'trousers',
        inStock: true,
        featured: true,
      },
      {
        id: 'auto-outerwear-001',
        name: 'Lightweight Bomber Jacket',
        category: 'outerwear',
        subcategory: 'Jackets',
        brand: 'STREET EDGE',
        price: 159,
        description: 'Modern bomber jacket with a lightweight nylon shell. Features ribbed cuffs and hem, zip pockets, and a smooth interior lining.',
        fabric: 'Nylon Shell, Polyester Lining',
        care: 'Machine wash cold, line dry',
        stretch: 'slight',
        fitType: 'relaxed',
        colors: [
          { name: 'Black', hex: '#000000', border: '#333333' },
          { name: 'Olive Green', hex: '#556B2F', border: '#3F5221' },
          { name: 'Navy', hex: '#000080', border: '#00005A' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        measurements: this.generateStandardMeasurements(),
        harmonyTags: ['streetwear', 'casual', 'modern'],
        stylingAdvice: 'Layer over hoodies or t-shirts for an effortlessly cool look.',
        svgShape: 'blazer',
        inStock: true,
        featured: true,
      },
    ];
  }
}

/**
 * Create Fashion API service instance
 */
export function createFashionAPIService(): FashionAPIService {
  return new FashionAPIService();
}
