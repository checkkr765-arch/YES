import React, { useState } from 'react';
import { Eye, MessageSquare, ArrowRight, Sparkles, Box, Check } from 'lucide-react';
import type { Product, Collection } from '../types.ts';

interface SignatureShowcaseProps {
  products: Product[];
  collections: Collection[];
  selectedCollectionFilter: string;
  onFilterChange: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
}

export const SignatureShowcase: React.FC<SignatureShowcaseProps> = ({
  products,
  collections,
  selectedCollectionFilter,
  onFilterChange,
  onSelectProduct,
  onEnquireProduct,
}) => {
  const filteredProducts =
    selectedCollectionFilter === 'all'
      ? products
      : products.filter((p) => p.collectionId === selectedCollectionFilter);

  return (
    <section id="showcase" className="py-24 bg-[#F7F3ED] text-[#24211F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-[1.5px] bg-[#C5A46D]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
                THE ALABBAS SIGNATURE
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1E1410]">
              Pieces That Become Part of Your Story.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#3A2418]/80 font-light max-w-md">
            Each signature item is engineered with seasoned solid timbers, bespoke tailoring, and architectural proportions.
          </p>
        </div>

        {/* Collection Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#3A2418]/10">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.18em] transition-all shrink-0 cursor-pointer ${
              selectedCollectionFilter === 'all'
                ? 'bg-[#3A2418] text-[#F7F3ED] shadow-md'
                : 'text-[#3A2418]/70 hover:text-[#1E1410] hover:bg-[#3A2418]/5'
            }`}
          >
            All Pieces ({products.length})
          </button>

          {(collections || []).map((c) => (
            <button
              key={c.id}
              onClick={() => onFilterChange(c.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.18em] transition-all shrink-0 cursor-pointer ${
                selectedCollectionFilter === c.id
                  ? 'bg-[#3A2418] text-[#F7F3ED] shadow-md'
                  : 'text-[#3A2418]/70 hover:text-[#1E1410] hover:bg-[#3A2418]/5'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(filteredProducts || []).map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#C5A46D]/20 shadow-sm hover:shadow-2xl hover:border-[#C5A46D]/60 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#E8D8C2]/20">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  {product.isFeatured ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E1410]/85 backdrop-blur-md text-[#C5A46D] text-[10px] font-bold uppercase tracking-wider border border-[#C5A46D]/30">
                      <Sparkles className="w-3 h-3" />
                      <span>Signature</span>
                    </span>
                  ) : <span />}

                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#3A2418] text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                    {product.availability}
                  </span>
                </div>

                {/* 3D Model available indicator pill */}
                {product.threeDModel && (
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1410]/85 backdrop-blur-md text-[#F7F3ED] text-[11px] font-medium border border-[#C5A46D]/30 shadow-md">
                    <Box className="w-3.5 h-3.5 text-[#C5A46D]" />
                    <span>Interactive 3D Available</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A46D]">
                      {product.style}
                    </span>
                    {product.showPrice && product.price ? (
                      <span className="text-sm font-bold text-[#1E1410]">
                        PKR {product.price.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-xs text-[#3A2418]/60 italic">
                        Enquire for Pricing
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1E1410] group-hover:text-[#3A2418] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#3A2418]/75 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#3A2418]/10 space-y-1 text-xs text-[#3A2418]/80">
                    <p>
                      <span className="font-semibold text-[#1E1410]">Material:</span>{' '}
                      {product.material}
                    </p>
                    <p>
                      <span className="font-semibold text-[#1E1410]">Dimensions:</span>{' '}
                      {product.dimensions}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#F7F3ED] hover:bg-[#E8D8C2] text-[#3A2418] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C5A46D]" />
                    <span>View &amp; 3D</span>
                  </button>

                  <button
                    onClick={() => onEnquireProduct(product)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3A2418] hover:bg-[#1E1410] text-[#F7F3ED] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A46D]" />
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
