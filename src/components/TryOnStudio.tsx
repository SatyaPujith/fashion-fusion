import React, { useState } from 'react';
import { Product, GarmentColor, BodyMeasurements, TryOnSelection } from '../types/fashion';
import { GarmentSilhouette } from './GarmentSilhouette';
import { 
  Upload, Check, Sparkles, ShoppingBag, AlertCircle, 
  Loader2, Trash2, ArrowRight, User
} from 'lucide-react';
import { createYouCamAPIService, TryOnResult } from '../services/youCamAPI';

interface TryOnStudioProps {
  products: Product[];
  measurements: BodyMeasurements;
  tryOnState: TryOnSelection;
  setTryOnState: (state: TryOnSelection) => void;
  onAddToCart: (product: Product, size: string, color: GarmentColor) => void;
  onNavigateToFittingRoom: (product?: Product) => void;
  onOpenCart: () => void;
}

interface SelectedProduct {
  category: 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'shoes' | 'bags' | 'scarves' | 'hats' | 'jewelry' | 'accessories';
  product: Product;
  color: GarmentColor;
}

type Step = 'upload-photo' | 'select-gender' | 'select-products' | 'results';

export const TryOnStudio: React.FC<TryOnStudioProps> = ({
  products,
  onAddToCart,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('upload-photo');
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'men' | 'women' | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, SelectedProduct>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [individualResults, setIndividualResults] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const youCamService = createYouCamAPIService();

  // Filter products by gender and category
  const genderFilteredProducts = selectedGender 
    ? products.filter(p => p.gender === selectedGender || p.gender === 'unisex')
    : products;

  const topProducts = genderFilteredProducts.filter(p => p.category === 'tops');
  const bottomProducts = genderFilteredProducts.filter(p => p.category === 'bottoms');
  const outerwearProducts = genderFilteredProducts.filter(p => p.category === 'outerwear');
  const dressProducts = genderFilteredProducts.filter(p => p.category === 'dresses');
  const shoeProducts = genderFilteredProducts.filter(p => p.category === 'shoes' || p.category === 'footwear');
  const bagProducts = genderFilteredProducts.filter(p => p.category === 'bags');
  const scarfProducts = genderFilteredProducts.filter(p => p.category === 'scarves');
  const hatProducts = genderFilteredProducts.filter(p => p.category === 'hats');
  const jewelryProducts = genderFilteredProducts.filter(p => p.category === 'jewelry');
  const accessoryProducts = genderFilteredProducts.filter(p => p.category === 'accessories');

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image too large. Please use an image under 10MB.');
        return;
      }

      setUserPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Select/deselect product
  const toggleProductSelection = (
    category: 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'shoes' | 'bags' | 'scarves' | 'hats' | 'jewelry' | 'accessories',
    product: Product
  ) => {
    const key = `${category}-${product.id}`;
    const newSelection = new Map(selectedProducts);

    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.set(key, {
        category,
        product,
        color: product.colors[0],
      });
    }

    setSelectedProducts(newSelection);
  };

  // Generate try-on results
  const handleGenerate = async () => {
    if (!userPhoto) {
      setError('Please upload a photo first');
      return;
    }

    if (selectedProducts.size === 0) {
      setError('Please select at least one product');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep('results');

    try {
      const individualResultsMap = new Map<string, string>();
      const selectedArray = Array.from(selectedProducts.values());

      for (let i = 0; i < selectedArray.length; i++) {
        const selected = selectedArray[i];
        setGenerationProgress(
          `Generating ${i + 1} of ${selectedArray.length}: ${selected.product.name}...`
        );

        const result = await youCamService.tryOnGarment(userPhoto, selected.product);

        if (result.success && result.resultImageUrl) {
          const key = `${selected.category}-${selected.product.id}`;
          individualResultsMap.set(key, result.resultImageUrl);
        }
      }

      setIndividualResults(individualResultsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate try-on images');
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  // Add all selected items to cart
  const handleAddAllToCart = () => {
    selectedProducts.forEach((selected) => {
      onAddToCart(selected.product, 'M', selected.color);
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#161619] text-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-stone-500/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-editorial font-normal tracking-tight text-white leading-tight mb-4">
            Virtual Try-On Studio
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto">
            See yourself in any outfit with AI-powered virtual try-on. Try individual items or create complete outfits.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Upload Photo */}
        {currentStep === 'upload-photo' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-editorial font-normal text-stone-900 mb-3">
                Step 1: Upload Your Photo
              </h2>
              <p className="text-stone-600">
                Use a clear full-body photo with good lighting for best results
              </p>
            </div>

            {userPhotoPreview ? (
              <div className="mb-8 text-center">
                <div className="relative inline-block">
                  <img
                    src={userPhotoPreview}
                    alt="User photo"
                    className="max-w-md w-full rounded-xl border-2 border-stone-200 shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setUserPhoto(null);
                      setUserPhotoPreview(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-stone-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-stone-700" />
                  </button>
                </div>

                <button
                  onClick={() => setCurrentStep('select-gender')}
                  className="mt-8 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <label className="block">
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-16 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <Upload className="w-16 h-16 text-stone-400" />
                      <div className="text-center">
                        <p className="text-xl font-semibold text-stone-900 mb-2">
                          Click to upload photo
                        </p>
                        <p className="text-stone-500">
                          JPG, PNG â€¢ Max 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Tips for Best Results
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Stand in the center with full body visible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Use good lighting and plain background</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Face the camera directly</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Gender */}
        {currentStep === 'select-gender' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-editorial font-normal text-stone-900 mb-3">
                Step 2: Select Your Gender
              </h2>
              <p className="text-stone-600">
                We'll show you products that match your style preferences
              </p>
            </div>

            {/* Gender Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => {
                  setSelectedGender('men');
                  setCurrentStep('select-products');
                }}
                className="group p-8 border-2 border-stone-200 hover:border-stone-900 rounded-xl transition-all hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 bg-stone-100 group-hover:bg-stone-900 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-10 h-10 text-stone-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-stone-900 mb-2">Men's Wear</h3>
                    <p className="text-stone-600">
                      Browse men's fashion collection
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedGender('women');
                  setCurrentStep('select-products');
                }}
                className="group p-8 border-2 border-stone-200 hover:border-stone-900 rounded-xl transition-all hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 bg-stone-100 group-hover:bg-stone-900 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-10 h-10 text-stone-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-stone-900 mb-2">Women's Wear</h3>
                    <p className="text-stone-600">
                      Browse women's fashion collection
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => setCurrentStep('upload-photo')}
                className="px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
              >
                Back to Photo Upload
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Products */}
        {currentStep === 'select-products' && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-editorial font-normal text-stone-900 mb-2">
                  Step 3: Select Products to Try On
                </h2>
                <p className="text-stone-600">
                  Browsing: <span className="font-semibold capitalize">{selectedGender}'s Collection</span>
                </p>
              </div>
              {selectedProducts.size > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-stone-700">
                    {selectedProducts.size} selected
                  </span>
                  <button
                    onClick={() => setSelectedProducts(new Map())}
                    className="text-sm text-stone-600 hover:text-stone-900 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Product Grids */}
            {[
              { title: 'Tops & Shirts', products: topProducts, category: 'tops' as const },
              { title: 'Bottoms', products: bottomProducts, category: 'bottoms' as const },
              { title: 'Outerwear', products: outerwearProducts, category: 'outerwear' as const },
              { title: 'Dresses', products: dressProducts, category: 'dresses' as const },
              { title: 'Shoes', products: shoeProducts, category: 'shoes' as const },
              { title: 'Bags', products: bagProducts, category: 'bags' as const },
              { title: 'Scarves', products: scarfProducts, category: 'scarves' as const },
              { title: 'Hats', products: hatProducts, category: 'hats' as const },
              { title: 'Jewelry', products: jewelryProducts, category: 'jewelry' as const },
              { title: 'Accessories', products: accessoryProducts, category: 'accessories' as const },
            ].map(({ title, products: categoryProducts, category }) => {
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <h3 className="text-xl font-semibold text-stone-900 mb-6">{title}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {/* Show ALL products, not limited to 10 */}
                    {categoryProducts.map((product) => {
                      const key = `${category}-${product.id}`;
                      const isSelected = selectedProducts.has(key);

                      return (
                        <div
                          key={product.id}
                          onClick={() => toggleProductSelection(category, product)}
                          className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                            isSelected
                              ? 'border-stone-900 shadow-xl'
                              : 'border-stone-200 hover:border-stone-400 hover:shadow-lg'
                          }`}
                        >
                          <div className="aspect-3/4 bg-white">
                            <GarmentSilhouette
                              product={product}
                              color={product.colors[0]}
                              className="w-full h-full"
                            />
                          </div>

                          <div className="p-3 bg-white border-t border-stone-100">
                            <p className="font-semibold text-sm text-stone-900 line-clamp-2">
                              {product.name}
                            </p>
                            <p className="text-sm text-stone-600 mt-1">${product.price}</p>
                          </div>

                          {isSelected && (
                            <div className="absolute top-3 right-3 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="sticky bottom-0 py-6 bg-white border-t border-stone-200">
              <div className="flex gap-4 max-w-4xl mx-auto">
                <button
                  onClick={() => setCurrentStep('select-gender')}
                  className="px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                {selectedProducts.size > 0 && (
                  <button
                    onClick={handleGenerate}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Try-On ({selectedProducts.size} items)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {currentStep === 'results' && (
          <div>
            {isGenerating ? (
              <div className="text-center py-16">
                <Loader2 className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-editorial font-normal text-stone-900 mb-2">
                  Creating Your Virtual Try-On...
                </h2>
                <p className="text-stone-600">{generationProgress}</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-editorial font-normal text-stone-900 mb-2">
                    Your Virtual Try-On Results
                  </h2>
                  <p className="text-stone-600">
                    See how these items look on you!
                  </p>
                </div>

                {/* Results */}
                {individualResults.size > 0 && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-stone-900 mb-6">Your Try-On Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{Array.from(selectedProducts.entries()).map(([key, selected]) => {
                        const resultUrl = individualResults.get(key);

                        return (
                          <div key={key} className="bg-white border-2 border-stone-200 rounded-xl overflow-hidden shadow-lg">
                            <div className="aspect-3/4 bg-stone-100 relative">
                              {resultUrl ? (
                                <img
                                  src={resultUrl}
                                  alt={`Try-on: ${selected.product.name}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center text-stone-400">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm">Failed to generate</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="p-5">
                              <h3 className="font-semibold text-stone-900 mb-1 text-lg">
                                {selected.product.name}
                              </h3>
                              <p className="text-stone-600 mb-4">${selected.product.price}</p>

                              <button
                                onClick={() => onAddToCart(selected.product, 'M', selected.color)}
                                disabled={!resultUrl}
                                className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 max-w-4xl mx-auto">
                  <button
                    onClick={() => {
                      setCurrentStep('select-products');
                      setIndividualResults(new Map());
                    }}
                    className="flex-1 py-4 border-2 border-stone-900 text-stone-900 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Try More Products
                  </button>
                  <button
                    onClick={handleAddAllToCart}
                    className="flex-1 py-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add All to Cart
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
