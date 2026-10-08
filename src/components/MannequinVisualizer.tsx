import React from 'react';
import { BodyMeasurements, GarmentColor, Product } from '../types/fashion';

interface MannequinVisualizerProps {
  tryOnState?: {
    outerwear: Product | null;
    tops: Product | null;
    bottoms: Product | null;
    footwear: Product | null;
    accessories: Product | null;
    selectedColors?: Record<string, GarmentColor>;
  };
  measurements: BodyMeasurements;
  isFittingRoomMode?: boolean;
  highlightZone?: 'shoulder' | 'bust' | 'waist' | 'hips' | 'inseam' | null;
  onZoneClick?: (zone: 'shoulder' | 'bust' | 'waist' | 'hips' | 'inseam') => void;
  testedProduct?: Product | null;
  testedSize?: string;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({
  tryOnState,
  measurements,
  isFittingRoomMode = false,
  highlightZone,
  onZoneClick,
  testedProduct,
  testedSize = 'M',
}) => {
  // Proportional body scaling derived from user measurements
  // Base standards: height 170cm, bust 90cm, waist 70cm, hips 95cm
  const bustScale = Math.min(1.25, Math.max(0.82, measurements.bust / 90));
  const waistScale = Math.min(1.3, Math.max(0.8, measurements.waist / 70));
  const hipsScale = Math.min(1.3, Math.max(0.82, measurements.hips / 95));
  const shoulderSpan = Math.min(1.2, Math.max(0.85, measurements.shoulderWidth / 40));

  // Determine colors of active garments
  const getColorHex = (product: Product | null, defaultColor: string) => {
    if (!product) return defaultColor;
    const custom = tryOnState?.selectedColors?.[product.id];
    return custom ? custom.hex : product.colors[0]?.hex || defaultColor;
  };

  const outerwearHex = getColorHex(tryOnState?.outerwear || null, '#28282D');
  const topsHex = getColorHex(tryOnState?.tops || null, '#E5DED4');
  const bottomsHex = getColorHex(tryOnState?.bottoms || null, '#968C7E');
  const footwearHex = getColorHex(tryOnState?.footwear || null, '#1E1E20');
  const accessoriesHex = getColorHex(tryOnState?.accessories || null, '#82532E');

  // Interactive fit calculations for fitting room mode
  const testedChart = testedProduct?.measurements[testedSize] || testedProduct?.measurements['M'] || {};
  const gBust = testedChart.chest ?? 92;
  const gWaist = testedChart.waist ?? 76;
  const gHips = testedChart.hips ?? 100;
  const gShoulder = testedChart.shoulder ?? 41;

  const bustEase = gBust - measurements.bust;
  const waistEase = gWaist - measurements.waist;
  const hipsEase = gHips - measurements.hips;
  const shoulderEase = gShoulder - measurements.shoulderWidth;

  const getStatusColor = (ease: number, idealMin: number, idealMax: number) => {
    if (ease >= idealMin && ease <= idealMax) return '#10B981'; // Green (ideal)
    if (ease < idealMin - 3 || ease > idealMax + 8) return '#EF4444'; // Red (mismatch)
    return '#F59E0B'; // Amber (caution)
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden py-4">
      {/* Background Studio Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-[500px] bg-gradient-to-b from-[#FAF8F5] via-[#F2EDE4] to-[#E5DEC3]/40 rounded-full blur-3xl opacity-80" />
        <div className="absolute bottom-6 w-56 h-8 bg-stone-900/10 rounded-full blur-lg" />
      </div>

      {/* SVG Fashion Mannequin & Multi-Layer Garments */}
      <svg
        viewBox="0 0 340 680"
        className="w-full h-full max-h-[620px] drop-shadow-xl z-10 transition-transform duration-500"
        fill="none"
      >
        <defs>
          <linearGradient id="bodySkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFD8CE" />
            <stop offset="100%" stopColor="#C4BCB0" />
          </linearGradient>
          <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. MANNEQUIN BODY BASE */}
        {/* Head & Neck */}
        <ellipse cx="170" cy="58" rx="20" ry="26" fill="url(#bodySkin)" stroke="#B3ABA0" strokeWidth="1" />
        {/* Editorial sunglasses / abstract feature */}
        <line x1="156" y1="58" x2="184" y2="58" stroke="#333336" strokeWidth="2" strokeLinecap="round" />
        <path d="M 164 82 L 164 105 L 176 105 L 176 82 Z" fill="url(#bodySkin)" stroke="#B3ABA0" strokeWidth="1" />

        {/* Shoulders & Arms Base */}
        <g id="body-arms">
          {/* Left Arm */}
          <path
            d="M 125 110 Q 110 210 108 300 Q 107 330 114 360"
            stroke="url(#bodySkin)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Right Arm */}
          <path
            d="M 215 110 Q 230 210 232 300 Q 233 330 226 360"
            stroke="url(#bodySkin)"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>

        {/* Torso Base */}
        <path
          d={`M ${170 - 45 * shoulderSpan} 110
              Q ${170 - 42 * bustScale} 165 ${170 - 28 * waistScale} 220
              Q ${170 - 46 * hipsScale} 280 ${170 - 32} 340
              L ${170 + 32} 340
              Q ${170 + 46 * hipsScale} 280 ${170 + 28 * waistScale} 220
              Q ${170 + 42 * bustScale} 165 ${170 + 45 * shoulderSpan} 110 Z`}
          fill="url(#bodySkin)"
          stroke="#B3ABA0"
          strokeWidth="1.2"
        />

        {/* Legs Base */}
        {/* Left Leg */}
        <path
          d="M 144 340 Q 142 460 146 560 L 148 610"
          stroke="url(#bodySkin)"
          strokeWidth="24"
          strokeLinecap="round"
        />
        {/* Right Leg */}
        <path
          d="M 196 340 Q 198 460 194 560 L 192 610"
          stroke="url(#bodySkin)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* 2. GARMENT LAYERS */}
        
        {/* LAYER A: TOPS */}
        {tryOnState?.tops && (
          <g id="layer-tops" className="transition-all duration-300">
            {tryOnState.tops.svgShape === 'tank' ? (
              // Silk Camisole
              <g>
                <line x1={170 - 18 * bustScale} y1="108" x2={170 - 18 * bustScale} y2="135" stroke={topsHex} strokeWidth="3" />
                <line x1={170 + 18 * bustScale} y1="108" x2={170 + 18 * bustScale} y2="135" stroke={topsHex} strokeWidth="3" />
                <path
                  d={`M ${170 - 24 * bustScale} 135
                      Q 170 152 ${170 + 24 * bustScale} 135
                      L ${170 + 30 * waistScale} 230
                      L ${170 - 30 * waistScale} 230 Z`}
                  fill={topsHex}
                  stroke="#1E1E22"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                />
              </g>
            ) : tryOnState.tops.svgShape === 'sweater' ? (
              // Turtleneck Sweater
              <g>
                {/* Turtleneck collar */}
                <rect x="157" y="80" width="26" height="26" rx="3" fill={topsHex} stroke="#1E1E22" strokeWidth="1" strokeOpacity="0.2" />
                {/* Long sleeves */}
                <path d="M 125 110 Q 110 200 108 285" stroke={topsHex} strokeWidth="17" strokeLinecap="round" />
                <path d="M 215 110 Q 230 200 232 285" stroke={topsHex} strokeWidth="17" strokeLinecap="round" />
                {/* Torso */}
                <path
                  d={`M ${170 - 45 * shoulderSpan} 110
                      L ${170 + 45 * shoulderSpan} 110
                      Q ${170 + 38 * bustScale} 165 ${170 + 28 * waistScale} 235
                      L ${170 - 28 * waistScale} 235
                      Q ${170 - 38 * bustScale} 165 ${170 - 45 * shoulderSpan} 110 Z`}
                  fill={topsHex}
                  stroke="#1E1E22"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                />
              </g>
            ) : (
              // Poplin Shirt
              <g>
                <path d="M 125 110 Q 110 200 108 285" stroke={topsHex} strokeWidth="18" strokeLinecap="round" />
                <path d="M 215 110 Q 230 200 232 285" stroke={topsHex} strokeWidth="18" strokeLinecap="round" />
                <path
                  d={`M ${170 - 46 * shoulderSpan} 108
                      L 170 125
                      L ${170 + 46 * shoulderSpan} 108
                      L ${170 + 34 * waistScale} 242
                      L ${170 - 34 * waistScale} 242 Z`}
                  fill={topsHex}
                  stroke="#1E1E22"
                  strokeWidth="1.2"
                  strokeOpacity="0.3"
                />
                {/* Placket */}
                <line x1="170" y1="125" x2="170" y2="242" stroke="#222" strokeWidth="1" strokeOpacity="0.2" />
              </g>
            )}
          </g>
        )}

        {/* LAYER B: BOTTOMS */}
        {tryOnState?.bottoms && (
          <g id="layer-bottoms" className="transition-all duration-300">
            {tryOnState.bottoms.svgShape === 'skirt' ? (
              // Bias Maxi Skirt
              <path
                d={`M ${170 - 29 * waistScale} 220
                    L ${170 + 29 * waistScale} 220
                    Q ${170 + 46 * hipsScale} 280 225 540
                    Q 170 550 115 540
                    Q ${170 - 46 * hipsScale} 280 ${170 - 29 * waistScale} 220 Z`}
                fill={bottomsHex}
                stroke="#1A1A1E"
                strokeWidth="1.2"
                strokeOpacity="0.25"
              />
            ) : tryOnState.bottoms.svgShape === 'jeans' ? (
              // Straight Raw Denim
              <g>
                <path
                  d={`M ${170 - 30 * waistScale} 225
                      L ${170 + 30 * waistScale} 225
                      L ${170 + 38 * hipsScale} 290
                      L 210 565
                      L 175 565
                      L 170 330
                      L 165 565
                      L 130 565
                      L ${170 - 38 * hipsScale} 290 Z`}
                  fill={bottomsHex}
                  stroke="#1A1A1E"
                  strokeWidth="1.2"
                  strokeOpacity="0.3"
                />
                {/* Jean stitching detail */}
                <line x1={170 - 29 * waistScale} y1="237" x2={170 + 29 * waistScale} y2="237" stroke="#D9822B" strokeWidth="1" strokeDasharray="3 2" />
              </g>
            ) : (
              // Fluid Pleated Trousers (Wide Leg)
              <g>
                <path
                  d={`M ${170 - 30 * waistScale} 218
                      L ${170 + 30 * waistScale} 218
                      L ${170 + 44 * hipsScale} 285
                      L 224 570
                      L 178 570
                      L 170 320
                      L 162 570
                      L 116 570
                      L ${170 - 44 * hipsScale} 285 Z`}
                  fill={bottomsHex}
                  stroke="#1A1A1E"
                  strokeWidth="1.2"
                  strokeOpacity="0.2"
                />
                {/* Knife Pleat creases */}
                <line x1="148" y1="230" x2="142" y2="550" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
                <line x1="192" y1="230" x2="198" y2="550" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
              </g>
            )}
          </g>
        )}

        {/* LAYER C: OUTERWEAR */}
        {tryOnState?.outerwear && (
          <g id="layer-outerwear" className="transition-all duration-300">
            {tryOnState.outerwear.svgShape === 'trench' ? (
              // Trench Coat
              <g>
                {/* Sleeves */}
                <path d="M 125 106 Q 106 200 102 300" stroke={outerwearHex} strokeWidth="22" strokeLinecap="round" />
                <path d="M 215 106 Q 234 200 238 300" stroke={outerwearHex} strokeWidth="22" strokeLinecap="round" />
                {/* Body Flared */}
                <path
                  d={`M ${170 - 48 * shoulderSpan} 104
                      L ${170 - 15} 120
                      L ${170 + 15} 120
                      L ${170 + 48 * shoulderSpan} 104
                      L 236 490
                      L 104 490 Z`}
                  fill={outerwearHex}
                  stroke="#000"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />
                {/* Belted Waist */}
                <rect x={170 - 36 * waistScale} y="222" width={72 * waistScale} height="14" rx="2" fill="#000000" fillOpacity="0.35" />
                <rect x="162" y="219" width="16" height="20" rx="2" fill="none" stroke="#E5C158" strokeWidth="2" />
              </g>
            ) : (
              // Tailored Double-Breasted Blazer
              <g>
                {/* Sleeves */}
                <path d="M 125 106 Q 108 200 106 295" stroke={outerwearHex} strokeWidth="20" strokeLinecap="round" />
                <path d="M 215 106 Q 232 200 234 295" stroke={outerwearHex} strokeWidth="20" strokeLinecap="round" />
                {/* Blazer Body */}
                <path
                  d={`M ${170 - 50 * shoulderSpan} 104
                      L ${170 + 50 * shoulderSpan} 104
                      L ${170 + 36 * waistScale} 255
                      L ${170 - 36 * waistScale} 255 Z`}
                  fill={outerwearHex}
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                />
                {/* Peak Lapels Overlap */}
                <path
                  d={`M ${170 - 40} 105 L 170 175 L ${170 - 24} 150 L ${170 - 48} 118 Z`}
                  fill="#FFF"
                  fillOpacity="0.12"
                  stroke="#000"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                />
                <path
                  d={`M ${170 + 40} 105 L 170 175 L ${170 + 24} 150 L ${170 + 48} 118 Z`}
                  fill="#000"
                  fillOpacity="0.18"
                  stroke="#000"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                />
                {/* Gold/Horn Buttons */}
                <circle cx="166" cy="190" r="3" fill="#D7D1C7" stroke="#333" strokeWidth="0.8" />
                <circle cx="166" cy="214" r="3" fill="#D7D1C7" stroke="#333" strokeWidth="0.8" />
                <circle cx="174" cy="190" r="3" fill="#D7D1C7" stroke="#333" strokeWidth="0.8" />
                <circle cx="174" cy="214" r="3" fill="#D7D1C7" stroke="#333" strokeWidth="0.8" />
              </g>
            )}
          </g>
        )}

        {/* LAYER D: ACCESSORIES */}
        {tryOnState?.accessories && (
          <g id="layer-accessories" className="transition-all duration-300">
            {tryOnState.accessories.svgShape === 'bag' && (
              // Crescent Bag slung on right forearm/wrist
              <g>
                <path d="M 233 260 Q 248 290 236 320" stroke="#000" strokeWidth="4" strokeOpacity="0.4" fill="none" />
                <path
                  d="M 220 290 Q 255 275 270 295 Q 268 335 240 340 Q 215 330 220 290 Z"
                  fill={accessoriesHex}
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                />
                <circle cx="245" cy="305" r="3" fill="#E5C158" />
              </g>
            )}
          </g>
        )}

        {/* LAYER E: FOOTWEAR */}
        <g id="layer-footwear">
          {tryOnState?.footwear ? (
            <g>
              {/* Left Shoe */}
              <ellipse cx="146" cy="612" rx="14" ry="7" fill={footwearHex} stroke="#1A1A1A" strokeWidth="1" />
              <path d="M 136 612 L 156 612" stroke="#E5C158" strokeWidth="1.5" />
              {/* Right Shoe */}
              <ellipse cx="194" cy="612" rx="14" ry="7" fill={footwearHex} stroke="#1A1A1A" strokeWidth="1" />
              <path d="M 184 612 L 204 612" stroke="#E5C158" strokeWidth="1.5" />
            </g>
          ) : (
            <g>
              {/* Bare feet */}
              <ellipse cx="146" cy="612" rx="10" ry="5" fill="url(#bodySkin)" />
              <ellipse cx="194" cy="612" rx="10" ry="5" fill="url(#bodySkin)" />
            </g>
          )}
        </g>

        {/* 3. VIRTUAL FITTING ROOM MEASUREMENT ANNOTATION OVERLAYS */}
        {isFittingRoomMode && (
          <g id="fitting-room-overlays" className="animate-fade-in">
            {/* SHOULDER SPAN MEASUREMENT */}
            <g
              className="cursor-pointer group"
              onClick={() => onZoneClick?.('shoulder')}
            >
              <line
                x1={170 - 45 * shoulderSpan - 12}
                y1="104"
                x2={170 + 45 * shoulderSpan + 12}
                y2="104"
                stroke={highlightZone === 'shoulder' ? '#3B82F6' : '#19191C'}
                strokeWidth={highlightZone === 'shoulder' ? '2.5' : '1.5'}
                strokeDasharray="4 3"
              />
              <circle
                cx={170 - 45 * shoulderSpan}
                cy="104"
                r="4"
                fill={getStatusColor(shoulderEase, -1, 3)}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <circle
                cx={170 + 45 * shoulderSpan}
                cy="104"
                r="4"
                fill={getStatusColor(shoulderEase, -1, 3)}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              {/* Shoulder Label */}
              <text
                x="38"
                y="108"
                fill="#19191C"
                fontSize="10"
                fontWeight="600"
                className="font-mono tracking-tight"
              >
                SHL: {measurements.shoulderWidth}cm ({shoulderEase >= 0 ? `+${shoulderEase}` : shoulderEase}cm)
              </text>
            </g>

            {/* BUST / CHEST CONTOUR */}
            <g
              className="cursor-pointer group"
              onClick={() => onZoneClick?.('bust')}
            >
              <ellipse
                cx="170"
                cy="158"
                rx={44 * bustScale}
                ry="9"
                fill="none"
                stroke={highlightZone === 'bust' ? '#3B82F6' : getStatusColor(bustEase, 2, 7)}
                strokeWidth={highlightZone === 'bust' ? '2.5' : '2'}
                strokeDasharray="4 2"
              />
              <circle
                cx={170 + 44 * bustScale}
                cy="158"
                r="5"
                fill={getStatusColor(bustEase, 2, 7)}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x="248"
                y="162"
                fill="#19191C"
                fontSize="10"
                fontWeight="600"
                className="font-mono tracking-tight"
              >
                BUST: {measurements.bust}cm ({bustEase >= 0 ? `+${bustEase}` : bustEase}cm)
              </text>
            </g>

            {/* WAIST CONTOUR */}
            <g
              className="cursor-pointer group"
              onClick={() => onZoneClick?.('waist')}
            >
              <ellipse
                cx="170"
                cy="222"
                rx={32 * waistScale}
                ry="8"
                fill="none"
                stroke={highlightZone === 'waist' ? '#3B82F6' : getStatusColor(waistEase, 2, 6)}
                strokeWidth={highlightZone === 'waist' ? '2.5' : '2'}
                strokeDasharray="4 2"
              />
              <circle
                cx={170 - 32 * waistScale}
                cy="222"
                r="5"
                fill={getStatusColor(waistEase, 2, 6)}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x="32"
                y="226"
                fill="#19191C"
                fontSize="10"
                fontWeight="600"
                className="font-mono tracking-tight"
              >
                WAIST: {measurements.waist}cm ({waistEase >= 0 ? `+${waistEase}` : waistEase}cm)
              </text>
            </g>

            {/* HIPS CONTOUR */}
            <g
              className="cursor-pointer group"
              onClick={() => onZoneClick?.('hips')}
            >
              <ellipse
                cx="170"
                cy="295"
                rx={46 * hipsScale}
                ry="10"
                fill="none"
                stroke={highlightZone === 'hips' ? '#3B82F6' : getStatusColor(hipsEase, 3, 8)}
                strokeWidth={highlightZone === 'hips' ? '2.5' : '2'}
                strokeDasharray="4 2"
              />
              <circle
                cx={170 + 46 * hipsScale}
                cy="295"
                r="5"
                fill={getStatusColor(hipsEase, 3, 8)}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x="248"
                y="299"
                fill="#19191C"
                fontSize="10"
                fontWeight="600"
                className="font-mono tracking-tight"
              >
                HIPS: {measurements.hips}cm ({hipsEase >= 0 ? `+${hipsEase}` : hipsEase}cm)
              </text>
            </g>

            {/* INSEAM LINE */}
            <g
              className="cursor-pointer group"
              onClick={() => onZoneClick?.('inseam')}
            >
              <line
                x1="170"
                y1="340"
                x2="170"
                y2="590"
                stroke={highlightZone === 'inseam' ? '#3B82F6' : '#78716C'}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x="176"
                y="460"
                fill="#19191C"
                fontSize="10"
                fontWeight="600"
                className="font-mono tracking-tight"
              >
                INSEAM: {measurements.inseam}cm
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
