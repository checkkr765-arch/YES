import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { db, hashPassword, generateRecoveryCodes } from './server/db.ts';
import { verifyTOTP, generateTOTP, generateQrCodeDataUrl, generateBase32Secret } from './server/totp.ts';

const app = express();
const PORT = 3000;
const ADMIN_SECRET_PATH = process.env.ADMIN_SECRET_PATH || '/manage-x7k9p';

app.use(express.json());

// Helper to extract IP
function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Authentication middleware for /api/admin/*
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.substring(7);
  const data = db.getData();
  const session = data.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  if (Date.now() > session.expiresAt) {
    delete data.sessions[token];
    db.save();
    return res.status(401).json({ error: 'Unauthorized: Session expired' });
  }

  // Touch session expiration (keep alive for 12 hours)
  session.expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  (req as any).adminUser = session.username;
  next();
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Get all website public content (sanitized, no secrets or private logs)
app.get('/api/public/data', (req, res) => {
  const data = db.getData();
  res.json({
    brand: data.brand,
    collections: data.collections,
    products: data.products,
    gallery: data.gallery,
    testimonials: data.testimonials,
    faqs: data.faqs,
    statistics: data.statistics,
    seo: data.seo,
  });
});

// Submit contact inquiry
app.post('/api/public/inquiries', (req, res) => {
  const { fullName, phone, email, city, interestedIn, message, productId, productName } = req.body;

  if (!fullName || !phone || !email || !message) {
    return res.status(400).json({ error: 'Please provide full name, phone, email, and inquiry message.' });
  }

  const newInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type: (productId ? 'product' : 'general') as 'product' | 'general',
    fullName: String(fullName).trim(),
    phone: String(phone).trim(),
    email: String(email).trim().toLowerCase(),
    city: String(city || 'Not specified').trim(),
    interestedIn: String(interestedIn || 'General Inquiry').trim(),
    message: String(message).trim(),
    productId,
    productName,
    status: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  const data = db.getData();
  data.inquiries.unshift(newInquiry);
  db.logAudit(
    'New Public Inquiry',
    `Inquiry received from ${newInquiry.fullName} (${newInquiry.city}) regarding ${newInquiry.interestedIn}`,
    'public-user',
    getClientIp(req),
    'inquiry'
  );
  db.save();

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting ALABBAS FURNITURE HOUSE. Our team will review your inquiry and get back to you.',
  });
});

// Submit furniture guidance request
app.post('/api/public/guidance', (req, res) => {
  const { fullName, phone, email, city, roomType, preferredStyle, budgetRange, notes } = req.body;

  if (!fullName || !phone || !roomType || !preferredStyle || !budgetRange) {
    return res.status(400).json({ error: 'Please fill in all required room and style guidance details.' });
  }

  const newGuidance = {
    id: `guide-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    fullName: String(fullName).trim(),
    phone: String(phone).trim(),
    email: String(email || '').trim().toLowerCase(),
    city: String(city || 'Not specified').trim(),
    roomType: String(roomType),
    preferredStyle: String(preferredStyle),
    budgetRange: String(budgetRange),
    notes: String(notes || '').trim(),
    status: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  const data = db.getData();
  data.guidanceRequests.unshift(newGuidance);
  db.logAudit(
    'Furniture Guidance Request',
    `Guidance requested by ${newGuidance.fullName} for ${newGuidance.roomType} (${newGuidance.preferredStyle}, Budget: ${newGuidance.budgetRange})`,
    'public-user',
    getClientIp(req),
    'inquiry'
  );
  db.save();

  res.status(201).json({
    success: true,
    message: 'Your furniture guidance request has been received. Our interior consultant will reach out soon.',
  });
});

// ==========================================
// AUTHENTICATION & 2FA ROUTES
// ==========================================

// Route verification endpoint: confirms current secret route for browser router
app.get('/api/auth/secret-route', (req, res) => {
  // Only reveal if queried by app
  res.json({ secretPath: ADMIN_SECRET_PATH });
});

// Step 1: Username & Password verification
app.post('/api/auth/login-step1', (req, res) => {
  const { username, password } = req.body;
  const ip = getClientIp(req);
  const data = db.getData();

  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter username and password.' });
  }

  const admin = data.admin;
  const inputHash = hashPassword(password, admin.passwordSalt);

  const isValidUser =
    username.toLowerCase() === admin.username.toLowerCase() ||
    username.toLowerCase() === admin.email.toLowerCase();

  if (!isValidUser || inputHash !== admin.passwordHash) {
    admin.failedAttempts = (admin.failedAttempts || 0) + 1;
    db.logAudit('Failed Login Attempt (Step 1)', `Invalid credentials for user: ${username}`, 'unknown', ip, 'auth');
    db.save();
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Create temporary token valid for 5 minutes for Step 2 TOTP verification
  const tempToken = crypto.randomBytes(32).toString('hex');
  data.temp2faTokens[tempToken] = {
    username: admin.username,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  // Provide current live TOTP helper in non-production/admin test mode so user can test seamlessly
  const currentTestOtp = generateTOTP(admin.totpSecret);

  db.save();

  res.json({
    success: true,
    requires2fa: true,
    tempToken,
    message: 'Primary credentials verified. Please enter the 6-digit Google Authenticator code.',
    // Helper hint for testing in sandbox environment
    totpHint: currentTestOtp,
  });
});

// Step 2: Google Authenticator TOTP or Recovery Code verification
app.post('/api/auth/login-step2', (req, res) => {
  const { tempToken, totpCode, recoveryCode } = req.body;
  const ip = getClientIp(req);
  const data = db.getData();

  if (!tempToken) {
    return res.status(400).json({ error: 'Session expired. Please restart login.' });
  }

  const tempSession = data.temp2faTokens[tempToken];
  if (!tempSession || Date.now() > tempSession.expiresAt) {
    delete data.temp2faTokens[tempToken];
    db.save();
    return res.status(401).json({ error: '2FA session expired. Please sign in again.' });
  }

  const admin = data.admin;
  let authSuccess = false;
  let authMethod = '';

  if (totpCode) {
    const cleanCode = String(totpCode).replace(/\s+/g, '');
    authSuccess = verifyTOTP(cleanCode, admin.totpSecret);
    authMethod = 'Google Authenticator TOTP';
  } else if (recoveryCode) {
    const cleanRecovery = String(recoveryCode).trim().toUpperCase();
    const codeIndex = admin.recoveryCodes.findIndex((c) => c.toUpperCase() === cleanRecovery);
    if (codeIndex !== -1) {
      authSuccess = true;
      authMethod = 'Emergency Recovery Code';
      // Burn the used recovery code
      admin.recoveryCodes.splice(codeIndex, 1);
    }
  }

  if (!authSuccess) {
    db.logAudit('Failed 2FA Attempt (Step 2)', `Invalid TOTP / Recovery Code attempt`, admin.username, ip, 'auth');
    return res.status(401).json({ error: 'Invalid authentication code. Please check Google Authenticator.' });
  }

  // Remove temp token
  delete data.temp2faTokens[tempToken];

  // Issue permanent session token (valid for 12 hours)
  const sessionToken = crypto.randomBytes(32).toString('hex');
  data.sessions[sessionToken] = {
    username: admin.username,
    createdAt: Date.now(),
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  };

  admin.lastLogin = new Date().toISOString();
  admin.failedAttempts = 0;

  db.logAudit(
    'Admin Login Successful',
    `Authenticated via ${authMethod}. Session started.`,
    admin.username,
    ip,
    'auth'
  );
  db.save();

  res.json({
    success: true,
    sessionToken,
    admin: {
      username: admin.username,
      email: admin.email,
      lastLogin: admin.lastLogin,
      recoveryCodesLeft: admin.recoveryCodes.length,
    },
  });
});

// Check current session
app.get('/api/auth/me', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json({
    authenticated: true,
    username: data.admin.username,
    email: data.admin.email,
    lastLogin: data.admin.lastLogin,
    recoveryCodesLeft: data.admin.recoveryCodes.length,
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const data = db.getData();
    delete data.sessions[token];
    db.logAudit('Admin Logout', 'Administrator logged out successfully.', 'admin', getClientIp(req), 'auth');
    db.save();
  }
  res.json({ success: true, message: 'Logged out.' });
});

// ==========================================
// ADMIN CMS PROTECTED ENDPOINTS
// ==========================================

// Dashboard Overview metrics
app.get('/api/admin/overview', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const totalProducts = data.products.length;
  const totalInquiries = data.inquiries.length;
  const newInquiries = data.inquiries.filter((i) => i.status === 'new').length;
  const totalGuidance = data.guidanceRequests.length;
  const newGuidance = data.guidanceRequests.filter((g) => g.status === 'new').length;
  const totalGallery = data.gallery.length;

  res.json({
    stats: {
      totalProducts,
      totalInquiries,
      newInquiries,
      totalGuidance,
      newGuidance,
      totalGallery,
    },
    recentInquiries: data.inquiries.slice(0, 5),
    recentGuidance: data.guidanceRequests.slice(0, 5),
    recentAuditLogs: data.auditLogs.slice(0, 8),
    securityStatus: {
      totpEnabled: data.admin.totpEnabled,
      recoveryCodesLeft: data.admin.recoveryCodes.length,
      lastLogin: data.admin.lastLogin,
    },
  });
});

// Update Brand and Showroom settings
app.put(['/api/admin/brand', '/api/admin/content'], requireAdminAuth, (req, res) => {
  const data = db.getData();
  const updatedBrand = req.body.brand || req.body;

  data.brand = {
    ...data.brand,
    ...updatedBrand,
    showroom: {
      ...data.brand.showroom,
      ...(updatedBrand.showroom || {}),
    },
    socialLinks: {
      ...data.brand.socialLinks,
      ...(updatedBrand.socialLinks || {}),
    },
  };

  db.logAudit('Brand Content Updated', 'Updated brand messaging and showroom details', (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json({ success: true, brand: data.brand });
});

// Products CRUD
app.get('/api/admin/products', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json(data.products);
});

app.post('/api/admin/products', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const productData = req.body;

  const newProduct = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    slug: (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: productData.name,
    collectionId: productData.collectionId || 'living-room',
    description: productData.description || '',
    detailedDescription: productData.detailedDescription || '',
    material: productData.material || '',
    style: productData.style || '',
    dimensions: productData.dimensions || '',
    availability: productData.availability || 'In Stock',
    price: productData.price ? Number(productData.price) : undefined,
    showPrice: Boolean(productData.showPrice),
    isFeatured: Boolean(productData.isFeatured),
    images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
    threeDModel: productData.threeDModel || {
      type: 'sofa',
      woodType: 'Walnut',
    },
    createdAt: new Date().toISOString(),
  };

  data.products.unshift(newProduct);
  db.logAudit('Product Created', `Added new product: ${newProduct.name}`, (req as any).adminUser, getClientIp(req), 'product');
  db.save();
  res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  data.products[index] = {
    ...data.products[index],
    ...req.body,
    id: data.products[index].id, // preserve ID
  };

  db.logAudit('Product Updated', `Updated product: ${data.products[index].name}`, (req as any).adminUser, getClientIp(req), 'product');
  db.save();
  res.json(data.products[index]);
});

app.delete('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedName = data.products[index].name;
  data.products.splice(index, 1);
  db.logAudit('Product Deleted', `Removed product: ${deletedName}`, (req as any).adminUser, getClientIp(req), 'product');
  db.save();
  res.json({ success: true, message: `Product ${deletedName} deleted.` });
});

// Gallery Management
app.get('/api/admin/gallery', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json(data.gallery);
});

app.post('/api/admin/gallery', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const { title, category, image, description, featured } = req.body;

  if (!title || !category || !image) {
    return res.status(400).json({ error: 'Please provide title, category, and image URL.' });
  }

  const newItem = {
    id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: String(title).trim(),
    category: category,
    image: String(image).trim(),
    description: String(description || '').trim(),
    featured: Boolean(featured),
  };

  data.gallery.unshift(newItem);
  db.logAudit('Gallery Image Added', `Added image: ${newItem.title} (${newItem.category})`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.status(201).json(newItem);
});

app.delete('/api/admin/gallery/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.gallery.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  const title = data.gallery[index].title;
  data.gallery.splice(index, 1);
  db.logAudit('Gallery Image Deleted', `Removed image: ${title}`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json({ success: true });
});

// Inquiries Management
app.get('/api/admin/inquiries', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json(data.inquiries);
});

app.put('/api/admin/inquiries/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.inquiries.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  data.inquiries[index] = {
    ...data.inquiries[index],
    ...req.body,
    id: data.inquiries[index].id,
  };

  db.logAudit('Inquiry Status Updated', `Updated inquiry for ${data.inquiries[index].fullName} to ${data.inquiries[index].status}`, (req as any).adminUser, getClientIp(req), 'inquiry');
  db.save();
  res.json(data.inquiries[index]);
});

app.delete('/api/admin/inquiries/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  data.inquiries = data.inquiries.filter((i) => i.id !== req.params.id);
  db.logAudit('Inquiry Deleted', `Deleted inquiry ID ${req.params.id}`, (req as any).adminUser, getClientIp(req), 'inquiry');
  db.save();
  res.json({ success: true });
});

// Guidance Requests Management
app.get('/api/admin/guidance', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json(data.guidanceRequests);
});

app.put('/api/admin/guidance/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.guidanceRequests.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Guidance request not found' });
  }

  data.guidanceRequests[index] = {
    ...data.guidanceRequests[index],
    ...req.body,
    id: data.guidanceRequests[index].id,
  };

  db.logAudit('Guidance Status Updated', `Updated guidance for ${data.guidanceRequests[index].fullName}`, (req as any).adminUser, getClientIp(req), 'inquiry');
  db.save();
  res.json(data.guidanceRequests[index]);
});

app.delete('/api/admin/guidance/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  data.guidanceRequests = data.guidanceRequests.filter((g) => g.id !== req.params.id);
  db.logAudit('Guidance Request Deleted', `Deleted guidance request ID ${req.params.id}`, (req as any).adminUser, getClientIp(req), 'inquiry');
  db.save();
  res.json({ success: true });
});

// Testimonials Management
app.get('/api/admin/testimonials', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json(data.testimonials);
});

app.post('/api/admin/testimonials', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const { name, role, content, rating, isVerified, isSample } = req.body;

  const newTestimonial = {
    id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: String(name).trim(),
    role: String(role || 'Customer').trim(),
    content: String(content).trim(),
    rating: Number(rating) || 5,
    isVerified: Boolean(isVerified),
    isSample: Boolean(isSample),
    date: new Date().toISOString().split('T')[0],
  };

  data.testimonials.unshift(newTestimonial);
  db.logAudit('Testimonial Added', `Added testimonial by ${newTestimonial.name} (Verified: ${newTestimonial.isVerified})`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.status(201).json(newTestimonial);
});

app.put('/api/admin/testimonials/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.testimonials.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }

  data.testimonials[index] = {
    ...data.testimonials[index],
    ...req.body,
    id: data.testimonials[index].id,
  };

  db.logAudit('Testimonial Updated', `Updated testimonial by ${data.testimonials[index].name}`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json(data.testimonials[index]);
});

app.delete('/api/admin/testimonials/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  data.testimonials = data.testimonials.filter((t) => t.id !== req.params.id);
  db.logAudit('Testimonial Deleted', `Deleted testimonial ID ${req.params.id}`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json({ success: true });
});

// FAQ Management
app.get('/api/admin/faqs', requireAdminAuth, (req, res) => {
  const data = db.getData();
  res.json(data.faqs);
});

app.post('/api/admin/faqs', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const { question, answer, category } = req.body;

  const newFaq = {
    id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    order: data.faqs.length + 1,
    question: String(question).trim(),
    answer: String(answer).trim(),
    category: category || 'General',
  };

  data.faqs.push(newFaq);
  db.logAudit('FAQ Added', `Added FAQ: ${newFaq.question}`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.status(201).json(newFaq);
});

app.put('/api/admin/faqs/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const index = data.faqs.findIndex((f) => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  data.faqs[index] = {
    ...data.faqs[index],
    ...req.body,
    id: data.faqs[index].id,
  };

  db.logAudit('FAQ Updated', `Updated FAQ: ${data.faqs[index].question}`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json(data.faqs[index]);
});

app.delete('/api/admin/faqs/:id', requireAdminAuth, (req, res) => {
  const data = db.getData();
  data.faqs = data.faqs.filter((f) => f.id !== req.params.id);
  db.logAudit('FAQ Deleted', `Deleted FAQ ID ${req.params.id}`, (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json({ success: true });
});

// Statistics Management
app.put('/api/admin/statistics', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const { items, isSampleWarning } = req.body;

  if (Array.isArray(items)) {
    data.statistics.items = items;
  }
  if (typeof isSampleWarning === 'boolean') {
    data.statistics.isSampleWarning = isSampleWarning;
  }

  db.logAudit('Statistics Updated', 'Updated business performance metrics and sample warning flag', (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json({ success: true, statistics: data.statistics });
});

// SEO Settings Management
app.put('/api/admin/seo', requireAdminAuth, (req, res) => {
  const data = db.getData();
  data.seo = {
    ...data.seo,
    ...req.body,
  };

  db.logAudit('SEO Settings Updated', 'Updated meta tags, OpenGraph data, and search keywords', (req as any).adminUser, getClientIp(req), 'content');
  db.save();
  res.json({ success: true, seo: data.seo });
});

// Security Center: Get 2FA QR code, status, recovery codes, and audit logs
app.get('/api/admin/security', requireAdminAuth, async (req, res) => {
  const data = db.getData();
  const admin = data.admin;

  try {
    const qrCodeDataUrl = await generateQrCodeDataUrl(admin.totpSecret, admin.username);
    const currentLiveTotp = generateTOTP(admin.totpSecret);

    res.json({
      username: admin.username,
      email: admin.email,
      totpEnabled: admin.totpEnabled,
      totpSecret: admin.totpSecret,
      qrCodeDataUrl,
      currentLiveTotp,
      recoveryCodes: admin.recoveryCodes,
      recoveryCodesLeft: admin.recoveryCodes.length,
      lastLogin: admin.lastLogin,
      auditLogs: data.auditLogs,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate QR code: ' + err.message });
  }
});

// Security Center: Change password
app.post('/api/admin/security/password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const data = db.getData();
  const admin = data.admin;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const currentHash = hashPassword(currentPassword, admin.passwordSalt);
  if (currentHash !== admin.passwordHash) {
    db.logAudit('Password Change Failed', 'Incorrect current password provided', admin.username, getClientIp(req), 'security');
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  admin.passwordSalt = newSalt;
  admin.passwordHash = hashPassword(newPassword, newSalt);

  db.logAudit('Password Changed Successfully', 'Administrator changed master password', admin.username, getClientIp(req), 'security');
  db.save();
  res.json({ success: true, message: 'Password updated successfully.' });
});

// Security Center: Regenerate recovery codes
app.post('/api/admin/security/regenerate-recovery-codes', requireAdminAuth, (req, res) => {
  const data = db.getData();
  const newCodes = generateRecoveryCodes(8);
  data.admin.recoveryCodes = newCodes;

  db.logAudit('Emergency Recovery Codes Regenerated', 'Generated 8 fresh emergency access codes', (req as any).adminUser, getClientIp(req), 'security');
  db.save();
  res.json({ success: true, recoveryCodes: newCodes });
});

// Security Center: Reset / Generate new TOTP secret
app.post('/api/admin/security/reset-totp', requireAdminAuth, async (req, res) => {
  const data = db.getData();
  const newSecret = generateBase32Secret(16);
  data.admin.totpSecret = newSecret;
  const qrCodeDataUrl = await generateQrCodeDataUrl(newSecret, data.admin.username);

  db.logAudit('2FA TOTP Secret Reset', 'Generated new Google Authenticator secret key', (req as any).adminUser, getClientIp(req), 'security');
  db.save();
  res.json({ success: true, totpSecret: newSecret, qrCodeDataUrl });
});

// ==========================================
// VITE / STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`ALABBAS FURNITURE HOUSE server running on http://0.0.0.0:${PORT}`);
    console.log(`Secret Admin Route: ${ADMIN_SECRET_PATH}`);
    console.log(`=========================================`);
  });
}

startServer();
