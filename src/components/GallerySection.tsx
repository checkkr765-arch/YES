import React, { useState } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { GalleryItem } from '../types.ts';

interface GallerySectionProps {
  items?: GalleryItem[] | { items?: GalleryItem[] };
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const safeItems: GalleryItem[] = Array.isArray(items)
    ? items
    : ((items as any)?.items || []);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Living Rooms',
    'Bedrooms',
    'Dining Spaces',
    'Furniture Details',
    'Showroom',
    'Wood Craftsmanship',
  ];

  const filteredItems =
    selectedCategory === 'All'
      ? safeItems
      : safeItems.filter((item) => item.category === selectedCategory);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-24 bg-[#1E1410] text-[#F7F3ED] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
              OUR WORLD
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F7F3ED]">
            Spaces Designed to Feel Like Home.
          </h2>

          <p className="mt-4 text-base text-[#E8D8C2]/80 font-light max-w-xl mx-auto">
            From raw seasoned timber in our workshop to luxury family homes in Pakistan.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C5A46D] text-[#1E1410] shadow-md font-bold'
                  : 'bg-[#2A1B12] text-[#E8D8C2]/70 hover:text-white hover:bg-[#3A2418]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-[#241812] border border-[#C5A46D]/20 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 break-inside-avoid"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1410] via-[#1E1410]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A46D] mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#F7F3ED]">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-[#E8D8C2]/80 mt-1 font-light line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-1 text-[11px] text-[#C5A46D] font-semibold">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to view full preview</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center mt-4 space-y-1">
              <span className="text-xs text-[#C5A46D] uppercase tracking-widest font-semibold">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="text-xl font-serif-luxury text-[#F7F3ED] font-bold">
                {filteredItems[lightboxIndex].title}
              </h3>
              {filteredItems[lightboxIndex].description && (
                <p className="text-xs text-[#E8D8C2]/80 max-w-lg mx-auto">
                  {filteredItems[lightboxIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
