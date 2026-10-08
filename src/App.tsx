import React, { useState, useEffect } from 'react';
import { BodyMeasurements, CartItem, GarmentColor, Product, TryOnSelection } from './types/fashion';
import { INITIAL_BODY_MEASUREMENTS } from './data/mockProducts';
import { evaluateGarmentFit } from './utils/fitEngine';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { TryOnStudio } from './components/TryOnStudio';
import { FittingRoom } from './components/FittingRoom';
import { AiCartDrawer } from './components/AiCartDrawer';
import { Footer } from './components/Footer';
import { useProducts } from './hooks/useProducts';

export default function App() {
  const { products, loading, error } = useProducts();
  
  const [activeTab, setActiveTab] = useState<'shop' | 'studio' | 'fitting'>('shop');
  const [measurements, setMeasurements] = useState<BodyMeasurements>(INITIAL_BODY_MEASUREMENTS);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [fittingRoomProduct, setFittingRoomProduct] = useState<Product | undefined>(undefined);

  // Initialize Try-On selection with a curated chic look
  const [tryOnState, setTryOnState] = useState<TryOnSelection>({
    outerwear: null,
    tops: null,
    bottoms: null,
    footwear: null,
    accessories: null,
    selectedColors: {},
  });

  // Initialize Try-On state when products are loaded
  useEffect(() => {
    if (products.length > 0 && !tryOnState.outerwear) {
      setTryOnState({
        outerwear: products.find(p => p.category === 'outerwear') || null,
        tops: products.find(p => p.category === 'tops') || null,
        bottoms: products.find(p => p.category === 'bottoms') || null,
        footwear: products.find(p => p.category === 'footwear') || null,
        accessories: products.find(p => p.category === 'accessories') || null,
        selectedColors: {},
      });
    }
  }, [products]);

  // Initialize Cart with 2 items when products are loaded
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (products.length > 0 && cart.length === 0) {
      const outerwear = products.find(p => p.category === 'outerwear');
      const bottoms = products.find(p => p.category === 'bottoms');

      const initialCart: CartItem[] = [];

      if (outerwear) {
        initialCart.push({
          id: 'cart-init-1',
          product: outerwear,
          selectedSize: 'M',
          selectedColor: outerwear.colors[0],
          quantity: 1,
          fitEvaluation: evaluateGarmentFit(outerwear, 'M', INITIAL_BODY_MEASUREMENTS),
        });
      }

      if (bottoms) {
        initialCart.push({
          id: 'cart-init-2',
          product: bottoms,
          selectedSize: 'S', // Intentionally 'S' to showcase the AI Cart fit alert
          selectedColor: bottoms.colors[0],
          quantity: 1,
          fitEvaluation: evaluateGarmentFit(bottoms, 'S', INITIAL_BODY_MEASUREMENTS),
        });
      }

      setCart(initialCart);
    }
  }, [products]);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: GarmentColor) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === product.id && i.selectedSize === size && i.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }

      const fitEval = evaluateGarmentFit(product, size, measurements);
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: 1,
        fitEvaluation: fitEval,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(i => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleUpdateSize = (cartItemId: string, newSize: string) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id !== cartItemId) return item;
        const newFitEval = evaluateGarmentFit(item.product, newSize, measurements);
        return {
          ...item,
          selectedSize: newSize,
          fitEvaluation: newFitEval,
        };
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Workflow transitions
  const handleTryInStudio = (product: Product) => {
    setTryOnState(prev => ({
      ...prev,
      [product.category]: product,
    }));
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckFitInRoom = (product: Product) => {
    setFittingRoomProduct(product);
    setActiveTab('fitting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#19191C]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        measurements={measurements}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Data Source Indicator */}
      {error && (
        <div className="w-full px-4 py-2 text-center text-sm bg-amber-50 text-amber-700 border-b border-amber-200">
          <span>⚠️ {error}. Using fallback data.</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19191C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      {!loading && (
        <main className="flex-1">
          {activeTab === 'shop' && (
            <ProductCatalog
              products={products}
              measurements={measurements}
              onAddToCart={handleAddToCart}
              onTryInStudio={handleTryInStudio}
              onCheckFitInRoom={handleCheckFitInRoom}
              onOpenFittingRoom={() => {
                setActiveTab('fitting');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTryOnStudio={() => {
                setActiveTab('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'studio' && (
            <TryOnStudio
              products={products}
              measurements={measurements}
              tryOnState={tryOnState}
              setTryOnState={setTryOnState}
              onAddToCart={handleAddToCart}
              onNavigateToFittingRoom={prod => {
                if (prod) setFittingRoomProduct(prod);
                setActiveTab('fitting');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {activeTab === 'fitting' && (
            <FittingRoom
              products={products}
              measurements={measurements}
              setMeasurements={setMeasurements}
              selectedProduct={fittingRoomProduct}
              onAddToCart={handleAddToCart}
              onNavigateToStudio={() => {
                setActiveTab('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>
      )}

      {/* AI in the Cart Slide-over Drawer */}
      <AiCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        measurements={measurements}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateSize={handleUpdateSize}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onNavigateToFittingRoom={prod => {
          setFittingRoomProduct(prod);
          setActiveTab('fitting');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer onNavigateTab={tab => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
