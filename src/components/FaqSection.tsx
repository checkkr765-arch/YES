import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react';
import type { FaqItem } from '../types.ts';

interface FaqSectionProps {
  items?: FaqItem[] | { items?: FaqItem[] };
}

export const FaqSection: React.FC<FaqSectionProps> = ({ items }) => {
  const faqList: FaqItem[] = Array.isArray(items)
    ? items
    : ((items as any)?.items || []);
  const [openId, setOpenId] = useState<string | null>(faqList[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (!faqList.length) {
    return null;
  }

  return (
    <section id="faq" className="py-24 bg-[#1E1410] text-[#F7F3ED] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
              COMMON QUESTIONS
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-medium tracking-tight text-[#F7F3ED]">
            Everything You Need to Know.
          </h2>

          <p className="mt-3 text-sm text-[#E8D8C2]/80 font-light">
            Answers to common questions regarding our showroom, customization, and delivery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqList.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#281A13] border-[#C5A46D]/50 shadow-xl'
                    : 'bg-[#241812] border-[#C5A46D]/15 hover:border-[#C5A46D]/30'
                }`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif-luxury text-lg sm:text-xl font-medium text-[#F7F3ED] pr-4">
                    {item.question}
                  </span>
                  <div className={`p-2 rounded-full transition-transform ${isOpen ? 'bg-[#C5A46D] text-[#1E1410]' : 'bg-[#3A2418] text-[#E8D8C2]'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#E8D8C2]/85 leading-relaxed font-light border-t border-white/5 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
