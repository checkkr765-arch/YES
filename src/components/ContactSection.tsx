import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, Sparkles, UserCheck } from 'lucide-react';
import type { BrandSettings, Product } from '../types.ts';

interface ContactSectionProps {
  brand: BrandSettings;
  prefillProduct?: Product | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  brand,
  prefillProduct,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    interest: prefillProduct ? `Product: ${prefillProduct.name}` : 'Living Room Furniture',
    message: prefillProduct
      ? `I would like to inquire about the ${prefillProduct.name} (${prefillProduct.style}, Material: ${prefillProduct.material}). Please provide pricing and availability.`
      : '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const interestOptions = [
    'Living Room Furniture',
    'Bedroom Furniture',
    'Dining Room Sets',
    'Full Home Furnishing',
    'Custom Woodwork & Sizing',
    'Showroom Private Visit',
    'General Inquiry',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please provide your name, phone number, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        interest: 'Living Room Furniture',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#F7F3ED] text-[#24211F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Showroom Contacts & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A2418]/10 text-[#3A2418] text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>GET IN TOUCH</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-medium tracking-tight text-[#1E1410] leading-tight">
                Let's Talk About Your Next Space.
              </h2>

              <p className="mt-4 text-base text-[#3A2418]/80 font-light leading-relaxed">
                Whether you are redesigning an entire residence or searching for a single signature statement piece, our furniture specialists in Mandi Bahauddin are at your service.
              </p>
            </div>

            {/* Contact details list */}
            <div className="space-y-6 pt-4 border-t border-[#3A2418]/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3A2418] text-[#C5A46D] flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E1410]">
                    Showroom Address
                  </h4>
                  <p className="text-sm text-[#3A2418]/85 mt-0.5">
                    {brand.showroom.address}
                  </p>
                  <p className="text-xs text-[#C5A46D] font-medium mt-0.5">
                    {brand.showroom.city}, {brand.showroom.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3A2418] text-[#C5A46D] flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E1410]">
                    Phone &amp; WhatsApp
                  </h4>
                  <a
                    href={`tel:${brand.showroom.phone}`}
                    className="block text-sm text-[#3A2418]/90 font-medium hover:text-[#C5A46D] transition-colors mt-0.5"
                  >
                    {brand.showroom.phone}
                  </a>
                  <a
                    href={`https://wa.me/${brand.showroom.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-[#25D366] font-semibold mt-0.5"
                  >
                    Direct WhatsApp: {brand.showroom.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3A2418] text-[#C5A46D] flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E1410]">
                    Email Inquiries
                  </h4>
                  <a
                    href={`mailto:${brand.showroom.email}`}
                    className="text-sm text-[#3A2418]/90 hover:text-[#C5A46D] transition-colors mt-0.5 block"
                  >
                    {brand.showroom.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3A2418] text-[#C5A46D] flex items-center justify-center shrink-0 shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E1410]">
                    Showroom Owner
                  </h4>
                  <p className="text-sm font-bold text-[#1E1410] font-serif-luxury mt-0.5">
                    {brand.showroom.ownerName || 'Tahir Abbas'}
                  </p>
                  <p className="text-xs text-[#3A2418]/70 mt-0.5">
                    {brand.showroom.ownerRole || 'Showroom Owner & Founder'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3A2418] text-[#C5A46D] flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E1410]">
                    Showroom Hours
                  </h4>
                  <p className="text-xs text-[#3A2418]/85 mt-0.5 font-medium">
                    Monday – Sunday: 9:00 AM – 5:00 PM
                  </p>
                  <p className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded bg-red-100 text-red-700 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Friday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C5A46D]/30 shadow-2xl">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1410] mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-[#3A2418]/70 mb-8">
                Fill in your details below and our team will get back to you promptly.
              </p>

              {success ? (
                <div className="bg-[#E8D8C2]/30 border border-[#C5A46D]/40 p-8 rounded-2xl text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#C5A46D] text-[#1E1410] flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-luxury text-2xl font-bold text-[#1E1410]">
                    Thank You for Your Inquiry
                  </h4>
                  <p className="text-sm text-[#3A2418]/85 max-w-md mx-auto">
                    Your message has been received by ALABBAS FURNITURE HOUSE. A consultant will review your request and connect with you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#3A2418] text-[#F7F3ED] text-xs uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ahmad Khan"
                        className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92 300 0000000"
                        className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                        Your City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Mandi Bahauddin, Gujrat"
                        className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                      What are you interested in?
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none cursor-pointer"
                    >
                      {interestOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                      {prefillProduct && (
                        <option value={`Product: ${prefillProduct.name}`}>
                          Product: {prefillProduct.name}
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you are looking for, room sizes, or specific questions..."
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#3A2418] hover:bg-[#1E1410] text-[#F7F3ED] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#C5A46D]" />
                        <span>SENDING INQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND INQUIRY</span>
                        <Send className="w-4 h-4 text-[#C5A46D]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
