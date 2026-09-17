import React from 'react';
import { MapPin, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import type { BrandSettings } from '../types.ts';

interface DramaticCtaProps {
  brand: BrandSettings;
  onVisitShowroom: () => void;
  onContact: () => void;
}

export const DramaticCta: React.FC<DramaticCtaProps> = ({
  brand,
  onVisitShowroom,
  onContact,
}) => {
  return (
    <section className="relative py-28 bg-[#180F0B] text-[#F7F3ED] overflow-hidden border-y border-[#C5A46D]/25">
      {/* Rich ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,164,109,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
            ALABBAS FURNITURE HOUSE
          </span>
        </div>

        <h2 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#F7F3ED] leading-[1.1]">
          Ready to Transform <br />
          <span className="italic text-[#E8D8C2] font-normal">Your Home?</span>
        </h2>

        <p className="mt-6 text-base sm:text-xl text-[#E8D8C2]/90 font-light max-w-2xl mx-auto leading-relaxed">
          Visit ALABBAS FURNITURE HOUSE or connect with our team to find furniture crafted for everyday living.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onVisitShowroom}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#C5A46D] to-[#b8955a] text-[#1E1410] font-bold text-xs uppercase tracking-[0.22em] shadow-2xl hover:shadow-[#C5A46D]/30 hover:scale-[1.03] transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#1E1410]" />
            <span>VISIT OUR SHOWROOM</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onContact}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-[#2A1B12]/80 hover:bg-[#3A2418] text-[#F7F3ED] hover:text-[#C5A46D] border border-[#C5A46D]/35 backdrop-blur-md font-medium text-xs uppercase tracking-[0.22em] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#C5A46D]" />
            <span>CONTACT OUR TEAM</span>
          </button>
        </div>

        <p className="mt-12 text-xs uppercase tracking-widest text-[#E8D8C2]/60 font-light">
          Mandi Bahauddin • Punjab • Serving Clients Throughout Pakistan
        </p>
      </div>
    </section>
  );
};
