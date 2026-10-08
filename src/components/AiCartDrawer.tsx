import React, { useState } from 'react';
import { BodyMeasurements, CartItem, Product } from '../types/fashion';
import { evaluateGarmentFit, evaluateOutfitHarmony } from '../utils/fitEngine';
import { GarmentSilhouette } from './GarmentSilhouette';
import { X, Sparkles, Check, AlertTriangle, ArrowRight, Trash2, ShieldCheck, ChevronRight, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface AiCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  measurements: BodyMeasurements;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onUpdateSize: (cartItemId: string, newSize: string) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onNavigateToFittingRoom: (product: Product) => void;
}

export const AiCartDrawer: React.FC<AiCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  measurements,
  onUpdateQuantity,
  onUpdateSize,
  onRemoveItem,
  onClearCart,
  onNavigateToFittingRoom,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [shippingDetails, setShippingDetails] = useState({
    name: 'Satyapoojith',
    email: 'satyapoojith2@gmail.com',
    address: '742 Evergreen Terrace, Suite 4B',
    city: 'San Francisco',
    postalCode: '94107',
    paymentMethod: 'card',
  });

  if (!isOpen) return null;

  // Evaluate fit for each item in the cart against current measurements
  const auditedItems = cart.map(item => {
    const fitEval = evaluateGarmentFit(item.product, item.selectedSize, measurements);
    return {
      ...item,
      fitEvaluation: fitEval,
    };
  });

  // Calculate overall cart fit status
  const hasFitWarnings = auditedItems.some(i => i.fitEvaluation?.status !== 'perfect');
  const warningCount = auditedItems.filter(i => i.fitEvaluation?.status !== 'perfect').length;

  // Cart outfit harmony
  const cartHarmony = evaluateOutfitHarmony(cart.map(i => i.product));

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;

  const handleFixAllSizes = () => {
    auditedItems.forEach(item => {
      if (item.fitEvaluation && item.fitEvaluation.recommendedSize !== item.selectedSize) {
        onUpdateSize(item.id, item.fitEvaluation.recommendedSize);
      }
    });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
  };

  const handleResetCheckout = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Fit-Verified Shopping Bag
              </h2>
              <span className="text-xs text-stone-500">
                {cart.length} {cart.length === 1 ? 'garment' : 'garments'} · Real-time AI Fit Audit
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content View Based on Step */}
        {checkoutStep === 'cart' && (
          <>
            {/* Scrollable Items & AI Insights Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-editorial text-stone-800">Your Fit Bag is Empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                    Select pieces from the collection or try them on together in the studio to see real-time sizing advice.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 py-2 px-4 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Browse Fashion Fusion
                  </button>
                </div>
              ) : (
                <>
                  {/* AI Cart Sizing Auditor Banner */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    hasFitWarnings
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-emerald-50/70 border-emerald-200'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${
                          hasFitWarnings ? 'text-amber-700' : 'text-emerald-700'
                        }`} />
                        <div>
                          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                            {hasFitWarnings
                              ? `AI Fit Alert: ${warningCount} Size Variance Detected`
                              : 'Biometric Fit Verified: 100% Sizing Match'}
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            {hasFitWarnings
                              ? `Based on your profile (${measurements.bust}cm bust, ${measurements.waist}cm waist), some selected sizes have ease conflicts that could cause constriction or excess pooling.`
                              : `Every piece in your bag aligns with your exact body dimensions and selected '${measurements.preferredFit}' drape preference.`}
                          </p>
                        </div>
                      </div>

                      {hasFitWarnings && (
                        <button
                          onClick={handleFixAllSizes}
                          className="text-xs font-semibold bg-stone-900 text-white py-1.5 px-3 rounded-lg hover:bg-stone-800 whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-xs"
                        >
                          Auto-Correct Sizes
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Item Harmony Preview */}
                  {cart.length >= 2 && (
                    <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                          Outfit Harmony in Bag
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          {cartHarmony.score}% Cohesion
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-editorial italic text-sm">
                        "{cartHarmony.verdict}"
                      </p>
                    </div>
                  )}

                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {auditedItems.map(item => {
                      const fit = item.fitEvaluation!;
                      const isConflict = fit.status !== 'perfect';
                      const canAutoCorrect = fit.recommendedSize !== item.selectedSize;

                      return (
                        <div
                          key={item.id}
                          className={`border rounded-xl p-4 transition-all bg-white ${
                            isConflict ? 'border-amber-300 ring-1 ring-amber-100' : 'border-stone-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Product Silhouette / Image */}
                            <div className="w-16 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                              <GarmentSilhouette
                                product={item.product}
                                color={item.selectedColor}
                                className="w-full h-full p-1"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium">
                                    {item.product.brand}
                                  </span>
                                  <h4 className="text-sm font-semibold text-stone-900 truncate">
                                    {item.product.name}
                                  </h4>
                                </div>
                                <span className="text-sm font-mono font-medium text-stone-900 tabular-nums">
                                  ${item.product.price * item.quantity}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                                <span>Color: <strong className="text-stone-800">{item.selectedColor.name}</strong></span>
                                <span>·</span>
                                <div className="flex items-center gap-1">
                                  <span>Size:</span>
                                  <select
                                    value={item.selectedSize}
                                    onChange={e => onUpdateSize(item.id, e.target.value)}
                                    className="bg-stone-100 font-semibold text-stone-900 rounded px-1.5 py-0.5 text-xs border border-stone-200 focus:outline-none"
                                  >
                                    {item.product.sizes.map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* AI Item Fit Badge */}
                              <div className={`mt-2 p-2 rounded-lg text-xs flex items-start gap-2 ${
                                fit.status === 'perfect'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-900'
                              }`}>
                                {fit.status === 'perfect' ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                )}

                                <div className="flex-1">
                                  <p className="font-medium text-[11px] leading-tight">
                                    {fit.critique}
                                  </p>
                                  {canAutoCorrect && (
                                    <button
                                      onClick={() => onUpdateSize(item.id, fit.recommendedSize)}
                                      className="mt-1 text-[11px] font-semibold text-amber-900 underline hover:text-amber-950 cursor-pointer"
                                    >
                                      Switch to recommended size {fit.recommendedSize} →
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Stepper & Actions */}
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-stone-500">Qty:</span>
                                  <div className="flex items-center border border-stone-200 rounded text-xs">
                                    <button
                                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                      className="px-2 py-0.5 hover:bg-stone-100 text-stone-700 cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="px-2 py-0.5 font-semibold text-stone-900">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                      className="px-2 py-0.5 hover:bg-stone-100 text-stone-700 cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => {
                                      onClose();
                                      onNavigateToFittingRoom(item.product);
                                    }}
                                    className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                                  >
                                    Inspect in Fitting Room
                                  </button>
                                  <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Sticky Checkout Bar */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-[#FAF9F6] space-y-3">
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-900 tabular-nums">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fit Protection Shipping</span>
                    <span className="font-mono text-stone-900 tabular-nums">
                      {shipping === 0 ? 'FREE' : `$${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Estimated Total</span>
                    <span className="font-mono tabular-nums">${total}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fashion Fusion Fit Guarantee: Zero-cost size exchanges.</span>
                </div>

                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed with Fit-Verified Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Checkout Details Step */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                  Shipping & Fit Profile Confirmation
                </h3>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  ← Back to Bag
                </button>
              </div>

              <div>
                <label className="text-xs text-stone-600 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingDetails.name}
                  onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-xs text-stone-600 font-medium block mb-1">Email for Digital Fit Receipt</label>
                <input
                  type="email"
                  required
                  value={shippingDetails.email}
                  onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-xs text-stone-600 font-medium block mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={shippingDetails.address}
                  onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-600 font-medium block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.city}
                    onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 font-medium block mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.postalCode}
                    onChange={e => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Payment Method Option */}
              <div className="pt-2">
                <label className="text-xs text-stone-600 font-medium block mb-2">Payment Preference</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className={`p-3 border rounded-lg flex items-center gap-2 cursor-pointer ${
                    shippingDetails.paymentMethod === 'card' ? 'border-stone-900 bg-stone-50 font-semibold' : 'border-stone-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={shippingDetails.paymentMethod === 'card'}
                      onChange={() => setShippingDetails({ ...shippingDetails, paymentMethod: 'card' })}
                      className="accent-stone-900"
                    />
                    <span>Card / Apple Pay</span>
                  </label>

                  <label className={`p-3 border rounded-lg flex items-center gap-2 cursor-pointer ${
                    shippingDetails.paymentMethod === 'cod' ? 'border-stone-900 bg-stone-50 font-semibold' : 'border-stone-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={shippingDetails.paymentMethod === 'cod'}
                      onChange={() => setShippingDetails({ ...shippingDetails, paymentMethod: 'cod' })}
                      className="accent-stone-900"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-stone-900">
                <span>Total Amount Due</span>
                <span className="font-mono tabular-nums">${total}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Complete Purchase (${total})</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </form>
        )}

        {/* Order Success Step */}
        {checkoutStep === 'success' && (
          <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Order #FF-2026-9842 Confirmed
            </span>
            <h3 className="text-2xl font-editorial font-medium text-stone-900 mt-1">
              Your Tailored Capsule is Preparing
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mt-2 leading-relaxed">
              Every garment has been logged with your {measurements.bust}cm bust & {measurements.waist}cm waist profile for quality check prior to dispatch.
            </p>

            {/* Digital Fit Card */}
            <div className="mt-6 p-4 bg-[#FAF9F6] border border-stone-200 rounded-xl w-full max-w-sm text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200/80 pb-2">
                <span className="font-semibold text-stone-800">Calibrated Fit Sheet</span>
                <span className="text-emerald-700 font-medium">Guaranteed Accuracy</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Recipient:</span>
                <span className="font-medium text-stone-900">{shippingDetails.name}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Items Ordered:</span>
                <span className="font-medium text-stone-900">{cart.length} pieces</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Paid:</span>
                <span className="font-mono font-medium text-stone-900">${total}</span>
              </div>
            </div>

            <button
              onClick={handleResetCheckout}
              className="mt-8 py-2.5 px-6 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Continue Exploring Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
