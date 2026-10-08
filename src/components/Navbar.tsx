import React from 'react';
import { BodyMeasurements, CartItem } from '../types/fashion';
import { ShoppingBag, Sliders, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'shop' | 'studio' | 'fitting';
  setActiveTab: (tab: 'shop' | 'studio' | 'fitting') => void;
  cart: CartItem[];
  measurements: BodyMeasurements;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cart,
  measurements,
  onOpenCart,
}) => {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check if any cart item has a warning
  const hasWarning = cart.some(
    item => item.fitEvaluation && item.fitEvaluation.status !== 'perfect'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-6 text links) — Zone 3 (1-2 actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          onClick={() => setActiveTab('shop')}
          className="text-2xl font-editorial font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors cursor-pointer text-left"
        >
          Fashion Fusion
        </button>

        {/* Zone 2: Clean Text Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('shop')}
            className={`transition-colors cursor-pointer hover:text-stone-900 pb-1 ${
              activeTab === 'shop'
                ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                : ''
            }`}
          >
            Collection
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`transition-colors cursor-pointer hover:text-stone-900 pb-1 flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                : ''
            }`}
          >
            <span>Try-On Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </button>

          <button
            onClick={() => setActiveTab('fitting')}
            className={`transition-colors cursor-pointer hover:text-stone-900 pb-1 flex items-center gap-1.5 ${
              activeTab === 'fitting'
                ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                : ''
            }`}
          >
            <span>Virtual Fitting Room</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Active Profile Indicator Button */}
          <button
            onClick={() => setActiveTab('fitting')}
            className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 text-xs text-stone-700 transition-colors cursor-pointer"
            title="Inspect or adjust body measurements"
          >
            <Sliders className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono text-stone-900 font-semibold">
              {measurements.bust}B / {measurements.waist}W
            </span>
          </button>

          {/* Bag / Cart Trigger with AI Fit Status */}
          <button
            onClick={onOpenCart}
            className="relative py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="font-mono bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-bold">
              {cartCount}
            </span>

            {/* Warning indicator dot if sizes in cart have conflicts */}
            {hasWarning && (
              <span
                className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-stone-900 absolute -top-1 -right-1"
                title="Fit Warning: Size conflict detected in bag"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Sub-row */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 py-2.5 px-4 bg-stone-50 text-xs font-medium text-stone-600">
        <button
          onClick={() => setActiveTab('shop')}
          className={`cursor-pointer ${activeTab === 'shop' ? 'text-stone-900 font-bold' : ''}`}
        >
          Collection
        </button>
        <button
          onClick={() => setActiveTab('studio')}
          className={`cursor-pointer flex items-center gap-1 ${activeTab === 'studio' ? 'text-stone-900 font-bold' : ''}`}
        >
          <span>Try-On Studio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>
        <button
          onClick={() => setActiveTab('fitting')}
          className={`cursor-pointer ${activeTab === 'fitting' ? 'text-stone-900 font-bold' : ''}`}
        >
          Fitting Room
        </button>
      </div>
    </header>
  );
};
