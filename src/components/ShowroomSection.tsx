import React from 'react';
import { MapPin, Clock, Phone, Send, Calendar, Navigation2, CheckCircle2 } from 'lucide-react';
import type { BrandSettings } from '../types.ts';

interface ShowroomSectionProps {
  brand: BrandSettings;
  onBookConsultation: () => void;
}

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({
  brand,
  onBookConsultation,
}) => {
  const whatsappUrl = `https://wa.me/${brand.showroom.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello ALABBAS FURNITURE HOUSE, I would like to plan a visit to your showroom in Mandi Bahauddin. Could you please provide guidance on visiting hours?'
  )}`;

  return (
    <section id="showroom" className="py-24 bg-[#F7F3ED] text-[#24211F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#C5A46D]/30 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left details */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A2418]/10 text-[#3A2418] text-xs font-bold uppercase tracking-widest mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>VISIT OUR SHOWROOM</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1E1410] leading-tight">
                Experience the Craft in Person.
              </h2>

              <p className="mt-4 text-base text-[#3A2418]/80 font-light leading-relaxed">
                Step into our dedicated flagship showroom in Mandi Bahauddin. Feel the seasoned grain of solid wood, test the ergonomic comfort of our hand-tailored cushions, and receive personal recommendations from our furniture artisans.
              </p>
            </div>

            {/* Practical Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#3A2418]/10">
              {/* Location Card */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1410]">
                  <MapPin className="w-4 h-4 text-[#C5A46D]" />
                  <span>Showroom Location</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3A2418]/85 leading-relaxed font-medium">
                  {brand.showroom.address}
                </p>
                <p className="text-xs text-[#C5A46D] font-medium">
                  {brand.showroom.city}, {brand.showroom.country}
                </p>
              </div>

              {/* Visiting Hours Card */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1410]">
                  <Clock className="w-4 h-4 text-[#C5A46D]" />
                  <span>Visiting Hours</span>
                </div>
                <div className="text-xs text-[#3A2418]/85 space-y-1">
                  <div className="font-semibold text-[#1E1410]">
                    Mon – Sun: <span className="font-normal">9:00 AM – 5:00 PM</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Friday: Closed
                  </div>
                </div>
              </div>

              {/* Showroom Owner Card */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1410]">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
                  <span>Showroom Owner</span>
                </div>
                <p className="text-sm font-bold text-[#1E1410] font-serif-luxury">
                  {brand.showroom.ownerName || 'Tahir Abbas'}
                </p>
                <p className="text-xs text-[#3A2418]/70">
                  {brand.showroom.ownerRole || 'Showroom Owner & Founder'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookConsultation}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#3A2418] hover:bg-[#1E1410] text-[#F7F3ED] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C5A46D]" />
                <span>BOOK A CONSULTATION</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>WHATSAPP US</span>
              </a>

              <a
                href={`tel:${brand.showroom.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#F7F3ED] hover:bg-[#E8D8C2] text-[#1E1410] font-bold text-xs uppercase tracking-wider border border-[#3A2418]/20 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C5A46D]" />
                <span>CALL SHOWROOM</span>
              </a>
            </div>
          </div>

          {/* Right Showroom Atmosphere Banner & Architectural Features */}
          <div className="lg:col-span-5 bg-[#1E1410] p-8 sm:p-12 text-[#F7F3ED] flex flex-col justify-between relative">
            <div className="relative z-10 space-y-6">
              <span className="text-xs font-mono tracking-widest text-[#C5A46D] uppercase">
                ALABBAS FLAGSHIP
              </span>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold leading-snug">
                The In-Showroom Difference
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[#E8D8C2]/85 leading-relaxed font-light">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                  <span>Inspect our physical fabric and leather sample swatches</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                  <span>Evaluate timber grain selections (Sheesham, Walnut, Teak, Oak)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                  <span>Receive custom room dimension styling from master craftsmen</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                  <span>Direct order tracking and scheduled provincial delivery setup</span>
                </div>
              </div>
            </div>

            {/* Stylized Architectural Card */}
            <div className="mt-8 pt-6 border-t border-[#C5A46D]/20 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#C5A46D] uppercase font-bold tracking-wider">
                    Punjab Delivery
                  </p>
                  <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                    Safe doorstep transit &amp; assembly available
                  </p>
                </div>
                <Navigation2 className="w-6 h-6 text-[#C5A46D]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
