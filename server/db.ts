import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { generateBase32Secret } from './totp.ts';
import type {
  Product,
  Collection,
  Testimonial,
  FaqItem,
  GalleryItem,
  StatisticItem,
  BrandSettings,
  Inquiry,
  GuidanceRequest,
  AuditLog,
  SeoConfig,
} from '../src/types.ts';

export interface AdminCredentials {
  username: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  totpSecret: string;
  totpEnabled: boolean;
  recoveryCodes: string[];
  lastLogin?: string;
  failedAttempts: number;
}

export interface DatabaseSchema {
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
  inquiries: Inquiry[];
  guidanceRequests: GuidanceRequest[];
  auditLogs: AuditLog[];
  seo: SeoConfig;
  admin: AdminCredentials;
  sessions: {
    [token: string]: {
      username: string;
      createdAt: number;
      expiresAt: number;
    };
  };
  temp2faTokens: {
    [tempToken: string]: {
      username: string;
      createdAt: number;
      expiresAt: number;
    };
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Password hash helper
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    codes.push(`AFH-${part1}-${part2}`);
  }
  return codes;
}

function getInitialData(): DatabaseSchema {
  const defaultSalt = 'alabbas_salt_928374';
  const defaultPasswordHash = hashPassword('Alabbas@2026!', defaultSalt);
  const defaultTotpSecret = 'JBSWY3DPEHPK3PXP'; // Base32 testable secret

  return {
    brand: {
      name: 'ALABBAS FURNITURE HOUSE',
      primaryTagline: 'Crafting Comfort. Defining Your Space.',
      secondaryTagline: 'Premium Furniture for Beautiful Living.',
      aboutStoryEyebrow: 'OUR STORY',
      aboutStoryHeadline: 'Furniture Made for the Way You Live.',
      aboutStoryParagraphs: [
        'At ALABBAS FURNITURE HOUSE, we believe furniture is more than something you place inside a room. It becomes part of your everyday life — the sofa where your family gathers, the dining table around which memories are created, and the bedroom where every day comes to an end.',
        'Our showroom brings together timeless designs, quality materials and practical comfort to help families create spaces they are proud to call home.',
        'From classic wooden craftsmanship to contemporary interiors, every piece is selected with an eye for durability, comfort and lasting style.',
      ],
      showroom: {
        name: 'ALABBAS FURNITURE HOUSE Showroom',
        address: 'Main Furniture Market',
        city: 'Mandi Bahauddin, Punjab',
        country: 'Pakistan',
        ownerName: 'Tahir Abbas',
        ownerRole: 'Showroom Owner & Founder',
        phone: '+92 300 0000000',
        whatsapp: '+92 300 0000000',
        email: 'info@alabbasfurniturehouse.com',
        hours: 'Monday – Sunday: 9:00 AM – 5:00 PM (Friday Closed)',
        hoursWeekday: 'Monday – Thursday & Saturday – Sunday: 9:00 AM – 5:00 PM',
        hoursFriday: 'Friday: Closed',
        hoursSunday: 'Sunday: 9:00 AM – 5:00 PM',
        mapCoordinates: { lat: 32.587, lng: 73.491 },
      },
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        tiktok: 'https://tiktok.com',
        whatsapp: 'https://wa.me/923000000000',
      },
    },
    collections: [
      {
        id: 'living-room',
        number: '01',
        title: 'LIVING ROOM',
        tagline: 'Make every gathering more comfortable.',
        description:
          'Make every gathering more comfortable with elegant sofa sets, coffee tables, TV consoles and statement seating designed for modern living.',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        featuredProducts: [
          'Luxury Sofa Sets',
          'Corner Sofas',
          'Center Tables',
          'TV Consoles',
          'Accent Chairs',
          'Side Tables',
        ],
        productCount: 18,
      },
      {
        id: 'bedroom',
        number: '02',
        title: 'BEDROOM',
        tagline: 'Create a calm and comfortable retreat.',
        description:
          'Create a calm and comfortable retreat with beautifully designed beds, wardrobes, dressing tables and bedroom essentials.',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        featuredProducts: [
          'King & Queen Beds',
          'Bedroom Sets',
          'Wardrobes',
          'Dressing Tables',
          'Bedside Tables',
        ],
        productCount: 14,
      },
      {
        id: 'dining',
        number: '03',
        title: 'DINING',
        tagline: 'Bring everyone together around craftsmanship.',
        description:
          'Bring everyone together around dining furniture that combines craftsmanship, comfort and timeless design.',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        featuredProducts: [
          'Dining Tables',
          'Dining Chairs',
          'Complete Dining Sets',
          'Console Tables',
        ],
        productCount: 12,
      },
      {
        id: 'home-decor',
        number: '04',
        title: 'HOME & DECOR',
        tagline: 'Complete your interior with personality.',
        description:
          'Complete your interior with carefully selected furniture and statement pieces that add personality to your space.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        featuredProducts: [
          'Accent Furniture',
          'Side Tables',
          'Shelving',
          'Decorative Pieces',
          'Interior Accessories',
        ],
        productCount: 16,
      },
    ],
    products: [
      {
        id: 'heritage-sofa',
        name: 'The Heritage Sofa',
        slug: 'the-heritage-sofa',
        collectionId: 'living-room',
        description:
          'Deep comfort meets timeless form. Designed with generous seating, refined upholstery and a warm contemporary silhouette.',
        detailedDescription:
          'Crafted with hand-selected solid seasoned hardwood, dual-density memory foam cushioning, and tailored stain-resistant premium woven fabric. Built for generational comfort and lasting living room warmth.',
        material: 'Premium upholstery + solid wood frame',
        style: 'Contemporary Classic',
        dimensions: '88"W x 38"D x 34"H',
        availability: 'In Stock',
        showPrice: false,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        ],
        threeDModel: {
          type: 'sofa',
          colorScheme: '#3A2418',
          woodType: 'Walnut',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'royal-oak-dining-set',
        name: 'The Royal Oak Dining Set',
        slug: 'the-royal-oak-dining-set',
        collectionId: 'dining',
        description:
          'A sophisticated dining collection designed to bring family and guests together around timeless natural textures.',
        detailedDescription:
          'Solid hand-finished timber featuring beveled chamfer edges, artisanal mortise and tenon joinery, accompanied by 8 cushioned ergonomic chairs upholstered in neutral luxury fabric.',
        material: 'Solid wood + premium finish',
        style: 'Modern Traditional',
        dimensions: 'Table: 84"L x 40"W x 30"H',
        availability: 'Made to Order',
        showPrice: false,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
        ],
        threeDModel: {
          type: 'dining-table',
          colorScheme: '#24211F',
          woodType: 'Oak',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'comfort-king-bed',
        name: 'The Comfort King Bed',
        slug: 'the-comfort-king-bed',
        collectionId: 'bedroom',
        description:
          'An elegant centerpiece for the bedroom, combining generous proportions, refined detailing and everyday comfort.',
        detailedDescription:
          'Features a padded winged headboard in ivory tactile boucle, floating solid walnut base perimeter, and internal sound-dampened heavy-duty wooden slat foundation.',
        material: 'Premium wood + upholstered detailing',
        style: 'Contemporary Luxury',
        dimensions: 'King: 82"W x 88"L x 54"H',
        availability: 'In Stock',
        showPrice: false,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
        ],
        threeDModel: {
          type: 'bed',
          colorScheme: '#E8D8C2',
          woodType: 'Walnut',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'modern-lounge-chair',
        name: 'The Modern Lounge Chair',
        slug: 'the-modern-lounge-chair',
        collectionId: 'living-room',
        description:
          'A statement chair designed for reading, relaxing and adding character to a quiet corner.',
        detailedDescription:
          'Sculptural curved arms sculpted from natural walnut wood with premium high-resilience foam and brushed gold hardware accent foot caps.',
        material: 'Upholstery + hardwood frame',
        style: 'Modern Minimal',
        dimensions: '32"W x 34"D x 36"H',
        availability: 'In Stock',
        showPrice: false,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
        ],
        threeDModel: {
          type: 'chair',
          colorScheme: '#C5A46D',
          woodType: 'Teak',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'signature-tv-console',
        name: 'The Signature TV Console',
        slug: 'the-signature-tv-console',
        collectionId: 'living-room',
        description:
          'Clean lines, warm wood tones and practical storage come together in a refined centerpiece for modern living rooms.',
        detailedDescription:
          'Includes soft-close fluted tambour sliding panels, concealed wire routing channels, and generous interior shelving for multimedia consoles.',
        material: 'Engineered wood + premium finish',
        style: 'Contemporary',
        dimensions: '76"W x 18"D x 24"H',
        availability: 'In Stock',
        showPrice: false,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
        ],
        threeDModel: {
          type: 'console',
          colorScheme: '#3A2418',
          woodType: 'Walnut',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sculptural-coffee-table',
        name: 'The Alabbas Artisan Coffee Table',
        slug: 'the-artisan-coffee-table',
        collectionId: 'living-room',
        description: 'Natural textures with a modern silhouette and organic edge finishing.',
        detailedDescription: 'Solid walnut organic shape coffee table with curved edge details and matte water-resistant protective sealant.',
        material: 'Solid walnut timber',
        style: 'Contemporary Minimalist',
        dimensions: '48"L x 28"W x 16"H',
        availability: 'In Stock',
        showPrice: false,
        isFeatured: false,
        images: [
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
        ],
        threeDModel: {
          type: 'coffee-table',
          colorScheme: '#3A2418',
          woodType: 'Walnut',
        },
        createdAt: new Date().toISOString(),
      },
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Master Living Space Architecture',
        category: 'Living Rooms',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        description: 'Warm walnut wall panels and signature sectional arrangement.',
        featured: true,
      },
      {
        id: 'gal-2',
        title: 'Hand-Carved Dining Suite',
        category: 'Dining Spaces',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        description: 'Artisanal joinery in natural oak for grand family gatherings.',
        featured: true,
      },
      {
        id: 'gal-3',
        title: 'Serene Sanctuary Bedroom',
        category: 'Bedrooms',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        description: 'Boucle upholstered king suite with ambient reading lights.',
        featured: true,
      },
      {
        id: 'gal-4',
        title: 'Artisan Wood Craftsmanship',
        category: 'Wood Craftsmanship',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        description: 'Master woodworkers finishing seasoned rosewood joints.',
        featured: false,
      },
      {
        id: 'gal-5',
        title: 'Flagship Showroom Floor',
        category: 'Showroom',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        description: 'Mandi Bahauddin experience center curated galleries.',
        featured: true,
      },
      {
        id: 'gal-6',
        title: 'Bespoke Tambour Fluting Details',
        category: 'Furniture Details',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        description: 'Precision ribbed detailing on luxury TV console facades.',
        featured: false,
      },
    ],
    testimonials: [
      {
        id: 't-1',
        name: 'Ahmed R.',
        role: 'Customer',
        content:
          'From choosing our living room set to arranging delivery, the entire experience felt smooth and professional. The furniture looks beautiful in our home.',
        rating: 5,
        isVerified: false,
        isSample: true,
        date: '2026-03-10',
      },
      {
        id: 't-2',
        name: 'Sana M.',
        role: 'Customer',
        content:
          'We wanted a dining set that felt elegant but practical for a family. The team helped us choose exactly what suited our space.',
        rating: 5,
        isVerified: false,
        isSample: true,
        date: '2026-04-14',
      },
      {
        id: 't-3',
        name: 'Hamza K.',
        role: 'Customer',
        content:
          'The quality, finishing and comfort exceeded our expectations. Our new bedroom set completely changed the feel of the room.',
        rating: 5,
        isVerified: false,
        isSample: true,
        date: '2026-05-22',
      },
    ],
    faqs: [
      {
        id: 'faq-1',
        order: 1,
        question: 'Do you offer delivery?',
        answer:
          'Delivery availability depends on the product, destination and order requirements. Contact our team to confirm delivery options for your location.',
      },
      {
        id: 'faq-2',
        order: 2,
        question: 'Can I visit the showroom before purchasing?',
        answer:
          'Absolutely. We encourage customers to visit the showroom to experience the furniture, comfort, finishing and available designs in person.',
      },
      {
        id: 'faq-3',
        order: 3,
        question: 'Do you offer different furniture designs?',
        answer:
          'Our collection includes contemporary, classic, traditional and modern-inspired furniture styles. Availability can vary by product.',
      },
      {
        id: 'faq-4',
        order: 4,
        question: 'Can I request furniture guidance?',
        answer:
          'Yes. Tell us about your room, preferred style and requirements, and our team can help you explore suitable options.',
      },
      {
        id: 'faq-5',
        order: 5,
        question: 'Do you provide custom furniture?',
        answer:
          'Customisation options depend on the specific product and current workshop capabilities. Contact us with your requirements so we can confirm what is possible.',
      },
      {
        id: 'faq-6',
        order: 6,
        question: 'How can I place an order?',
        answer:
          'You can visit the showroom or contact our team through phone or WhatsApp to discuss product availability, pricing and ordering.',
      },
      {
        id: 'faq-7',
        order: 7,
        question: 'What payment methods do you accept?',
        answer:
          'Available payment methods may vary. Contact our team for the latest payment options and order terms.',
      },
    ],
    statistics: {
      items: [
        {
          id: 'stat-1',
          label: 'Years of Furniture Experience',
          value: '12+',
          numericValue: 12,
          suffix: '+',
          description: 'Dedicated craftsmanship since founding',
        },
        {
          id: 'stat-2',
          label: 'Happy Customers',
          value: '3,500+',
          numericValue: 3500,
          suffix: '+',
          description: 'Homes elevated across Pakistan',
        },
        {
          id: 'stat-3',
          label: 'Furniture Pieces Delivered',
          value: '1,200+',
          numericValue: 1200,
          suffix: '+',
          description: 'Carefully installed with precision',
        },
        {
          id: 'stat-4',
          label: 'Customer Satisfaction',
          value: '98%',
          numericValue: 98,
          suffix: '%',
          description: 'Enduring client trust and loyalty',
        },
      ],
      isSampleWarning: true,
    },
    inquiries: [
      {
        id: 'inq-init-1',
        type: 'general',
        fullName: 'Zubair Tariq',
        phone: '+92 301 5551234',
        email: 'zubair.t@example.com',
        city: 'Lahore',
        interestedIn: 'Living Room',
        message: 'Interested in a 7-seater custom configuration of the Heritage Sofa in walnut finish.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    guidanceRequests: [
      {
        id: 'guide-init-1',
        fullName: 'Ayesha Malik',
        phone: '+92 321 8887766',
        email: 'ayesha.m@example.com',
        city: 'Islamabad',
        roomType: 'Complete Home',
        preferredStyle: 'Modern Luxury',
        budgetRange: 'PKR 500,000+',
        notes: 'Moving into a new 1-kanal home and need cohesive living and dining spaces.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    auditLogs: [
      {
        id: 'log-1',
        action: 'System Initialization',
        details: 'ALABBAS FURNITURE HOUSE database initialized with secure 2FA TOTP.',
        actor: 'system',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
        category: 'security',
      },
    ],
    seo: {
      metaTitle: 'ALABBAS FURNITURE HOUSE | Crafting Comfort. Defining Your Space.',
      metaDescription:
        'Premium furniture showroom in Pakistan offering handcrafted luxury furniture, interactive 3D showroom, signature collections, and interior guidance.',
      keywords:
        'furniture showroom pakistan, mandi bahauddin furniture, luxury sofa sets, king size beds, solid wood dining tables, 3d furniture showroom',
      ogTitle: 'ALABBAS FURNITURE HOUSE | Crafting Comfort. Defining Your Space.',
      ogDescription:
        'Discover beautifully crafted furniture designed to bring comfort, character and lasting elegance to every room.',
      canonicalUrl: 'https://alabbasfurniturehouse.com',
    },
    admin: {
      username: 'admin',
      email: 'admin@alabbasfurniturehouse.com',
      passwordHash: defaultPasswordHash,
      passwordSalt: defaultSalt,
      totpSecret: defaultTotpSecret,
      totpEnabled: true,
      recoveryCodes: generateRecoveryCodes(8),
      failedAttempts: 0,
    },
    sessions: {},
    temp2faTokens: {},
  };
}

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required top-level keys exist
        const initial = getInitialData();
        return {
          ...initial,
          ...parsed,
          admin: {
            ...initial.admin,
            ...(parsed.admin || {}),
          },
        };
      }
    } catch (err) {
      console.error('Error loading DB file, fallback to initial data:', err);
    }
    const initial = getInitialData();
    this.persistSync(initial);
    return initial;
  }

  private persistSync(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistSync(this.data);
      this.saveTimeout = null;
    }, 150);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public logAudit(action: string, details: string, actor = 'admin', ip = '127.0.0.1', category: AuditLog['category'] = 'content') {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      details,
      actor,
      ip,
      timestamp: new Date().toISOString(),
      category,
    };
    this.data.auditLogs.unshift(log);
    // Keep last 300 logs
    if (this.data.auditLogs.length > 300) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 300);
    }
    this.save();
  }
}

export const db = new Database();
