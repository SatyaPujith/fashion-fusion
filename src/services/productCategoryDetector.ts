import { Product, YouCamEndpointType, ProductCategory, JewelryType } from '../types/fashion';

/**
 * AI-Based Product Category Detector
 * Dynamically identifies the correct YouCam API endpoint for virtual try-on
 * based on product name, category, and description
 */

export class ProductCategoryDetector {
  /**
   * Detect YouCam endpoint type for a product using AI-like pattern matching
   */
  detectYouCamEndpoint(product: Product): YouCamEndpointType {
    const searchText = `${product.name} ${product.category} ${product.subcategory} ${product.description}`.toLowerCase();

    // Priority 1: Check for jewelry types (most specific)
    if (this.isJewelry(searchText, product)) {
      return this.detectJewelryType(searchText, product);
    }

    // Priority 2: Check for shoes
    if (this.isShoes(searchText, product)) {
      return 'shoes-transfer';
    }

    // Priority 3: Check for bags
    if (this.isBag(searchText, product)) {
      return 'bag';
    }

    // Priority 4: Check for scarves
    if (this.isScarf(searchText, product)) {
      return 'scarf';
    }

    // Priority 5: Check for hats
    if (this.isHat(searchText, product)) {
      return 'hat';
    }

    // Default: Clothing (cloth-v4)
    return 'cloth-v4';
  }

  /**
   * Detect clothing category for cloth-v4 endpoint
   */
  detectClothingCategory(product: Product): 'upper_body' | 'lower_body' | 'full_body' {
    const searchText = `${product.name} ${product.category} ${product.subcategory}`.toLowerCase();

    // Full body items
    if (
      product.category === 'dresses' ||
      searchText.includes('dress') ||
      searchText.includes('jumpsuit') ||
      searchText.includes('romper') ||
      searchText.includes('overall')
    ) {
      return 'full_body';
    }

    // Lower body items
    if (
      product.category === 'bottoms' ||
      searchText.includes('pant') ||
      searchText.includes('trouser') ||
      searchText.includes('jean') ||
      searchText.includes('skirt') ||
      searchText.includes('short') ||
      searchText.includes('legging')
    ) {
      return 'lower_body';
    }

    // Upper body (default for tops, outerwear)
    return 'upper_body';
  }

  /**
   * Check if product is jewelry
   * NOTE: Many jewelry endpoints don't exist in YouCam API (bracelet, ring, earrings return 404)
   */
  private isJewelry(searchText: string, product: Product): boolean {
    // Belts are NOT jewelry - they're accessories/clothing
    if (searchText.includes('belt')) {
      return false;
    }

    const jewelryKeywords = [
      'earring', 'necklace', 'pendant'
      // Removed: bracelet, ring, watch - these endpoints don't exist
    ];

    return (
      product.category === 'jewelry' &&
      jewelryKeywords.some(kw => searchText.includes(kw))
    );
  }

  /**
   * Detect specific jewelry type
   */
  private detectJewelryType(searchText: string, product: Product): YouCamEndpointType {
    // Check for earrings
    if (
      searchText.includes('earring') ||
      searchText.includes('ear ring') ||
      searchText.includes('stud') ||
      searchText.includes('hoop')
    ) {
      return 'earrings';
    }

    // Check for rings
    if (
      searchText.includes('ring') &&
      !searchText.includes('earring') &&
      !searchText.includes('ear ring')
    ) {
      return 'ring';
    }

    // Check for bracelets and watches
    if (
      searchText.includes('bracelet') ||
      searchText.includes('bangle') ||
      searchText.includes('watch') ||
      searchText.includes('wrist')
    ) {
      return 'bracelet';
    }

    // Default jewelry type
    return 'bracelet';
  }

  /**
   * Check if product is shoes
   */
  private isShoes(searchText: string, product: Product): boolean {
    const shoeKeywords = [
      'shoe', 'sneaker', 'boot', 'sandal', 'heel',
      'loafer', 'oxford', 'pump', 'slipper', 'footwear'
    ];

    return (
      product.category === 'shoes' ||
      product.category === 'footwear' ||
      shoeKeywords.some(kw => searchText.includes(kw))
    );
  }

  /**
   * Check if product is a bag
   */
  private isBag(searchText: string, product: Product): boolean {
    const bagKeywords = [
      'bag', 'purse', 'handbag', 'backpack', 'tote',
      'clutch', 'satchel', 'messenger', 'crossbody'
    ];

    return (
      product.category === 'bags' ||
      bagKeywords.some(kw => searchText.includes(kw))
    );
  }

  /**
   * Check if product is a scarf
   */
  private isScarf(searchText: string, product: Product): boolean {
    const scarfKeywords = [
      'scarf', 'shawl', 'wrap', 'stole', 'bandana'
    ];

    return (
      product.category === 'scarves' ||
      scarfKeywords.some(kw => searchText.includes(kw))
    );
  }

  /**
   * Check if product is a hat
   */
  private isHat(searchText: string, product: Product): boolean {
    const hatKeywords = [
      'hat', 'cap', 'beanie', 'fedora', 'beret',
      'snapback', 'baseball cap', 'bucket hat'
    ];

    return (
      product.category === 'hats' ||
      hatKeywords.some(kw => searchText.includes(kw))
    );
  }

  /**
   * Get human-readable endpoint name for UI
   */
  getEndpointDisplayName(endpoint: YouCamEndpointType): string {
    const displayNames: Record<YouCamEndpointType, string> = {
      'cloth-v4': 'Clothing',
      'shoes-transfer': 'Shoes',
      'bag': 'Bags',
      'scarf': 'Scarves',
      'bracelet': 'Bracelets & Watches',
      'earrings': 'Earrings',
      'ring': 'Rings',
      'hat': 'Hats',
    };

    return displayNames[endpoint] || 'Unknown';
  }

  /**
   * Get required photo type for endpoint
   */
  getRequiredPhotoType(endpoint: YouCamEndpointType): string {
    const photoRequirements: Record<YouCamEndpointType, string> = {
      'cloth-v4': 'Full body photo',
      'shoes-transfer': 'Full body or legs photo',
      'bag': 'Upper body or full body photo',
      'scarf': 'Upper body or neck photo',
      'bracelet': 'Arm/wrist visible photo',
      'earrings': 'Face/ear visible photo',
      'ring': 'Hand visible photo',
      'hat': 'Head/face visible photo',
    };

    return photoRequirements[endpoint] || 'Full body photo';
  }
}

/**
 * Create product category detector instance
 */
export function createProductCategoryDetector(): ProductCategoryDetector {
  return new ProductCategoryDetector();
}
