import React, { useState } from 'react';
import { BodyMeasurements, BodyShape, FitType, GarmentColor, Product } from '../types/fashion';
import { evaluateGarmentFit } from '../utils/fitEngine';
import { MannequinVisualizer } from './MannequinVisualizer';
import { GarmentSilhouette } from './GarmentSilhouette';
import { Sliders, Check, ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Camera, RotateCcw, AlertTriangle } from 'lucide-react';

interface FittingRoomProps {
  products: Product[];
  measurements: BodyMeasurements;
  setMeasurements: React.Dispatch<React.SetStateAction<BodyMeasurements>>;
  selectedProduct?: Product;
  onAddToCart: (product: Product, size: string, color: GarmentColor) => void;
  onNavigateToStudio: () => void;
}

export const FittingRoom: React.FC<FittingRoomProps> = ({
  products,
  measurements,
  setMeasurements,
  selectedProduct: initialSelectedProduct,
  onAddToCart,
  onNavigateToStudio,
}) => {
  const [activeProduct, setActiveProduct] = useState<Product>(
    initialSelectedProduct || products[0]
  );
  const [testedSize, setTestedSize] = useState<string>('M');
  const [highlightZone, setHighlightZone] = useState<'shoulder' | 'bust' | 'waist' | 'hips' | 'inseam' | null>(null);
  const [selectedColor, setSelectedColor] = useState<GarmentColor>(
    activeProduct.colors[0]
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);

  // Evaluate fit in real time
  const fitEvaluation = evaluateGarmentFit(activeProduct, testedSize, measurements);

  // Measurements unit conversion helper
  const isCm = measurements.unit === 'cm';
  const displayVal = (cmVal: number) => {
    return isCm ? `${cmVal} cm` : `${(cmVal / 2.54).toFixed(1)} in`;
  };

  const handleMeasurementChange = (key: keyof BodyMeasurements, val: number) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleUnitToggle = (unit: 'cm' | 'in') => {
    setMeasurements(prev => ({ ...prev, unit }));
  };

  // Body Profile Presets
  const handleApplyPreset = (preset: 'standard' | 'hourglass' | 'tall-athletic' | 'petite') => {
    if (preset === 'standard') {
      setMeasurements(prev => ({
        ...prev,
        height: 170,
        bust: 90,
        waist: 72,
        hips: 96,
        shoulderWidth: 40,
        inseam: 78,
        bodyShape: 'rectangle',
      }));
    } else if (preset === 'hourglass') {
      setMeasurements(prev => ({
        ...prev,
        height: 168,
        bust: 94,
        waist: 68,
        hips: 102,
        shoulderWidth: 41,
        inseam: 77,
        bodyShape: 'hourglass',
      }));
    } else if (preset === 'tall-athletic') {
      setMeasurements(prev => ({
        ...prev,
        height: 179,
        bust: 92,
        waist: 74,
        hips: 96,
        shoulderWidth: 44,
        inseam: 84,
        bodyShape: 'athletic',
      }));
    } else {
      setMeasurements(prev => ({
        ...prev,
        height: 160,
        bust: 85,
        waist: 65,
        hips: 90,
        shoulderWidth: 37,
        inseam: 72,
        bodyShape: 'pear',
      }));
    }
  };

  // Simulated 3D Scan simulation
  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep(1);
    setTimeout(() => setScanStep(2), 1000);
    setTimeout(() => setScanStep(3), 2000);
    setTimeout(() => {
      setIsScanning(false);
      setScanStep(0);
      // Auto calibrate slightly
      setMeasurements(prev => ({
        ...prev,
        bust: 91,
        waist: 71,
        hips: 97,
      }));
    }, 2800);
  };

  const chart = activeProduct.measurements[testedSize] || activeProduct.measurements['M'] || {};

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-5 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Precision Biometrics & Sizing</span>
          <h1 className="text-3xl sm:text-4xl font-editorial font-medium text-stone-900 mt-1">
            Virtual Fitting Room
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Calibrate your exact anatomical measurements to test garment ease, fabric tension, and personalized size accuracy before ordering.
          </p>
        </div>

        {/* Scan & Calibration Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-70"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>{isScanning ? `Calibrating Scan (${scanStep}/3)...` : 'Simulate 3D Body Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio: Measurements (Left 4 cols) | Mannequin Heatmap (Center 4 cols) | Fit Verdict & Size Selector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Body Measurement Controls (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-stone-800" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                Body Measurements
              </h3>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded text-xs">
              <button
                onClick={() => handleUnitToggle('cm')}
                className={`px-2.5 py-1 rounded transition-colors font-medium cursor-pointer ${
                  isCm ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => handleUnitToggle('in')}
                className={`px-2.5 py-1 rounded transition-colors font-medium cursor-pointer ${
                  !isCm ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                IN
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] text-stone-400 font-medium">Quick Profiles:</span>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <button
                onClick={() => handleApplyPreset('standard')}
                className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors cursor-pointer"
              >
                Standard M
              </button>
              <button
                onClick={() => handleApplyPreset('hourglass')}
                className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors cursor-pointer"
              >
                Hourglass
              </button>
              <button
                onClick={() => handleApplyPreset('tall-athletic')}
                className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors cursor-pointer"
              >
                Tall Athletic
              </button>
              <button
                onClick={() => handleApplyPreset('petite')}
                className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors cursor-pointer"
              >
                Petite
              </button>
            </div>
          </div>

          {/* Measurement Sliders */}
          <div className="space-y-4">
            {/* Height */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Height</span>
                <span className="font-mono font-semibold text-stone-900">{displayVal(measurements.height)}</span>
              </div>
              <input
                type="range"
                min="145"
                max="200"
                value={measurements.height}
                onChange={e => handleMeasurementChange('height', Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>

            {/* Bust / Chest */}
            <div className={highlightZone === 'bust' ? 'p-2 bg-blue-50/60 rounded-lg -mx-2 transition-colors' : ''}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Chest / Bust Circumference</span>
                <span className="font-mono font-semibold text-stone-900">{displayVal(measurements.bust)}</span>
              </div>
              <input
                type="range"
                min="75"
                max="125"
                value={measurements.bust}
                onChange={e => handleMeasurementChange('bust', Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>

            {/* Natural Waist */}
            <div className={highlightZone === 'waist' ? 'p-2 bg-blue-50/60 rounded-lg -mx-2 transition-colors' : ''}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Natural Waist</span>
                <span className="font-mono font-semibold text-stone-900">{displayVal(measurements.waist)}</span>
              </div>
              <input
                type="range"
                min="55"
                max="115"
                value={measurements.waist}
                onChange={e => handleMeasurementChange('waist', Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>

            {/* Hips */}
            <div className={highlightZone === 'hips' ? 'p-2 bg-blue-50/60 rounded-lg -mx-2 transition-colors' : ''}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Hips (Fullest point)</span>
                <span className="font-mono font-semibold text-stone-900">{displayVal(measurements.hips)}</span>
              </div>
              <input
                type="range"
                min="78"
                max="130"
                value={measurements.hips}
                onChange={e => handleMeasurementChange('hips', Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>

            {/* Shoulder Width */}
            <div className={highlightZone === 'shoulder' ? 'p-2 bg-blue-50/60 rounded-lg -mx-2 transition-colors' : ''}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Shoulder Span</span>
                <span className="font-mono font-semibold text-stone-900">{displayVal(measurements.shoulderWidth)}</span>
              </div>
              <input
                type="range"
                min="34"
                max="52"
                value={measurements.shoulderWidth}
                onChange={e => handleMeasurementChange('shoulderWidth', Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>

            {/* Inseam */}
            <div className={highlightZone === 'inseam' ? 'p-2 bg-blue-50/60 rounded-lg -mx-2 transition-colors' : ''}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Inseam (Leg Length)</span>
                <span className="font-mono font-semibold text-stone-900">{displayVal(measurements.inseam)}</span>
              </div>
              <input
                type="range"
                min="65"
                max="95"
                value={measurements.inseam}
                onChange={e => handleMeasurementChange('inseam', Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Fit Style Preference */}
          <div className="border-t border-stone-100 pt-4">
            <span className="text-[11px] text-stone-500 font-medium uppercase tracking-wider block mb-2">
              Preferred Fit Feel:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['slim', 'tailored', 'relaxed', 'oversized'] as FitType[]).map(fit => (
                <button
                  key={fit}
                  onClick={() => setMeasurements(prev => ({ ...prev, preferredFit: fit }))}
                  className={`py-1.5 px-3 rounded-lg border text-center capitalize transition-colors cursor-pointer ${
                    measurements.preferredFit === fit
                      ? 'border-stone-900 bg-stone-900 text-white font-medium'
                      : 'border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: 3D Heatmap Mannequin View (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 flex flex-col items-center justify-between shadow-xs relative min-h-[560px]">
          {/* Header on Mannequin */}
          <div className="w-full flex items-center justify-between border-b border-stone-200/80 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Interactive Fit Heatmap
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              Click any line to inspect
            </span>
          </div>

          {/* Center Mannequin */}
          <div className="w-full flex-1 flex items-center justify-center my-2">
            <MannequinVisualizer
              tryOnState={{
                outerwear: activeProduct.category === 'outerwear' ? activeProduct : null,
                tops: activeProduct.category === 'tops' ? activeProduct : null,
                bottoms: activeProduct.category === 'bottoms' ? activeProduct : null,
                footwear: activeProduct.category === 'footwear' ? activeProduct : null,
                accessories: activeProduct.category === 'accessories' ? activeProduct : null,
                selectedColors: { [activeProduct.id]: selectedColor },
              }}
              measurements={measurements}
              isFittingRoomMode={true}
              highlightZone={highlightZone}
              onZoneClick={zone => setHighlightZone(prev => prev === zone ? null : zone)}
              testedProduct={activeProduct}
              testedSize={testedSize}
            />
          </div>

          {/* Color-Coded Tension Legend */}
          <div className="w-full border-t border-stone-200/80 pt-3 flex items-center justify-around text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Ideal Ease (+3 to +6cm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Snug / Relaxed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Too Tight / Loose</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Garment Inspection & Size Verdict (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Active Product Selector Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-16 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                <GarmentSilhouette product={activeProduct} color={selectedColor} className="w-full h-full p-1" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium">
                  Currently Testing
                </span>
                <h4 className="text-sm font-semibold text-stone-900 truncate">
                  {activeProduct.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono font-medium text-stone-900">${activeProduct.price}</span>
                  <span className="text-xs text-stone-500">· {activeProduct.fabric.split(',')[0]}</span>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mt-2">
                  {activeProduct.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col)}
                      className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                        selectedColor.name === col.name ? 'ring-2 ring-offset-1 ring-stone-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: col.hex, borderColor: col.border || '#888' }}
                      title={col.name}
                    />
                  ))}
                  <span className="text-[11px] text-stone-600 truncate ml-1">{selectedColor.name}</span>
                </div>
              </div>
            </div>

            {/* Quick Switch Garment Selector */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <label className="text-[11px] text-stone-500 font-medium block mb-1.5">
                Switch Test Garment:
              </label>
              <select
                value={activeProduct.id}
                onChange={e => {
                  const found = products.find(p => p.id === e.target.value);
                  if (found) {
                    setActiveProduct(found);
                    setSelectedColor(found.colors[0]);
                  }
                }}
                className="w-full text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-stone-900"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.category.toUpperCase()}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Size Evaluator & Verdict Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                Size Evaluation Matrix
              </h4>
              <span className={`text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                fitEvaluation.status === 'perfect' ? 'bg-emerald-50 text-emerald-800' :
                fitEvaluation.status === 'caution' ? 'bg-amber-50 text-amber-800' :
                'bg-red-50 text-red-800'
              }`}>
                {fitEvaluation.confidenceScore}% Confidence
              </span>
            </div>

            {/* Size Switcher Buttons */}
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {activeProduct.sizes.map(size => {
                const isSelected = testedSize === size;
                const isBest = fitEvaluation.recommendedSize === size;

                return (
                  <button
                    key={size}
                    onClick={() => setTestedSize(size)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all relative cursor-pointer border ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span>{size}</span>
                    {isBest && (
                      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Optimal Size Recommendation" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tension Zone Detailed Breakdown */}
            <div className="space-y-2 border-t border-stone-100 pt-3 text-xs">
              <div className="flex items-center justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${fitEvaluation.sizeDelta.bustDelta >= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>Chest / Bust Ease</span>
                </span>
                <span className="font-mono font-medium">
                  {fitEvaluation.sizeDelta.bustDelta >= 0 ? `+${fitEvaluation.sizeDelta.bustDelta}` : fitEvaluation.sizeDelta.bustDelta} cm
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${fitEvaluation.sizeDelta.waistDelta >= 2 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span>Waist Ease</span>
                </span>
                <span className="font-mono font-medium">
                  {fitEvaluation.sizeDelta.waistDelta >= 0 ? `+${fitEvaluation.sizeDelta.waistDelta}` : fitEvaluation.sizeDelta.waistDelta} cm
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${fitEvaluation.sizeDelta.hipsDelta >= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>Hips Ease</span>
                </span>
                <span className="font-mono font-medium">
                  {fitEvaluation.sizeDelta.hipsDelta >= 0 ? `+${fitEvaluation.sizeDelta.hipsDelta}` : fitEvaluation.sizeDelta.hipsDelta} cm
                </span>
              </div>

              {chart.shoulder && (
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Shoulder Seam Span</span>
                  </span>
                  <span className="font-mono font-medium">
                    {chart.shoulder} cm (vs {measurements.shoulderWidth} cm)
                  </span>
                </div>
              )}
            </div>

            {/* AI Fit Verdict & Advice */}
            <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">
                    {fitEvaluation.critique}
                  </p>
                  {fitEvaluation.adjustmentAdvice && (
                    <p className="text-[11px] text-amber-800 mt-1 font-semibold">
                      Recommendation: {fitEvaluation.adjustmentAdvice}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Add Evaluated Size to Cart */}
            <div className="mt-4 pt-3 flex flex-col gap-2">
              <button
                onClick={() => onAddToCart(activeProduct, testedSize, selectedColor)}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Size {testedSize} to Cart (${activeProduct.price})</span>
              </button>

              <button
                onClick={onNavigateToStudio}
                className="w-full py-2 px-4 border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>Preview Layered in Try-On Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
