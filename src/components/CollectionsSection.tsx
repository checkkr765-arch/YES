import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Collection } from '../types.ts';

interface CollectionsSectionProps {
  collections: Collection[];
  onSelectCollection: (collectionId: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  collections,
  onSelectCollection,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="collections" className="py-24 bg-[#1E1410] text-[#F7F3ED] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3A2418]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8D8C2]">
              EXPLORE OUR COLLECTIONS
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F7F3ED]">
            Designed for Every Corner of Your Home.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#E8D8C2]/80 font-light max-w-2xl mx-auto">
            Thoughtfully curated spaces crafted with lasting materials, ergonomic support, and timeless aesthetic restraint.
          </p>
        </motion.div>

        {/* 4 Collections Cards Grid with Staggered Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {collections.map((col) => {
            const isHovered = hoveredId === col.id;

            return (
              <motion.div
                key={col.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
                onMouseEnter={() => setHoveredId(col.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative rounded-3xl overflow-hidden bg-[#241812] border border-[#C5A46D]/20 shadow-2xl transition-colors duration-500 hover:border-[#C5A46D]/60 flex flex-col justify-between"
              >
                {/* Image Container with 3D Zoom Effect */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241812] via-[#241812]/40 to-transparent" />

                  {/* Number Badge */}
                  <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-[#1E1410]/80 backdrop-blur-md border border-[#C5A46D]/40 text-[#C5A46D] font-mono text-xs font-bold tracking-widest">
                    {col.number}
                  </div>

                  {/* Title Floating on Image */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wide text-[#F7F3ED]">
                      {col.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Product List */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-sm sm:text-base text-[#E8D8C2]/85 font-light leading-relaxed">
                    {col.description}
                  </p>

                  {/* Products Tag List */}
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A46D] mb-3">
                      Featured in this collection:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(col.featuredProducts) ? col.featuredProducts : []).map((prodName) => (
                        <span
                          key={prodName}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#3A2418]/60 border border-[#C5A46D]/15 text-xs text-[#E8D8C2]"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#C5A46D]" />
                          <span>{prodName}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-[#C5A46D]/15">
                    <button
                      onClick={() => onSelectCollection(col.id)}
                      className="group/btn w-full inline-flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#3A2418]/90 hover:bg-[#C5A46D] text-[#E8D8C2] hover:text-[#1E1410] text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
                    >
                      <span>VIEW {col.title} COLLECTION</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A46D] group-hover/btn:text-[#1E1410] group-hover/btn:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
