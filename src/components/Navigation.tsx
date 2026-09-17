import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import type { BrandSettings } from '../types.ts';

interface NavigationProps {
  brand: BrandSettings;
  onVisitShowroom: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ brand, onVisitShowroom }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Collections', href: '#collections' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Showroom 3D', href: '#showroom-3d' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1E1410]/95 backdrop-blur-md py-3.5 border-b border-[#C5A46D]/20 shadow-xl'
          : 'bg-gradient-to-b from-[#1E1410]/90 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="group flex flex-col tracking-wider cursor-pointer select-none"
        >
          <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#F7F3ED] group-hover:text-[#C5A46D] transition-colors">
            ALABBAS
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#C5A46D] uppercase font-medium">
            FURNITURE HOUSE
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-xs uppercase tracking-[0.18em] font-medium text-[#E8D8C2] hover:text-[#C5A46D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C5A46D] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Primary Action Button */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={onVisitShowroom}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A46D] to-[#b8955a] text-[#1E1410] text-xs uppercase font-bold tracking-[0.18em] shadow-lg hover:shadow-[#C5A46D]/25 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#1E1410]" />
            <span>VISIT SHOWROOM</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#E8D8C2] hover:text-[#C5A46D] hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E1410]/98 backdrop-blur-2xl border-b border-[#C5A46D]/30 px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm uppercase tracking-[0.2em] font-medium text-[#E8D8C2] hover:text-[#C5A46D] py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onVisitShowroom();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C5A46D] text-[#1E1410] font-bold text-xs uppercase tracking-[0.2em] shadow-md"
            >
              <MapPin className="w-4 h-4" />
              <span>VISIT SHOWROOM</span>
            </button>

            <a
              href={`tel:${brand.showroom.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#C5A46D]/30 text-[#E8D8C2] text-xs font-medium uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Call Showroom</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
