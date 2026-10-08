export type ProductCategory = 'outerwear' | 'tops' | 'bottoms' | 'footwear' | 'accessories' | 'dresses' | 'shoes' | 'bags' | 'scarves' | 'hats' | 'jewelry';
export type Gender = 'men' | 'women' | 'unisex';

// YouCam API endpoint types for different product categories
export type YouCamEndpointType = 
  | 'cloth-v4'          // For clothing (tops, bottoms, dresses, outerwear)
  | 'shoes-transfer'    // For shoes
  | 'bag'               // For bags
  | 'scarf'             // For scarves
  | 'bracelet'          // For bracelets, watches
  | 'earrings'          // For earrings
  | 'ring'              // For rings
  | 'hat';              // For hats (if available)

// Jewelry subcategories
export type JewelryType = 'bracelet' | 'earrings' | 'ring' | 'watch' | 'necklace';

export type FitType = 'slim' | 'tailored' | 'relaxed' | 'oversized';
export type StretchType = 'rigid' | 'slight' | 'medium' | 'high';
export type BodyShape = 'hourglass' | 'rectangle' | 'pear' | 'inverted-triangle' | 'athletic';

export interface GarmentColor {
  name: string;
  hex: string;
  border?: string;
}

export interface SizeMeasurement {
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  shoulder?: number; // cm
  length?: number; // cm
  inseam?: number; // cm
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  fabric: string;
  care: string;
  stretch: StretchType;
  fitType: FitType;
  colors: GarmentColor[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  measurements: Record<string, SizeMeasurement>;
  harmonyTags: string[];
  stylingAdvice: string;
  svgShape: 'blazer' | 'trench' | 'sweater' | 'shirt' | 'tank' | 'trousers' | 'jeans' | 'skirt' | 'boots' | 'loafers' | 'sneakers' | 'bag' | 'belt' | 'dress' | 'scarf' | 'hat' | 'ring' | 'bracelet' | 'earrings' | 'watch';
  imageUrl?: string; // Real product image URL from API
  gender?: Gender; // Men's, Women's, or Unisex
  inStock: boolean;
  featured?: boolean;
  jewelryType?: JewelryType; // For jewelry items
  youCamEndpoint?: YouCamEndpointType; // AI-detected endpoint for virtual try-on
}

export interface BodyMeasurements {
  height: number; // cm
  bust: number; // cm
  waist: number; // cm
  hips: number; // cm
  shoulderWidth: number; // cm
  inseam: number; // cm
  bodyShape: BodyShape;
  preferredFit: FitType;
  unit: 'cm' | 'in';
}

export interface FitEvaluation {
  status: 'perfect' | 'caution' | 'mismatch';
  confidenceScore: number; // 0 - 100
  recommendedSize: string;
  sizeDelta: {
    bustDelta: number; // garment - user
    waistDelta: number;
    hipsDelta: number;
    shoulderDelta?: number;
  };
  critique: string;
  adjustmentAdvice?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  selectedSize: string;
  selectedColor: GarmentColor;
  quantity: number;
  fitEvaluation?: FitEvaluation;
}

export interface TryOnSelection {
  outerwear: Product | null;
  tops: Product | null;
  bottoms: Product | null;
  footwear: Product | null;
  accessories: Product | null;
  selectedColors: Record<string, GarmentColor>; // productId -> GarmentColor
}
