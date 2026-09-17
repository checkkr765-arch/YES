import React, { useState } from 'react';
import { X, Box, Image as ImageIcon, MessageSquare, Phone, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FurnitureViewer3D } from './3d/FurnitureViewer3D.tsx';
import type { Product, BrandSettings } from '../types.ts';

interface ProductDetailModalProps {
  product: Product | null;
  brand: BrandSettings;
  onClose: () => void;
  onOpenInquiry: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  brand,
  onClose,
  onOpenInquiry,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'3d' | 'gallery'>('3d');
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const whatsappMessage = encodeURIComponent(
    `Hello ALABBAS FURNITURE HOUSE, I am interested in inquiring about "${product.name}" (${product.style}, Material: ${product.material}). Could you please share more details and availability?`
  );
  const whatsappUrl = `https://wa.me/${brand.showroom.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#1E1410]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F7F3ED] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A46D]/30 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#1E1410]/80 hover:bg-[#1E1410] text-[#F7F3ED] hover:text-[#C5A46D] transition-all cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Visuals (3D Viewer or Photo Gallery) */}
          <div className="lg:col-span-7 bg-[#1E1410] p-6 sm:p-8 flex flex-col justify-between">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-[#2E1D14] p-1 rounded-xl border border-[#C5A46D]/30">
                {product.threeDModel && (
                  <button
                    onClick={() => setActiveTab('3d')}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === '3d'
                        ? 'bg-[#C5A46D] text-[#1E1410] shadow'
                        : 'text-[#E8D8C2] hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Interactive 3D</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'gallery' || !product.threeDModel
                      ? 'bg-[#C5A46D] text-[#1E1410] shadow'
                      : 'text-[#E8D8C2] hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photography</span>
                </button>
              </div>

              <span className="text-[11px] text-[#C5A46D] uppercase tracking-wider font-mono">
                {product.availability}
              </span>
            </div>

            {/* Display Visual */}
            <div className="flex-1 flex flex-col justify-center">
              {activeTab === '3d' && product.threeDModel ? (
                <FurnitureViewer3D product={product} />
              ) : (
                <div className="space-y-4">
                  <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-black/40 border border-[#C5A46D]/20 shadow-inner">
                    <img
                      src={product.images[selectedImgIndex] || product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {product.images.map((imgUrl, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImgIndex(i)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            selectedImgIndex === i
                              ? 'border-[#C5A46D] scale-105 shadow-md'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E8D8C2]/60">
              <span>ALABBAS FURNITURE HOUSE Artisanal Collection</span>
              <span>Mandi Bahauddin</span>
            </div>
          </div>

          {/* Right Column: Product Specifications & Actions */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#3A2418]/10 text-[#3A2418] text-[11px] font-bold uppercase tracking-widest mb-3">
                {product.style}
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1410] leading-snug">
                {product.name}
              </h2>

              {/* Price display */}
              <div className="mt-2 mb-4">
                {product.showPrice && product.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#1E1410]">
                      PKR {product.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#C5A46D] uppercase font-semibold">
                      Verified Pricing
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#3A2418]/70 italic">
                    Price available on inquiry tailored to chosen finish and fabric configuration.
                  </p>
                )}
              </div>

              <p className="text-sm text-[#3A2418]/85 leading-relaxed font-light">
                {product.detailedDescription || product.description}
              </p>

              {/* Specifications Table */}
              <div className="mt-6 space-y-3 bg-[#E8D8C2]/20 p-4 rounded-2xl border border-[#3A2418]/10 text-xs">
                <div className="flex justify-between py-1 border-b border-[#3A2418]/10">
                  <span className="font-semibold text-[#1E1410]">Material</span>
                  <span className="text-[#3A2418] text-right">{product.material}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#3A2418]/10">
                  <span className="font-semibold text-[#1E1410]">Dimensions</span>
                  <span className="text-[#3A2418] text-right">{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#3A2418]/10">
                  <span className="font-semibold text-[#1E1410]">Style Category</span>
                  <span className="text-[#3A2418] text-right">{product.style}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-[#1E1410]">Availability</span>
                  <span className="text-[#3A2418] font-medium text-right">{product.availability}</span>
                </div>
              </div>

              {/* Quality Guarantee Box */}
              <div className="mt-4 flex items-start gap-2.5 text-xs text-[#3A2418]/75">
                <ShieldCheck className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <span>
                  Every piece undergoes multi-stage timber seasoning and joinery inspection at our workshop before showroom dispatch.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-4 border-t border-[#3A2418]/15">
              <button
                onClick={() => {
                  onClose();
                  onOpenInquiry(product);
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#3A2418] hover:bg-[#1E1410] text-[#F7F3ED] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C5A46D]" />
                <span>ENQUIRE ABOUT THIS PIECE</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>WHATSAPP</span>
                </a>

                <a
                  href={`tel:${brand.showroom.phone}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-[#E8D8C2]/40 text-[#1E1410] border border-[#3A2418]/20 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C5A46D]" />
                  <span>CONTACT US</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
