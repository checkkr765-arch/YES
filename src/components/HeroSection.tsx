import React from 'react';
import { HeroLivingRoom3D } from './3d/HeroLivingRoom3D.tsx';
import { ArrowRight, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import type { BrandSettings } from '../types.ts';

interface HeroSectionProps {
  brand: BrandSettings;
  onExplore: () => void;
  onVisitShowroom: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  brand,
  onExplore,
  onVisitShowroom,
}) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#1E1410] pt-24 pb-16"
    >
      {/* 3D WebGL Living Room Canvas */}
      <HeroLivingRoom3D />

      {/* Subtle atmospheric vignette and light gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1410] via-[#1E1410]/40 to-[#1E1410]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,#1E1410_85%)] pointer-events-none opacity-80" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/35 backdrop-blur-md mb-8 animate-in fade-in duration-700">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#E8D8C2] uppercase">
            ALABBAS FURNITURE HOUSE • PREMIUM FURNITURE
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#F7F3ED] uppercase leading-[1.08] max-w-4xl">
          TURN YOUR SPACE <br />
          <span className="italic font-normal text-[#E8D8C2]">INTO SOMETHING</span> <br />
          TIMELESS.
        </h1>

        {/* Subheadline */}
        <p className="mt-7 text-base sm:text-lg md:text-xl text-[#E8D8C2]/90 font-light max-w-2xl leading-relaxed tracking-wide">
          Discover beautifully crafted furniture designed to bring comfort, character and lasting elegance to every room.
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
          <button
            onClick={onExplore}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A46D] to-[#b8955a] text-[#1E1410] font-bold text-xs uppercase tracking-[0.22em] shadow-2xl hover:shadow-[#C5A46D]/40 hover:scale-[1.03] transition-all cursor-pointer"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onVisitShowroom}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#2A1B12]/80 hover:bg-[#3A2418] text-[#F7F3ED] hover:text-[#C5A46D] border border-[#C5A46D]/35 backdrop-blur-md font-medium text-xs uppercase tracking-[0.22em] transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#C5A46D]" />
            <span>VISIT OUR SHOWROOM</span>
          </button>
        </div>

        {/* Quick Location & Origin Marker */}
        <div className="mt-14 inline-flex items-center gap-6 text-xs text-[#E8D8C2]/70 font-light tracking-widest uppercase">
          <span>Mandi Bahauddin</span>
          <span className="w-1 h-1 rounded-full bg-[#C5A46D]" />
          <span>Punjab, Pakistan</span>
          <span className="w-1 h-1 rounded-full bg-[#C5A46D]" />
          <span>Handcrafted Luxury</span>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-[#E8D8C2]/60 hover:text-[#C5A46D] transition-colors group cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform animate-bounce" />
      </a>
    </section>
  );
};
