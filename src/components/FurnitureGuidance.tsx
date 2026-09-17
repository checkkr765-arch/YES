import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

export const FurnitureGuidance: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    roomType: 'Living Room',
    preferredStyle: 'Modern',
    budgetRange: 'PKR 250,000–500,000',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const roomTypes = ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Complete Home', 'Other'];
  const styles = ['Modern', 'Classic', 'Minimal', 'Luxury', 'Traditional', 'Not Sure'];
  const budgetRanges = [
    'Under PKR 100,000',
    'PKR 100,000–250,000',
    'PKR 250,000–500,000',
    'PKR 500,000+',
    'Prefer to discuss',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit guidance request');
      }
      setSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        roomType: 'Living Room',
        preferredStyle: 'Modern',
        budgetRange: 'PKR 250,000–500,000',
        notes: '',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="guidance" className="py-24 bg-[#F7F3ED] text-[#24211F] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#C5A46D]/25 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 text-[#3A2418] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>INTERIOR CONSULTATION</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1E1410]">
              Not Sure What Fits Your Space?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#3A2418]/80 font-light leading-relaxed">
              Choosing furniture becomes easier when you have the right guidance. Tell us about your room, preferred style and requirements, and our team can help you explore suitable options.
            </p>
          </div>

          {success ? (
            <div className="bg-[#E8D8C2]/30 border border-[#C5A46D]/40 p-8 rounded-2xl text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#C5A46D] text-[#1E1410] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1410]">
                Guidance Request Received
              </h3>
              <p className="text-sm text-[#3A2418]/85 max-w-md mx-auto">
                Thank you. Our senior showroom consultant will review your room preferences and contact you on WhatsApp / Phone with tailored options.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#3A2418] text-[#F7F3ED] text-xs uppercase tracking-wider font-bold"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* 1. Room Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1410] mb-3">
                  1. Room Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {roomTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({ ...formData, roomType: type })}
                      className={`py-3 px-2 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                        formData.roomType === type
                          ? 'bg-[#3A2418] text-[#F7F3ED] border-[#3A2418] shadow-md font-bold'
                          : 'bg-[#F7F3ED]/60 text-[#3A2418] border-[#3A2418]/15 hover:bg-[#E8D8C2]/40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Preferred Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1410] mb-3">
                  2. Preferred Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {styles.map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setFormData({ ...formData, preferredStyle: style })}
                      className={`py-3 px-2 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                        formData.preferredStyle === style
                          ? 'bg-[#3A2418] text-[#F7F3ED] border-[#3A2418] shadow-md font-bold'
                          : 'bg-[#F7F3ED]/60 text-[#3A2418] border-[#3A2418]/15 hover:bg-[#E8D8C2]/40'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Budget Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1410] mb-3">
                  3. Budget Range (PKR)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {budgetRanges.map((range) => (
                    <button
                      type="button"
                      key={range}
                      onClick={() => setFormData({ ...formData, budgetRange: range })}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                        formData.budgetRange === range
                          ? 'bg-[#3A2418] text-[#F7F3ED] border-[#3A2418] shadow-md font-bold'
                          : 'bg-[#F7F3ED]/60 text-[#3A2418] border-[#3A2418]/15 hover:bg-[#E8D8C2]/40'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
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

                <div>
                  <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                    City in Pakistan
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mandi Bahauddin, Lahore"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1410] mb-1.5">
                  Room Dimensions or Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share any details such as room dimensions, preferred wood tone (walnut/oak), or layout constraints..."
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F3ED] border border-[#3A2418]/20 text-sm focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              {/* Submit button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#3A2418] hover:bg-[#1E1410] text-[#F7F3ED] font-bold text-xs uppercase tracking-[0.22em] shadow-xl hover:shadow-2xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5A46D]" />
                      <span>SUBMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>REQUEST GUIDANCE</span>
                      <Send className="w-4 h-4 text-[#C5A46D]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
