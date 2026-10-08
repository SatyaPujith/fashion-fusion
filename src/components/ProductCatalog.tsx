import React, { useState } from 'react';
import { BodyMeasurements, GarmentColor, Product, ProductCategory, Gender } from '../types/fashion';
import { evaluateGarmentFit } from '../utils/fitEngine';
import { GarmentSilhouette } from './GarmentSilhouette';
import { Search, SlidersHorizontal, Sparkles, ShoppingBag, Eye, X, Check, ArrowRight, ShieldCheck, User, Users } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  measurements: BodyMeasurements;
  onAddToCart: (product: Product, size: string, color: GarmentColor) => void;
  onTryInStudio: (product: Product) => void;
  onCheckFitInRoom: (product: Product) => void;
  onOpenFittingRoom: () => void;
  onOpenTryOnStudio: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  measurements,
  onAddToCart,
  onTryInStudio,
  onCheckFitInRoom,
  onOpenFittingRoom,
  onOpenTryOnStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [modalSize, setModalSize] = useState<string>('M');
  const [modalColor, setModalColor] = useState<GarmentColor | null>(null);

  // Gender sections
  const genderSections = [
    { id: 'all' as const, label: 'All Collections', icon: Users },
    { id: 'women' as Gender, label: 'Women\'s Wear', icon: User },
    { id: 'men' as Gender, label: 'Men\'s Wear', icon: User },
  ];

  // Category filters
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'bags', label: 'Bags' },
    { id: 'scarves', label: 'Scarves' },
    { id: 'hats', label: 'Hats' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'footwear', label: 'Footwear' },
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === 'all' || product.gender === selectedGender || product.gender === 'unisex';
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesGender && matchesCategory;
  });

  // Organize products by gender and category
  const menProducts = products.filter(p => p.gender === 'men');
  const womenProducts = products.filter(p => p.gender === 'women');

  const groupByCategory = (prods: Product[]) => {
    const groups: Record<ProductCategory, Product[]> = {
      tops: [],
      bottoms: [],
      outerwear: [],
      footwear: [],
      accessories: [],
      dresses: [],
      shoes: [],
      bags: [],
      scarves: [],
      hats: [],
      jewelry: [],
    };
    prods.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  };

  const handleOpenDetail = (product: Product) => {
    setDetailProduct(product);
    const fit = evaluateGarmentFit(product, 'M', measurements);
    setModalSize(fit.recommendedSize);
    setModalColor(product.colors[0]);
  };

  const handleAddToCart = () => {
    if (detailProduct && modalColor) {
      onAddToCart(detailProduct, modalSize, modalColor);
      setDetailProduct(null);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const defaultColor = product.colors[0];
    const fit = evaluateGarmentFit(product, 'M', measurements);

    return (
      <div
        onClick={() => handleOpenDetail(product)}
        className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-3/4 bg-[#FAF8F5] overflow-hidden">
          <GarmentSilhouette
            product={product}
            color={defaultColor}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTryInStudio(product);
                }}
                className="flex-1 py-2 px-3 bg-white text-stone-900 text-xs font-semibold rounded-lg hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3 h-3" />
                Try On
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckFitInRoom(product);
                }}
                className="px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fit Badge */}
          {fit.status === 'perfect' && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              Perfect Fit
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm line-clamp-2 group-hover:text-stone-700">
                {product.name}
              </h3>
              <p className="text-xs text-stone-500 uppercase tracking-wide mt-1">{product.brand}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-stone-900">${product.price}</p>
              {product.originalPrice && (
                <p className="text-xs text-stone-400 line-through">${product.originalPrice}</p>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 4).map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border-2 border-stone-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-stone-500 ml-1">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-[#161619] text-[#FAF8F5] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-stone-500/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-4">
            <span>Collection 2026</span>
            <span>·</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI-Powered Sizing
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-editorial font-normal tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Where Couture Meets Perfect Fit
          </h1>

          <p className="mt-4 text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Discover fashion that fits you perfectly. Our AI sizing engine analyzes your body profile for precise recommendations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenTryOnStudio}
              className="py-3 px-8 bg-white hover:bg-stone-100 text-stone-900 text-sm font-semibold rounded-lg transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Try-On Studio
            </button>
            <button
              onClick={onOpenFittingRoom}
              className="py-3 px-8 border-2 border-stone-700 hover:border-stone-400 hover:bg-stone-800/40 text-stone-200 text-sm font-medium rounded-lg transition-all"
            >
              Fitting Room
            </button>
          </div>
        </div>
      </section>

      {/* Gender Navigation & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Gender Tabs */}
          <div className="flex items-center gap-2">
            {genderSections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedGender(section.id);
                    setSelectedCategory('all');
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    selectedGender === section.id
                      ? 'bg-stone-900 text-white shadow-lg'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent bg-white text-stone-900 placeholder-stone-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-stone-600 mr-2 shrink-0">Categories:</span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show filtered products if search/filter is active */}
        {(searchQuery || selectedGender !== 'all' || selectedCategory !== 'all') ? (
          <div>
            <h2 className="text-2xl font-editorial font-normal text-stone-900 mb-6">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          /* Default view: Organized sections */
          <div className="space-y-16">
            {/* Men's Wear Section */}
            {menProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-editorial font-normal text-stone-900">Men's Wear</h2>
                  <button
                    onClick={() => setSelectedGender('men')}
                    className="text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-2 group"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {Object.entries(groupByCategory(menProducts)).map(([category, prods]) => {
                  if (prods.length === 0) return null;
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-lg font-semibold text-stone-700 mb-4 capitalize">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {prods.slice(0, 4).map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Women's Wear Section */}
            {womenProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-editorial font-normal text-stone-900">Women's Wear</h2>
                  <button
                    onClick={() => setSelectedGender('women')}
                    className="text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-2 group"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {Object.entries(groupByCategory(womenProducts)).map(([category, prods]) => {
                  if (prods.length === 0) return null;
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-lg font-semibold text-stone-700 mb-4 capitalize">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {prods.slice(0, 4).map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All Garments Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-editorial font-normal text-stone-900">All Garments</h2>
                <span className="text-sm text-stone-500">{products.length} items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Show Men's products first */}
                {menProducts.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {/* Then Women's products */}
                {womenProducts.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length > 12 && (
                <div className="text-center mt-8">
                  <button className="px-8 py-3 border-2 border-stone-900 text-stone-900 font-semibold rounded-lg hover:bg-stone-900 hover:text-white transition-all">
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {detailProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product Image */}
            <div className="md:w-5/12 bg-[#FAF8F5] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
              <div className="w-full aspect-3/4 rounded-xl overflow-hidden bg-white shadow-lg">
                <GarmentSilhouette
                  product={detailProduct}
                  color={modalColor || detailProduct.colors[0]}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-7/12 p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-editorial font-normal text-stone-900">{detailProduct.name}</h2>
                  <p className="text-sm text-stone-500 uppercase tracking-wide mt-1">{detailProduct.brand}</p>
                </div>
                <button
                  onClick={() => setDetailProduct(null)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-bold text-stone-900">${detailProduct.price}</p>
                {detailProduct.originalPrice && (
                  <p className="text-lg text-stone-400 line-through">${detailProduct.originalPrice}</p>
                )}
              </div>

              <p className="text-sm text-stone-600 leading-relaxed mb-6">{detailProduct.description}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-900 mb-3">Color</label>
                <div className="flex items-center gap-2">
                  {detailProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModalColor(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        modalColor?.hex === color.hex ? 'border-stone-900 scale-110' : 'border-stone-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-900 mb-3">Size</label>
                <div className="flex items-center gap-2">
                  {detailProduct.sizes.map((size) => {
                    const fit = evaluateGarmentFit(detailProduct, size, measurements);
                    return (
                      <button
                        key={size}
                        onClick={() => setModalSize(size)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                          modalSize === size
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 text-stone-700 hover:border-stone-400'
                        } ${fit.status === 'perfect' ? 'ring-2 ring-emerald-400' : ''}`}
                      >
                        {size}
                        {fit.status === 'perfect' && <Check className="w-3 h-3 inline ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    onTryInStudio(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="px-6 py-3 border-2 border-stone-900 text-stone-900 font-semibold rounded-lg hover:bg-stone-900 hover:text-white transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Try On
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
