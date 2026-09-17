import React from 'react';
import { Compass, Eye, CheckCircle2, Truck, Sparkles } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'EXPLORE',
      description: 'Browse our collection online or visit our showroom to discover designs that catch your eye.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'DISCOVER',
      description: 'Experience materials, textures and comfort in person while our team guides you through the details.',
      icon: Eye,
    },
    {
      num: '03',
      title: 'SELECT',
      description: 'Choose the right configuration, wood finish or upholstery for your home.',
      icon: CheckCircle2,
    },
    {
      num: '04',
      title: 'BRING IT HOME',
      description: 'Enjoy reliable delivery and setup so your new furniture feels right from day one.',
      icon: Truck,
    },
  ];

  return (
    <section id="process" className="py-24 bg-[#1E1410] text-[#F7F3ED] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
              HOW IT WORKS
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-medium tracking-tight text-[#F7F3ED]">
            From Inspiration to Your Living Space.
          </h2>

          <p className="mt-4 text-base text-[#E8D8C2]/80 font-light max-w-xl mx-auto">
            A seamless journey ensuring thoughtful craftsmanship from initial blueprint to final doorstep placement.
          </p>
        </div>

        {/* Steps Grid with connecting horizontal line on desktop */}
        <div className="relative">
          {/* Subtle connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D]/30 to-transparent -translate-y-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const IconComp = step.icon;

              return (
                <div
                  key={step.num}
                  className="relative group bg-[#281A13] p-8 rounded-3xl border border-[#C5A46D]/20 shadow-xl hover:border-[#C5A46D]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-bold text-[#C5A46D] px-3 py-1 rounded-full bg-[#1E1410] border border-[#C5A46D]/30">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#3A2418] flex items-center justify-center text-[#C5A46D] group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif-luxury text-xl font-bold tracking-widest text-[#F7F3ED] mb-3">
                      {step.title}
                    </h3>

                    <p className="text-sm text-[#E8D8C2]/80 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A46D]/70 font-mono">
                      Step {step.num} of 04
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
