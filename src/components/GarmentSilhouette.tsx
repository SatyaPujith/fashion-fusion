import React from 'react';
import { Product, GarmentColor } from '../types/fashion';

interface GarmentSilhouetteProps {
  product: Product;
  color?: GarmentColor;
  className?: string;
  showLabels?: boolean;
}

export const GarmentSilhouette: React.FC<GarmentSilhouetteProps> = ({
  product,
  color,
  className = 'w-full h-full',
}) => {
  const activeColorHex = color?.hex || product.colors[0]?.hex || '#1E1E22';

  // If product has a real image URL, show that instead of SVG
  if (product.imageUrl) {
    return (
      <div className={`relative flex items-center justify-center bg-white overflow-hidden ${className}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Fallback to SVG rendering if no image URL
  const renderShape = () => {
    switch (product.svgShape) {
      case 'blazer':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Torso & Lapels */}
            <path
              d="M 50 65 L 85 45 L 120 75 L 155 45 L 190 65 L 205 180 L 175 190 L 165 300 L 75 300 L 65 190 L 35 180 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            {/* Peak Lapels */}
            <path
              d="M 85 45 L 120 160 L 100 120 L 70 85 Z"
              fill="#FFFFFF"
              fillOpacity="0.12"
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <path
              d="M 155 45 L 120 160 L 140 120 L 170 85 Z"
              fill="#000000"
              fillOpacity="0.15"
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            {/* Center closure & buttons */}
            <line x1="120" y1="160" x2="120" y2="300" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="116" cy="180" r="3" fill="#D7D1C7" stroke="#222" strokeWidth="0.8" />
            <circle cx="116" cy="215" r="3" fill="#D7D1C7" stroke="#222" strokeWidth="0.8" />
            {/* Flap pockets */}
            <rect x="75" y="220" width="32" height="6" rx="1" fill="#000000" fillOpacity="0.25" />
            <rect x="133" y="220" width="32" height="6" rx="1" fill="#000000" fillOpacity="0.25" />
            {/* Breast pocket */}
            <line x1="82" y1="145" x2="104" y2="145" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" />
          </svg>
        );

      case 'trench':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Long flared silhouette */}
            <path
              d="M 52 50 L 90 35 L 120 60 L 150 35 L 188 50 L 208 190 L 180 200 L 195 315 L 45 315 L 60 200 L 32 190 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            {/* Wide storm flap */}
            <path
              d="M 90 35 L 150 35 L 155 110 L 90 125 Z"
              fill="#FFFFFF"
              fillOpacity="0.1"
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
            {/* Belt */}
            <rect x="68" y="165" width="104" height="14" rx="2" fill="#000000" fillOpacity="0.35" />
            <rect x="110" y="162" width="20" height="20" rx="3" fill="none" stroke="#E5C158" strokeWidth="2" />
            {/* Center overlap */}
            <path d="M 115 60 L 125 315" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />
          </svg>
        );

      case 'tank':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Bias silk cami straps */}
            <path d="M 85 40 L 85 90" stroke={activeColorHex} strokeWidth="3" strokeLinecap="round" />
            <path d="M 155 40 L 155 90" stroke={activeColorHex} strokeWidth="3" strokeLinecap="round" />
            {/* Body */}
            <path
              d="M 85 90 Q 120 115 155 90 L 165 250 Q 120 262 75 250 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
            {/* Silk satin soft sheen gradient */}
            <path
              d="M 100 100 Q 115 180 110 240"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeOpacity="0.12"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'shirt':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Shirt torso & sleeves */}
            <path
              d="M 60 70 L 95 50 L 120 70 L 145 50 L 180 70 L 195 210 L 170 215 L 160 270 L 80 270 L 70 215 L 45 210 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            {/* Pointed collar */}
            <path d="M 95 50 L 110 95 L 120 72 L 130 95 L 145 50 Z" fill="#FFFFFF" fillOpacity="0.2" stroke="#000000" strokeWidth="1" strokeOpacity="0.2" />
            {/* Placket */}
            <line x1="120" y1="72" x2="120" y2="270" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="120" cy="110" r="2" fill="#D0D0D0" />
            <circle cx="120" cy="140" r="2" fill="#D0D0D0" />
            <circle cx="120" cy="170" r="2" fill="#D0D0D0" />
            <circle cx="120" cy="200" r="2" fill="#D0D0D0" />
            <circle cx="120" cy="230" r="2" fill="#D0D0D0" />
          </svg>
        );

      case 'sweater':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Turtleneck collar */}
            <rect x="100" y="32" width="40" height="28" rx="4" fill={activeColorHex} stroke="#000000" strokeWidth="1.2" strokeOpacity="0.25" />
            <line x1="102" y1="46" x2="138" y2="46" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" />
            {/* Fitted torso */}
            <path
              d="M 68 70 L 100 60 L 140 60 L 172 70 L 185 240 L 160 245 L 152 265 L 88 265 L 80 245 L 55 240 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            {/* Ribbed knit texture folds */}
            <path d="M 105 80 Q 120 150 115 250" stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.08" />
            <path d="M 135 80 Q 125 150 128 250" stroke="#000000" strokeWidth="4" strokeOpacity="0.1" />
          </svg>
        );

      case 'trousers':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Wide leg pleated high rise */}
            <path
              d="M 80 40 L 160 40 L 170 300 L 126 300 L 120 120 L 114 300 L 70 300 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            {/* High waistband */}
            <rect x="80" y="40" width="80" height="12" fill="#000000" fillOpacity="0.15" />
            {/* Knife pleats */}
            <line x1="98" y1="52" x2="94" y2="280" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.3" />
            <line x1="142" y1="52" x2="146" y2="280" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.3" />
          </svg>
        );

      case 'jeans':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Straight leg denim */}
            <path
              d="M 82 45 L 158 45 L 162 295 L 125 295 L 120 130 L 115 295 L 78 295 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            {/* Copper contrast stitching */}
            <line x1="82" y1="58" x2="158" y2="58" stroke="#D9822B" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="120" cy="52" r="3" fill="#D9822B" />
            {/* Whiskers / pocket arches */}
            <path d="M 86 58 Q 98 78 112 58" stroke="#D9822B" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <path d="M 128 58 Q 142 78 154 58" stroke="#D9822B" strokeWidth="1" fill="none" strokeDasharray="3 2" />
          </svg>
        );

      case 'skirt':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Bias cut silk maxi skirt */}
            <path
              d="M 85 45 Q 120 48 155 45 L 180 295 Q 120 305 60 295 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
            {/* Fluid drape folds */}
            <path d="M 100 50 Q 125 180 90 295" stroke="#FFFFFF" strokeWidth="14" strokeOpacity="0.1" />
            <path d="M 140 50 Q 115 180 150 295" stroke="#000000" strokeWidth="14" strokeOpacity="0.12" />
          </svg>
        );

      case 'loafers':
      case 'boots':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Pair of shoes / loafers */}
            {/* Left Shoe */}
            <path
              d="M 50 140 Q 55 105 75 105 Q 90 105 92 140 L 98 215 Q 100 230 75 230 Q 48 230 48 205 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <path d="M 45 205 L 100 215 L 98 230 L 45 220 Z" fill="#1A1A1A" />
            {/* Right Shoe */}
            <path
              d="M 148 140 Q 150 105 168 105 Q 185 105 190 140 L 192 205 Q 192 230 165 230 Q 140 230 142 215 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <path d="M 140 205 L 195 215 L 195 230 L 140 220 Z" fill="#1A1A1A" />
            {/* Metallic bit / strap detail */}
            <rect x="62" y="145" width="20" height="4" rx="1" fill="#E5C158" />
            <rect x="156" y="145" width="20" height="4" rx="1" fill="#E5C158" />
          </svg>
        );

      case 'bag':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Curved handle */}
            <path d="M 80 150 C 80 70, 160 70, 160 150" stroke="#000000" strokeWidth="5" strokeOpacity="0.5" fill="none" />
            <path d="M 80 150 C 80 75, 160 75, 160 150" stroke={activeColorHex} strokeWidth="3" fill="none" />
            {/* Crescent body */}
            <path
              d="M 50 150 Q 120 120 190 150 Q 185 240 120 250 Q 55 240 50 150 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            {/* Gold lock */}
            <circle cx="120" cy="180" r="5" fill="#E5C158" stroke="#9E7B26" strokeWidth="1" />
          </svg>
        );

      case 'belt':
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-md" fill="none">
            {/* Rolled or looped belt */}
            <path
              d="M 40 160 Q 120 135 200 160 L 198 176 Q 120 151 40 176 Z"
              fill={activeColorHex}
              stroke="#000000"
              strokeWidth="1.2"
              strokeOpacity="0.3"
            />
            <rect x="105" y="146" width="30" height="26" rx="4" fill="none" stroke="#E5C158" strokeWidth="3" />
            <circle cx="120" cy="159" r="2.5" fill="#E5C158" />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-lg bg-stone-200 border border-stone-300" />
          </div>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-[#F7F6F2] to-[#ECEAE3] overflow-hidden ${className}`}>
      {/* Editorial backdrop accents */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/60 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-stone-400/20 blur-2xl" />
      </div>

      <div className="relative w-full h-full max-w-[220px] max-h-[290px] flex items-center justify-center transition-all duration-300">
        {renderShape()}
      </div>
    </div>
  );
};
