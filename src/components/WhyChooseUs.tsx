import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Hammer, Clock, Heart, BadgeCheck, Sparkles, UserCheck } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      num: '01',
      title: 'QUALITY CRAFTSMANSHIP',
      description: 'Carefully selected materials and attention to detail go into every piece we offer.',
      icon: Hammer,
    },
    {
      num: '02',
      title: 'TIMELESS DESIGNS',
      description: 'Furniture designed to remain beautiful beyond changing interior trends.',
      icon: Clock,
    },
    {
      num: '03',
      title: 'COMFORT FIRST',
      description: 'Because beautiful furniture should also feel exceptional every day.',
      icon: Heart,
    },
    {
      num: '04',
      title: 'HONEST VALUE',
      description: 'Premium-looking furniture with practical value for modern families.',
      icon: BadgeCheck,
    },
    {
      num: '05',
      title: 'WIDE COLLECTION',
      description: 'Explore furniture for living rooms, bedrooms, dining spaces and more under one roof.',
      icon: Sparkles,
    },
    {
      num: '06',
      title: 'PERSONAL SERVICE',
      description: 'Our team helps you find furniture that fits your room, lifestyle and preferences.',
      icon: UserCheck,
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#1E1410] text-[#F7F3ED] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
              WHY ALABBAS
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-medium tracking-tight text-[#F7F3ED]">
            Quality You Can See. Comfort You Can Feel.
          </h2>

          <p className="mt-4 text-base text-[#E8D8C2]/80 font-light max-w-2xl mx-auto">
            Decades of artisanal heritage in Pakistan, pairing generational woodworking with contemporary interior balance.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.num}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="group relative p-8 rounded-3xl bg-[#281A13] border border-[#C5A46D]/20 shadow-xl hover:border-[#C5A46D]/60 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-[#C5A46D] tracking-widest px-3 py-1 rounded-full bg-[#1E1410] border border-[#C5A46D]/30">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#3A2418] flex items-center justify-center text-[#C5A46D] group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif-luxury text-xl font-bold tracking-wider text-[#F7F3ED] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#E8D8C2]/80 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
                  <span className="text-[11px] uppercase tracking-wider text-[#C5A46D]/80 font-medium">
                    Alabbas Standard
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
