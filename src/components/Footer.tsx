import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'shop' | 'studio' | 'fitting') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-[#141416] text-[#FAF8F5] border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-2xl font-editorial font-bold tracking-tight text-white">
              Fashion Fusion
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Elevating digital retail through real-time multi-layer garment simulation, precision biometric fitting rooms, and intelligent cart fit auditing.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Guaranteed Zero-Return Sizing</span>
            </div>
          </div>

          {/* Experience Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3">
              Wardrobe Studio
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateTab('studio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Layered Try-On Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('fitting')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  3D Virtual Fitting Room
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Atelier Collection 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Sizing & Tailoring */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3">
              Biometric Precision
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Ease & Tension Heatmaps</li>
              <li>Anatomical Shoulder & Bust Drop</li>
              <li>Multi-Garment Silhouette Harmony</li>
              <li>Custom Body Profile Presets</li>
            </ul>
          </div>

          {/* Customer Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3">
              Client Concierge
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Complimentary size adjustments and tailor consultations on all garments in the Fashion Fusion collection.
            </p>
            <div className="mt-3 text-xs text-stone-300">
              <span>Delivery: Express Global Dispatch</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <span>&copy; {new Date().getFullYear()} Fashion Fusion. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Biometric Sizing Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
