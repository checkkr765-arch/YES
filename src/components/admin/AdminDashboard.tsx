import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  Package,
  Inbox,
  FileText,
  Image as ImageIcon,
  Key,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  QrCode,
  AlertCircle,
  HelpCircle,
  Loader2,
  Save,
} from 'lucide-react';
import type {
  Product,
  Collection,
  Inquiry,
  GuidanceRequest,
  GalleryItem,
  BrandSettings,
  AuditLog,
  FaqItem,
} from '../../types.ts';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onViewPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'inquiries' | 'guidance' | 'content' | 'gallery' | 'security'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // CMS State
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [guidanceRequests, setGuidanceRequests] = useState<GuidanceRequest[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [brand, setBrand] = useState<BrandSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [securityStatus, setSecurityStatus] = useState<any>(null);

  // Modals & Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'Living Rooms',
    image: '',
    description: '',
  });

  // Password & Security State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [secretPathInput, setSecretPathInput] = useState('');
  const [new2FAData, setNew2FAData] = useState<{ qrCode: string; manualKey: string; recoveryCodes: string[] } | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Fetch all admin data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [pRes, inqRes, guideRes, galRes, setRes, secRes] = await Promise.all([
        fetch('/api/public/data'),
        fetch('/api/admin/inquiries', { headers }),
        fetch('/api/admin/guidance', { headers }),
        fetch('/api/public/data'),
        fetch('/api/public/data'),
        fetch('/api/admin/security/status', { headers }),
      ]);

      if (inqRes.status === 401 || secRes.status === 401) {
        onLogout();
        return;
      }

      const pData = await pRes.json();
      setProducts(pData.products || []);
      setCollections(pData.collections || []);
      setGallery(pData.gallery || []);
      setBrand(pData.brand || null);
      setFaqs(pData.faqs || []);

      const inqData = await inqRes.json();
      setInquiries(inqData.inquiries || []);

      const guideData = await guideRes.json();
      setGuidanceRequests(guideData.guidanceRequests || []);

      const secData = await secRes.json();
      setSecurityStatus(secData);
      setAuditLogs(secData.auditLogs || []);
      setSecretPathInput(secData.secretPath || '/manage-x7k9p');

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard data');
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const isNew = !products.some((p) => p.id === editingProduct.id);
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) throw new Error('Failed to save product');

      setIsProductModalOpen(false);
      setEditingProduct(null);
      showNotification('Product saved successfully');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this furniture piece?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      showNotification('Product deleted');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Inquiry Status update
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'completed') => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      showNotification(`Inquiry updated to ${status}`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Guidance status update
  const handleUpdateGuidanceStatus = async (id: string, status: 'new' | 'contacted' | 'completed') => {
    try {
      const res = await fetch(`/api/admin/guidance/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      showNotification(`Guidance request updated to ${status}`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Content update
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ brand }),
      });
      if (!res.ok) throw new Error('Failed to save website content');
      showNotification('Website content updated successfully');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Gallery add
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.image) return;

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGalleryItem),
      });
      if (!res.ok) throw new Error('Failed to add gallery image');
      setNewGalleryItem({ title: '', category: 'Living Rooms', image: '', description: '' });
      showNotification('Gallery item added');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      showNotification('Gallery image removed');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Security actions
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/security/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setPasswordForm({ currentPassword: '', newPassword: '' });
      showNotification('Admin password updated successfully');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateSecretPath = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/security/path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ secretPath: secretPathInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update path');
      showNotification(`Secret route updated to ${data.secretPath}`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReset2FA = async () => {
    if (!confirm('Are you sure you want to reset your Google Authenticator 2FA secret?')) return;
    try {
      const res = await fetch('/api/admin/security/reset-2fa', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset 2FA');
      setNew2FAData({
        qrCode: data.qrCode,
        manualKey: data.manualKey,
        recoveryCodes: data.recoveryCodes,
      });
      showNotification('New 2FA QR code generated! Scan in Google Authenticator.');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const unreadInquiries = inquiries.filter((i) => i.status === 'new').length;
  const unreadGuidance = guidanceRequests.filter((g) => g.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F7F3ED] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#1E1410] border-b border-[#C5A46D]/20 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#3A2418] border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury font-bold tracking-wider text-sm text-[#F7F3ED]">
                ALABBAS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A46D] font-mono">
                CONTROL CMS
              </span>
            </div>
            <p className="text-[10px] text-[#E8D8C2]/60">Mandi Bahauddin • Secure 2FA Active</p>
          </div>
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A46D] text-[#1E1410] text-xs font-bold shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData()}
            disabled={refreshing}
            className="p-2 rounded-xl bg-[#281A13] text-[#E8D8C2] hover:text-[#C5A46D] border border-white/5 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onViewPublicSite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#281A13] hover:bg-[#3A2418] text-[#E8D8C2] text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-medium border border-red-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#1A110D] border-r border-[#C5A46D]/15 p-4 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {unreadInquiries > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadInquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('guidance')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'guidance'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4" />
              <span>Room Guidance</span>
            </div>
            {unreadGuidance > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#C5A46D] text-[#1E1410] text-[10px] font-bold">
                {unreadGuidance}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Website Content</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>Gallery ({gallery.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2]/70 hover:bg-[#281A13] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4" />
              <span>Security Center</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-[#C5A46D]" />
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
                      Showroom Operations Overview
                    </h2>
                    <p className="text-xs text-[#E8D8C2]/70 mt-1">
                      Real-time telemetry and management portal for ALABBAS FURNITURE HOUSE.
                    </p>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-lg">
                      <div className="flex items-center justify-between text-[#C5A46D] mb-2">
                        <Package className="w-5 h-5" />
                        <span className="text-[11px] font-mono uppercase tracking-wider">Catalogue</span>
                      </div>
                      <div className="text-3xl font-bold font-serif-luxury text-[#F7F3ED]">
                        {products.length}
                      </div>
                      <p className="text-xs text-[#E8D8C2]/60 mt-1">Active furniture items</p>
                    </div>

                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-lg">
                      <div className="flex items-center justify-between text-[#C5A46D] mb-2">
                        <Inbox className="w-5 h-5" />
                        <span className="text-[11px] font-mono uppercase tracking-wider">Inquiries</span>
                      </div>
                      <div className="text-3xl font-bold font-serif-luxury text-[#F7F3ED]">
                        {inquiries.length}
                      </div>
                      <p className="text-xs text-[#E8D8C2]/60 mt-1">
                        {unreadInquiries} pending review
                      </p>
                    </div>

                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-lg">
                      <div className="flex items-center justify-between text-[#C5A46D] mb-2">
                        <HelpCircle className="w-5 h-5" />
                        <span className="text-[11px] font-mono uppercase tracking-wider">Guidance</span>
                      </div>
                      <div className="text-3xl font-bold font-serif-luxury text-[#F7F3ED]">
                        {guidanceRequests.length}
                      </div>
                      <p className="text-xs text-[#E8D8C2]/60 mt-1">
                        {unreadGuidance} room requests
                      </p>
                    </div>

                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-lg">
                      <div className="flex items-center justify-between text-[#C5A46D] mb-2">
                        <Shield className="w-5 h-5" />
                        <span className="text-[11px] font-mono uppercase tracking-wider">Security</span>
                      </div>
                      <div className="text-3xl font-bold font-serif-luxury text-emerald-400">
                        2FA Active
                      </div>
                      <p className="text-xs text-[#E8D8C2]/60 mt-1">
                        {auditLogs.length} logged audit events
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: 'prod-' + Date.now(),
                          name: '',
                          slug: '',
                          description: '',
                          detailedDescription: '',
                          collectionId: 'living-room',
                          price: 150000,
                          showPrice: false,
                          availability: 'Ready in Showroom',
                          material: 'Solid Walnut & Hardwood',
                          style: 'Modern Luxury',
                          dimensions: "84\" W x 38\" D x 34\" H",
                          isFeatured: false,
                          images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
                          threeDModel: { type: 'sofa', fileUrl: '' },
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C5A46D] text-[#1E1410] text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Furniture Piece</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#281A13] hover:bg-[#3A2418] text-[#E8D8C2] text-xs font-medium uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                    >
                      <Inbox className="w-4 h-4 text-[#C5A46D]" />
                      <span>Review Pending Inquiries ({unreadInquiries})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('security')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#281A13] hover:bg-[#3A2418] text-[#E8D8C2] text-xs font-medium uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-[#C5A46D]" />
                      <span>Security Settings &amp; Logs</span>
                    </button>
                  </div>

                  {/* Recent Inquiries List */}
                  <div className="bg-[#1E1410] rounded-2xl border border-[#C5A46D]/20 p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-luxury text-lg font-bold text-[#F7F3ED]">
                        Recent Customer Inquiries
                      </h3>
                      <button
                        onClick={() => setActiveTab('inquiries')}
                        className="text-xs text-[#C5A46D] hover:underline"
                      >
                        View all
                      </button>
                    </div>

                    {inquiries.length === 0 ? (
                      <p className="text-xs text-[#E8D8C2]/60 py-4">No inquiries logged yet.</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {inquiries.slice(0, 4).map((inq) => (
                          <div key={inq.id} className="py-3 flex items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#F7F3ED]">{inq.name}</span>
                                <span className="text-xs text-[#C5A46D]">({inq.city || 'Pakistan'})</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                    inq.status === 'new'
                                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                      : 'bg-emerald-500/20 text-emerald-300'
                                  }`}
                                >
                                  {inq.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#E8D8C2]/70 mt-1 line-clamp-1">{inq.message}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif-luxury text-2xl font-bold">Furniture Management</h2>
                      <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                        Add, modify pricing, upload photographs, and toggle 3D models.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: 'prod-' + Date.now(),
                          name: '',
                          slug: '',
                          description: '',
                          detailedDescription: '',
                          collectionId: 'living-room',
                          price: 180000,
                          showPrice: false,
                          availability: 'Ready in Showroom',
                          material: 'Seasoned Solid Hardwood',
                          style: 'Modern Classic',
                          dimensions: "80\" W x 36\" D x 32\" H",
                          isFeatured: false,
                          images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
                          threeDModel: { type: 'sofa', fileUrl: '' },
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C5A46D] text-[#1E1410] text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#E8D8C2]/50" />
                    <input
                      type="text"
                      placeholder="Search furniture by name, style, or material..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#1E1410] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#1E1410] rounded-2xl border border-[#C5A46D]/20 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#E8D8C2]">
                        <thead className="bg-[#281A13] text-[#C5A46D] uppercase tracking-wider font-semibold border-b border-white/5">
                          <tr>
                            <th className="p-4">Piece</th>
                            <th className="p-4">Collection</th>
                            <th className="p-4">Pricing</th>
                            <th className="p-4">Availability</th>
                            <th className="p-4">3D</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {products
                            .filter(
                              (p) =>
                                !searchQuery ||
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.material.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((p) => (
                              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={p.images[0]}
                                      alt=""
                                      className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                                    />
                                    <div>
                                      <p className="font-bold text-[#F7F3ED]">{p.name}</p>
                                      <p className="text-[11px] text-[#E8D8C2]/60">{p.style}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 capitalize">
                                  {p.collectionId.replace('-', ' ')}
                                </td>
                                <td className="p-4">
                                  {p.showPrice && p.price ? (
                                    <span className="font-bold text-[#F7F3ED]">
                                      PKR {p.price.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-[#C5A46D] italic">
                                      Inquiry Only
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 rounded-full bg-[#2A1B12] border border-[#C5A46D]/20 text-[10px]">
                                    {p.availability}
                                  </span>
                                </td>
                                <td className="p-4">
                                  {p.threeDModel ? (
                                    <span className="text-emerald-400 font-bold uppercase text-[10px]">
                                      ✓ {p.threeDModel.type}
                                    </span>
                                  ) : (
                                    <span className="text-[#E8D8C2]/40 text-[10px]">—</span>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingProduct(p);
                                        setIsProductModalOpen(true);
                                      }}
                                      className="p-2 rounded-lg bg-[#281A13] hover:bg-[#3A2418] text-[#C5A46D] transition-colors cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p.id)}
                                      className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 transition-colors cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold">Showroom Contact Inquiries</h2>
                    <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                      Messages received through the public contact form and product inquiry buttons.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-lg space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-[#F7F3ED]">{inq.name}</h3>
                              <span className="text-xs text-[#C5A46D] font-mono">
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-[#E8D8C2]/70">
                              Phone: <span className="text-[#F7F3ED] font-mono">{inq.phone}</span> • City: {inq.city || 'Not specified'} • Interest: {inq.interest}
                            </p>
                          </div>

                          {/* Status Pill & Select */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#E8D8C2]/60">Status:</span>
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="px-3 py-1 rounded-lg bg-[#281A13] border border-[#C5A46D]/30 text-xs text-[#F7F3ED] focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-[#140D0A] p-4 rounded-xl text-xs text-[#E8D8C2] leading-relaxed">
                          "{inq.message}"
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply via WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${inq.phone}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#281A13] text-[#F7F3ED] text-xs font-medium border border-white/10"
                          >
                            <span>Call Client</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ROOM GUIDANCE */}
              {activeTab === 'guidance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold">Room Guidance Requests</h2>
                    <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                      Submissions from visitors asking for tailored recommendations by room type and budget.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {guidanceRequests.map((g) => (
                      <div
                        key={g.id}
                        className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-lg space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-[#F7F3ED]">{g.fullName}</h3>
                              <span className="text-xs text-[#C5A46D] font-mono">
                                {new Date(g.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-[#E8D8C2]/70">
                              Phone: <span className="text-[#F7F3ED] font-mono">{g.phone}</span> • City: {g.city || 'Pakistan'}
                            </p>
                          </div>

                          <select
                            value={g.status}
                            onChange={(e) => handleUpdateGuidanceStatus(g.id, e.target.value as any)}
                            className="px-3 py-1 rounded-lg bg-[#281A13] border border-[#C5A46D]/30 text-xs text-[#F7F3ED] focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#140D0A] p-4 rounded-xl text-xs">
                          <div>
                            <span className="text-[#C5A46D] font-bold block uppercase tracking-wider text-[10px]">
                              Room Type
                            </span>
                            <span className="text-sm font-semibold">{g.roomType}</span>
                          </div>
                          <div>
                            <span className="text-[#C5A46D] font-bold block uppercase tracking-wider text-[10px]">
                              Preferred Style
                            </span>
                            <span className="text-sm font-semibold">{g.preferredStyle}</span>
                          </div>
                          <div>
                            <span className="text-[#C5A46D] font-bold block uppercase tracking-wider text-[10px]">
                              Budget Range
                            </span>
                            <span className="text-sm font-semibold text-emerald-400">{g.budgetRange}</span>
                          </div>
                        </div>

                        {g.notes && (
                          <p className="text-xs text-[#E8D8C2]/80 italic">
                            Notes: "{g.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <a
                            href={`https://wa.me/${g.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>WhatsApp Consultation</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: WEBSITE CONTENT */}
              {activeTab === 'content' && brand && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold">Website Content &amp; Showroom Info</h2>
                    <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                      Edit showroom contact details, hours, brand tagline, and story copy.
                    </p>
                  </div>

                  <form onSubmit={handleSaveContent} className="bg-[#1E1410] p-6 sm:p-8 rounded-2xl border border-[#C5A46D]/20 shadow-xl space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                          Brand Tagline
                        </label>
                        <input
                          type="text"
                          value={brand.tagline}
                          onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={brand.showroom.phone}
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              showroom: { ...brand.showroom, phone: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="text"
                          value={brand.showroom.whatsapp}
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              showroom: { ...brand.showroom, whatsapp: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                          Showroom Email
                        </label>
                        <input
                          type="email"
                          value={brand.showroom.email}
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              showroom: { ...brand.showroom, email: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                          Showroom Owner Name
                        </label>
                        <input
                          type="text"
                          value={brand.showroom.ownerName || 'Tahir Abbas'}
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              showroom: { ...brand.showroom, ownerName: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                          Owner Title / Role
                        </label>
                        <input
                          type="text"
                          value={brand.showroom.ownerRole || 'Showroom Owner & Founder'}
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              showroom: { ...brand.showroom, ownerRole: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                        Showroom Physical Address
                      </label>
                      <input
                        type="text"
                        value={brand.showroom.address}
                        onChange={(e) =>
                          setBrand({
                            ...brand,
                            showroom: { ...brand.showroom, address: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#C5A46D] mb-1">
                        Visiting Hours
                      </label>
                      <textarea
                        rows={2}
                        value={brand.showroom.hours}
                        onChange={(e) =>
                          setBrand({
                            ...brand,
                            showroom: { ...brand.showroom, hours: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C5A46D] text-[#1E1410] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Content Updates</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 6: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold">Gallery Management</h2>
                    <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                      Upload and manage interior showcase imagery and craft workshop snapshots.
                    </p>
                  </div>

                  {/* Add Image Form */}
                  <form onSubmit={handleAddGalleryItem} className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-xl space-y-4">
                    <h3 className="font-serif-luxury text-base font-bold text-[#F7F3ED]">
                      Add New Gallery Photograph
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Image Title"
                        value={newGalleryItem.title}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                      />
                      <select
                        value={newGalleryItem.category}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                      >
                        <option value="Living Rooms">Living Rooms</option>
                        <option value="Bedrooms">Bedrooms</option>
                        <option value="Dining Spaces">Dining Spaces</option>
                        <option value="Furniture Details">Furniture Details</option>
                        <option value="Showroom">Showroom</option>
                        <option value="Wood Craftsmanship">Wood Craftsmanship</option>
                      </select>
                      <input
                        type="url"
                        required
                        placeholder="Image URL (Unsplash or direct asset)"
                        value={newGalleryItem.image}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#C5A46D] text-[#1E1410] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Add Photo to Gallery
                    </button>
                  </form>

                  {/* Existing Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {gallery.map((g) => (
                      <div key={g.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#1E1410]">
                        <img src={g.image} alt={g.title} className="w-full h-40 object-cover" />
                        <div className="p-3">
                          <p className="font-bold text-xs text-[#F7F3ED] truncate">{g.title}</p>
                          <p className="text-[10px] text-[#C5A46D] uppercase">{g.category}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(g.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 text-white cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SECURITY CENTER */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold">Admin Security Center</h2>
                    <p className="text-xs text-[#E8D8C2]/70 mt-0.5">
                      Configure your secret entry route, Google Authenticator TOTP 2FA, recovery codes, and review audit logs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Secret Route Path Setting */}
                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-xl space-y-4">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#C5A46D]" />
                        <h3 className="font-serif-luxury text-lg font-bold">Secret Route Path</h3>
                      </div>
                      <p className="text-xs text-[#E8D8C2]/70">
                        The public website contains NO admin login links. Access the login modal only via your configured secret route or by pressing <kbd className="px-1.5 py-0.5 bg-[#281A13] border border-white/20 rounded font-mono text-[10px]">Ctrl+Shift+A</kbd>.
                      </p>
                      <form onSubmit={handleUpdateSecretPath} className="flex gap-2">
                        <input
                          type="text"
                          value={secretPathInput}
                          onChange={(e) => setSecretPathInput(e.target.value)}
                          placeholder="/manage-x7k9p"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs font-mono text-[#F7F3ED] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-[#C5A46D] text-[#1E1410] font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Update Path
                        </button>
                      </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-xl space-y-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-[#C5A46D]" />
                        <h3 className="font-serif-luxury text-lg font-bold">Change Password</h3>
                      </div>
                      <form onSubmit={handleChangePassword} className="space-y-3">
                        <input
                          type="password"
                          required
                          placeholder="Current Password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                        <input
                          type="password"
                          required
                          placeholder="New Password (min 8 characters)"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-xs text-[#F7F3ED] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#C5A46D] text-[#1E1410] font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>

                    {/* Google Authenticator TOTP & Recovery Codes */}
                    <div className="bg-[#1E1410] p-6 rounded-2xl border border-[#C5A46D]/20 shadow-xl space-y-4 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-[#C5A46D]" />
                          <h3 className="font-serif-luxury text-lg font-bold">Google Authenticator TOTP 2FA</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                          Enforced
                        </span>
                      </div>
                      <p className="text-xs text-[#E8D8C2]/70">
                        2FA is mandatory on this system. You can re-generate your QR code if you switch devices or lose access.
                      </p>

                      {new2FAData ? (
                        <div className="bg-[#281A13] p-6 rounded-2xl border border-[#C5A46D]/40 text-center space-y-4">
                          <p className="text-xs text-[#C5A46D] font-bold uppercase tracking-wider">
                            Scan New QR Code in Google Authenticator
                          </p>
                          <div className="bg-white p-2 rounded-xl inline-block shadow-md">
                            <img src={new2FAData.qrCode} alt="New QR" className="w-44 h-44" />
                          </div>
                          <p className="text-xs text-[#E8D8C2]/80 font-mono">
                            Manual Key: <span className="text-[#C5A46D] select-all">{new2FAData.manualKey}</span>
                          </p>
                          <div className="text-left bg-[#140D0A] p-4 rounded-xl text-xs space-y-2 max-w-md mx-auto">
                            <p className="text-[#C5A46D] font-bold uppercase tracking-wider">
                              New Backup Recovery Codes:
                            </p>
                            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                              {new2FAData.recoveryCodes.map((c, i) => (
                                <span key={i} className="bg-[#281A13] px-2 py-1 rounded">{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleReset2FA}
                          className="px-5 py-2.5 rounded-xl bg-[#281A13] hover:bg-[#3A2418] text-[#C5A46D] border border-[#C5A46D]/30 font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Generate New 2FA QR Code &amp; Recovery Codes
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Audit Logs */}
                  <div className="bg-[#1E1410] rounded-2xl border border-[#C5A46D]/20 p-6 shadow-xl space-y-4">
                    <h3 className="font-serif-luxury text-lg font-bold text-[#F7F3ED]">
                      System Audit &amp; Activity Log
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#E8D8C2]">
                        <thead className="bg-[#281A13] text-[#C5A46D] uppercase tracking-wider font-semibold border-b border-white/5">
                          <tr>
                            <th className="p-3">Timestamp</th>
                            <th className="p-3">Action</th>
                            <th className="p-3">IP Address</th>
                            <th className="p-3">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {auditLogs.slice(0, 15).map((log) => (
                            <tr key={log.id} className="hover:bg-white/[0.02]">
                              <td className="p-3 font-mono text-[11px] text-[#E8D8C2]/60">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="p-3 font-bold text-[#F7F3ED]">{log.action}</td>
                              <td className="p-3 font-mono text-[11px] text-[#C5A46D]">{log.ip}</td>
                              <td className="p-3 text-[11px] text-[#E8D8C2]/80">{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#1E1410] border border-[#C5A46D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F7F3ED] my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-luxury text-2xl font-bold mb-4">
              {products.some((p) => p.id === editingProduct.id) ? 'Edit Furniture Piece' : 'Add New Furniture Piece'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Collection</label>
                  <select
                    value={editingProduct.collectionId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, collectionId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  >
                    <option value="living-room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="dining">Dining</option>
                    <option value="home-decor">Home &amp; Decor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Show Price Publicly?</label>
                  <select
                    value={editingProduct.showPrice ? 'true' : 'false'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, showPrice: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  >
                    <option value="false">No (Enquire for Price)</option>
                    <option value="true">Yes (Display PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Availability</label>
                  <select
                    value={editingProduct.availability}
                    onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  >
                    <option value="Ready in Showroom">Ready in Showroom</option>
                    <option value="Made to Order">Made to Order</option>
                    <option value="Pre-Order">Pre-Order</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Style</label>
                  <input
                    type="text"
                    value={editingProduct.style}
                    onChange={(e) => setEditingProduct({ ...editingProduct, style: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Primary Material</label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editingProduct.dimensions}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#C5A46D] mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C5A46D] mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.images[0] || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      images: [e.target.value, ...editingProduct.images.slice(1)],
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#C5A46D] mb-1">3D Model Simulation</label>
                  <select
                    value={editingProduct.threeDModel?.type || 'none'}
                    onChange={(e) => {
                      if (e.target.value === 'none') {
                        setEditingProduct({ ...editingProduct, threeDModel: undefined });
                      } else {
                        setEditingProduct({
                          ...editingProduct,
                          threeDModel: { type: e.target.value as any, fileUrl: '' },
                        });
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-[#F7F3ED] focus:outline-none"
                  >
                    <option value="none">No 3D Model</option>
                    <option value="sofa">Sofa 3D Simulation</option>
                    <option value="chair">Accent Chair 3D Simulation</option>
                    <option value="bed">King Bed 3D Simulation</option>
                    <option value="dining-table">Dining Table 3D Simulation</option>
                    <option value="console">TV Console 3D Simulation</option>
                    <option value="coffee-table">Coffee Table 3D Simulation</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C5A46D]"
                  />
                  <label htmlFor="featuredCheckbox" className="font-semibold text-[#F7F3ED]">
                    Mark as Signature Feature
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-xs text-[#E8D8C2]/70 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C5A46D] text-[#1E1410] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
