import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutStory } from './components/AboutStory.tsx';
import { CollectionsSection } from './components/CollectionsSection.tsx';
import { SignatureShowcase } from './components/SignatureShowcase.tsx';
import { InteractiveShowroom3D } from './components/3d/InteractiveShowroom3D.tsx';
import { WhyChooseUs } from './components/WhyChooseUs.tsx';
import { StatisticsSection } from './components/StatisticsSection.tsx';
import { FurnitureGuidance } from './components/FurnitureGuidance.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { ProcessSection } from './components/ProcessSection.tsx';
import { ShowroomSection } from './components/ShowroomSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { DramaticCta } from './components/DramaticCta.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import type {
  BrandSettings,
  Collection,
  Product,
  GalleryItem,
  Testimonial,
  StatisticItem,
  FaqItem,
} from './types.ts';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState<BrandSettings | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Selection & UI State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prefillProduct, setPrefillProduct] = useState<Product | null>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('all');

  // Secret Admin Authentication State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('alabbas_admin_token') || null;
  });
  const [isAdminViewActive, setIsAdminViewActive] = useState(false);

  // Fetch Public Site Data
  const loadPublicData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (!res.ok) throw new Error('Failed to load initial site data');
      const data = await res.json();
      setBrand(data.brand);
      setCollections(Array.isArray(data.collections) ? data.collections : []);
      setProducts(Array.isArray(data.products) ? data.products : []);
      setGallery(Array.isArray(data.gallery) ? data.gallery : (data.gallery?.items || []));
      setTestimonials(Array.isArray(data.testimonials) ? data.testimonials : (data.testimonials?.items || []));
      const stats = Array.isArray(data.statistics) ? data.statistics : (data.statistics?.items || []);
      setStatistics(stats);
      setFaqs(Array.isArray(data.faqs) ? data.faqs : (data.faqs?.items || []));
    } catch (err) {
      console.error('Error fetching showroom data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Secret Route & Keyboard Shortcut Detection
  useEffect(() => {
    const checkSecretRoute = () => {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      // Check default or common secret paths
      if (
        currentPath.includes('/manage-') ||
        currentHash.includes('#manage-') ||
        currentPath === '/admin'
      ) {
        if (adminToken) {
          setIsAdminViewActive(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    checkSecretRoute();
    window.addEventListener('popstate', checkSecretRoute);

    // Keyboard shortcut: Ctrl+Shift+A (or Cmd+Shift+A) for admin gateway
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (adminToken) {
          setIsAdminViewActive(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', checkSecretRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [adminToken]);

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('alabbas_admin_token', token);
    setAdminToken(token);
    setIsAdminLoginOpen(false);
    setIsAdminViewActive(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('alabbas_admin_token');
    setAdminToken(null);
    setIsAdminViewActive(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !brand) {
    return (
      <div className="min-h-screen bg-[#1E1410] flex flex-col items-center justify-center text-[#F7F3ED] space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#3A2418] border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D] shadow-2xl">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="font-serif-luxury text-2xl font-bold tracking-[0.2em]">
            ALABBAS
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A46D] font-medium mt-1">
            FURNITURE HOUSE
          </p>
        </div>
      </div>
    );
  }

  // If Admin CMS View is active
  if (isAdminViewActive && adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleAdminLogout}
        onViewPublicSite={() => setIsAdminViewActive(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1410] text-[#F7F3ED] font-sans selection:bg-[#C5A46D] selection:text-[#1E1410]">
      {/* Persistent Navigation */}
      <Navigation
        brand={brand}
        onVisitShowroom={() => scrollToSection('showroom')}
      />

      {/* 1. Hero Section (with 3D living room) */}
      <HeroSection
        brand={brand}
        onExplore={() => scrollToSection('collections')}
        onVisitShowroom={() => scrollToSection('showroom')}
      />

      {/* 2. About Story Section */}
      <AboutStory
        brand={brand}
        onExplore={() => scrollToSection('showcase')}
      />

      {/* 3. Collections Section */}
      <CollectionsSection
        collections={collections}
        onSelectCollection={(colId) => {
          setSelectedCollectionFilter(colId);
          scrollToSection('showcase');
        }}
      />

      {/* 4. Signature Showcase (with 3D flags and category filters) */}
      <SignatureShowcase
        products={products}
        collections={collections}
        selectedCollectionFilter={selectedCollectionFilter}
        onFilterChange={(id) => setSelectedCollectionFilter(id)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onEnquireProduct={(p) => {
          setPrefillProduct(p);
          scrollToSection('contact');
        }}
      />

      {/* 5. Interactive 3D Showroom (Section 10: "Step Inside The Alabbas Experience") */}
      <section id="showroom-3d" className="py-24 bg-[#140D0A] text-[#F7F3ED] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
                INTERACTIVE SHOWROOM
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F7F3ED]">
              Step Inside the Alabbas Experience.
            </h2>

            <p className="mt-4 text-base text-[#E8D8C2]/80 font-light max-w-xl mx-auto">
              Explore furniture in a space designed to inspire your next room. Drag to orbit the scene and click glowing markers to inspect pieces in 3D.
            </p>
          </div>

          <InteractiveShowroom3D
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        </div>
      </section>

      {/* 6. Why Choose Us (6 feature cards) */}
      <WhyChooseUs />

      {/* 7. Statistics Section (Animated Counters) */}
      <StatisticsSection items={statistics} />

      {/* 8. Furniture Guidance (Interactive questionnaire) */}
      <FurnitureGuidance />

      {/* 9. Gallery Section (Filterable Masonry + Lightbox) */}
      <GallerySection items={gallery} />

      {/* 10. Testimonials (Stories from Homes) */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 11. Process Section (01 to 04 Timeline) */}
      <ProcessSection />

      {/* 12. Showroom Section (Mandi Bahauddin location, hours, WhatsApp) */}
      <ShowroomSection
        brand={brand}
        onBookConsultation={() => scrollToSection('contact')}
      />

      {/* 13. FAQ Section (Accordion) */}
      <FaqSection items={faqs} />

      {/* 14. Dramatic CTA */}
      <DramaticCta
        brand={brand}
        onVisitShowroom={() => scrollToSection('showroom')}
        onContact={() => scrollToSection('contact')}
      />

      {/* 15. Contact Section (Direct Message Form) */}
      <ContactSection
        brand={brand}
        prefillProduct={prefillProduct}
      />

      {/* 16. Footer (NO admin link on public site!) */}
      <Footer brand={brand} />

      {/* Modal: Product Details & 3D Viewer */}
      <ProductDetailModal
        product={selectedProduct}
        brand={brand}
        onClose={() => setSelectedProduct(null)}
        onOpenInquiry={(p) => {
          setPrefillProduct(p);
          scrollToSection('contact');
        }}
      />

      {/* Modal: Secret Admin Login (TOTP 2FA) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
