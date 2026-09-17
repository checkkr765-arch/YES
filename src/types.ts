export interface Product {
  id: string;
  name: string;
  slug: string;
  collectionId: string; // 'living-room' | 'bedroom' | 'dining' | 'home-decor'
  description: string;
  detailedDescription?: string;
  material: string;
  style: string;
  dimensions: string;
  availability: 'In Stock' | 'Made to Order' | 'Showroom Exclusive' | 'Out of Stock';
  price?: number;
  showPrice: boolean;
  isFeatured: boolean;
  images: string[];
  threeDModel?: {
    type: 'sofa' | 'dining-table' | 'bed' | 'chair' | 'console' | 'coffee-table';
    colorScheme?: string;
    woodType?: 'Walnut' | 'Oak' | 'Teak' | 'Espresso';
  };
  createdAt: string;
}

export interface Collection {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  featuredProducts: string[];
  productCount?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isVerified: boolean;
  isSample: boolean;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Living Rooms' | 'Bedrooms' | 'Dining Spaces' | 'Furniture Details' | 'Showroom' | 'Wood Craftsmanship';
  image: string;
  description?: string;
  featured?: boolean;
}

export interface StatisticItem {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  description?: string;
}

export interface BrandSettings {
  name: string;
  primaryTagline: string;
  secondaryTagline: string;
  aboutStoryEyebrow: string;
  aboutStoryHeadline: string;
  aboutStoryParagraphs: string[];
  showroom: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    whatsapp: string;
    email: string;
    ownerName?: string;
    ownerRole?: string;
    hours?: string;
    hoursWeekday: string;
    hoursFriday?: string;
    hoursSunday: string;
    mapCoordinates?: { lat: number; lng: number };
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
}

export interface Inquiry {
  id: string;
  type: 'general' | 'product';
  fullName: string;
  phone: string;
  email: string;
  city: string;
  interestedIn: string;
  message: string;
  productId?: string;
  productName?: string;
  status: 'new' | 'in-progress' | 'contacted' | 'resolved';
  internalNotes?: string;
  createdAt: string;
}

export interface GuidanceRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  roomType: string;
  preferredStyle: string;
  budgetRange: string;
  notes?: string;
  status: 'new' | 'reviewed' | 'scheduled' | 'completed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  actor: string;
  ip: string;
  timestamp: string;
  category: 'auth' | 'security' | 'product' | 'content' | 'inquiry';
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
}

export interface PublicWebsiteData {
  brand: BrandSettings;
  collections: Collection[];
  products: Product[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  statistics: {
    items: StatisticItem[];
    isSampleWarning: boolean;
  };
  seo: SeoConfig;
}
