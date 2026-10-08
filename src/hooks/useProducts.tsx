import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/fashion';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { createFashionAPIService } from '../services/fashionAPI';
import { createSerpAPIService } from '../services/serpAPI';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch products from SerpAPI (priority) or Fashion API or use mock data as fallback
   */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Priority 1: Try SerpAPI if API key is configured
      const serpApiKey = import.meta.env.VITE_SERPAPI_KEY;
      
      console.log('🔑 All ENV vars:', import.meta.env);
      console.log('🔑 VITE_SERPAPI_KEY value:', serpApiKey);
      console.log('🔑 VITE_SERPAPI_KEY type:', typeof serpApiKey);
      console.log('🔑 SerpAPI Key Check:', serpApiKey ? `Found (${serpApiKey.substring(0, 10)}...)` : 'Not found');
      
      if (serpApiKey && serpApiKey !== 'your_serpapi_key_here' && serpApiKey !== '') {
        console.log('🔍 Fetching products from Google Shopping via SerpAPI...');
        try {
          const serpService = createSerpAPIService(serpApiKey);
          const serpProducts = await serpService.fetchFashionProducts();

          if (serpProducts.length > 0) {
            console.log(`✅ Fetched ${serpProducts.length} products from SerpAPI!`);
            setProducts(serpProducts);
            setLoading(false);
            return;
          }
        } catch (serpError) {
          console.error('❌ SerpAPI Error:', serpError);
          console.log('⚠️ Falling back to Fashion APIs...');
        }
      } else {
        console.log('⚠️ SerpAPI key not configured, using Fashion APIs...');
      }

      // Priority 2: Fallback to Fashion API
      console.log('🌐 Fetching fashion products from free APIs...');
      const fashionService = createFashionAPIService();
      const fashionProducts = await fashionService.fetchFashionProducts();

      if (fashionProducts.length > 0) {
        console.log(`✅ Fetched ${fashionProducts.length} products from Fashion APIs`);
        setProducts(fashionProducts);
      } else {
        console.log('📦 Using demo product data');
        setProducts(MOCK_PRODUCTS);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      console.error('❌ Product fetch error:', errorMessage);
      setError(errorMessage);
      
      // Fallback to mock data on error
      console.log('📦 Falling back to demo data');
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductsContextValue = {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

/**
 * Hook to access products data
 */
export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}

/**
 * Hook to filter products by category
 */
export function useProductsByCategory(category: string) {
  const { products, ...rest } = useProducts();
  const filteredProducts = products.filter(p => p.category === category);
  return { products: filteredProducts, ...rest };
}

/**
 * Hook to get a single product by ID
 */
export function useProduct(productId: string) {
  const { products, ...rest } = useProducts();
  const product = products.find(p => p.id === productId);
  return { product, ...rest };
}
