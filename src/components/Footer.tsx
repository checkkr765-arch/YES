import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUp, Heart, User } from 'lucide-react';
import type { BrandSettings } from '../types.ts';

interface FooterProps {
  brand: BrandSettings;
}

export const Footer: React.FC<FooterProps> = ({ brand }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our Story', href: '#about' },
    { label: 'Collections', href: '#collections' },
    { label: 'Signatures', href: '#showcase' },
    { label: '3D Showroom', href: '#showroom-3d' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'How It Works', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#140D0A] text-[#E8D8C2] pt-20 pb-12 border-t border-[#C5A46D]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col tracking-wider">
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-[#F7F3ED]">
                ALABBAS
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#C5A46D] uppercase font-semibold">
                FURNITURE HOUSE
              </span>
            </div>

            <p className="text-sm text-[#E8D8C2]/75 font-light leading-relaxed max-w-sm">
              "{brand.tagline}"
            </p>

            <p className="text-xs text-[#E8D8C2]/60 font-light leading-relaxed max-w-sm">
              Artisanal furniture showroom delivering enduring comfort, solid hardwood joinery, and tailored interior solutions across Pakistan.
            </p>

            <div className="pt-2">
              <span className="text-xs font-mono text-[#C5A46D] uppercase tracking-wider">
                Flagship Showroom: Mandi Bahauddin
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-4">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-[0.2em] text-[#F7F3ED] mb-6">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-wider text-[#E8D8C2]/70 hover:text-[#C5A46D] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Showroom & Inquiries */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-[0.2em] text-[#F7F3ED] mb-6">
              Showroom Inquiries
            </h4>

            <div className="space-y-3 text-xs text-[#E8D8C2]/80 font-light">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span className="font-medium text-[#F7F3ED]">
                  Owner: {brand.showroom.ownerName || 'Tahir Abbas'}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <span>
                  {brand.showroom.address}, {brand.showroom.city}, {brand.showroom.country}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <a href={`tel:${brand.showroom.phone}`} className="hover:text-[#C5A46D] transition-colors">
                  {brand.showroom.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <a href={`mailto:${brand.showroom.email}`} className="hover:text-[#C5A46D] transition-colors">
                  {brand.showroom.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block text-[#F7F3ED]">Mon – Sun: 9:00 AM – 5:00 PM</span>
                  <span className="inline-block text-[#E57373] text-[11px] font-semibold">Friday: Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8D8C2]/60">
          <p>© {new Date().getFullYear()} ALABBAS FURNITURE HOUSE. All Rights Reserved.</p>

          <p className="flex items-center gap-1">
            <span>Handcrafted with precision for homes in Pakistan</span>
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-[#C5A46D] hover:text-[#F7F3ED] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
