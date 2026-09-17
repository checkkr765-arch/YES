import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import type { Testimonial } from '../types.ts';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[] | { items?: Testimonial[] };
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const safeList: Testimonial[] = Array.isArray(testimonials)
    ? testimonials
    : ((testimonials as any)?.items || []);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!safeList.length) {
    return null;
  }

  const activeIndex = currentIndex % safeList.length;
  const current = safeList[activeIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + safeList.length) % safeList.length);
  };

  return (
    <section className="py-24 bg-[#F7F3ED] text-[#24211F] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 text-[#3A2418] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>STORIES FROM HOMES</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-medium tracking-tight text-[#1E1410]">
            Words from Those Who Live with Our Furniture.
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#3A2418]/70">
            Real feedback from valued showroom clients across Punjab &amp; Pakistan.
          </p>
        </div>

        {/* Testimonial Showcase Card */}
        {current && (
          <div className="relative bg-white rounded-3xl p-8 sm:p-14 border border-[#C5A46D]/30 shadow-xl">
            <div className="absolute -top-6 left-12 w-12 h-12 rounded-2xl bg-[#3A2418] text-[#C5A46D] flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6" />
            </div>

            <div className="pt-4 space-y-6">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#C5A46D]">
                {Array.from({ length: current.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-serif-luxury text-xl sm:text-2xl md:text-3xl text-[#1E1410] font-normal leading-relaxed italic">
                "{current.content || (current as any).quote || 'Exceptional craftsmanship and attention to detail.'}"
              </p>

              {/* Author & Piece */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#3A2418]/10">
                <div>
                  <h4 className="font-bold text-base text-[#1E1410]">
                    {current.name}
                  </h4>
                  <p className="text-xs text-[#3A2418]/70">
                    {(current as any).city ? `${(current as any).city}, Pakistan` : current.role || 'Verified Customer'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8D8C2]/30 text-xs text-[#3A2418] font-medium border border-[#3A2418]/10">
                  <span className="text-[#C5A46D] font-bold">Showroom:</span>
                  <span>{(current as any).piece || 'Mandi Bahauddin'}</span>
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#3A2418]/10">
              <div className="flex items-center gap-2">
                {safeList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeIndex === idx ? 'w-8 bg-[#3A2418]' : 'w-2 bg-[#3A2418]/20'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full border border-[#3A2418]/20 text-[#3A2418] hover:bg-[#3A2418] hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full border border-[#3A2418]/20 text-[#3A2418] hover:bg-[#3A2418] hover:text-white transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
