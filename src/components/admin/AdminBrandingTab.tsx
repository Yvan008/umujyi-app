import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Eye,
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const AdminBrandingTab: React.FC = () => {
  const { businessSettings, updateBusinessSettings, showToast } = useStore();

  const [name, setName] = useState(businessSettings.name);
  const [tagline, setTagline] = useState(businessSettings.tagline);
  const [logoText, setLogoText] = useState(businessSettings.logoText);
  const [logoUrl, setLogoUrl] = useState(businessSettings.logoUrl || '');
  const [phone, setPhone] = useState(businessSettings.phone);
  const [whatsapp, setWhatsapp] = useState(businessSettings.socialLinks?.whatsapp || '+250788123456');
  const [supportEmail, setSupportEmail] = useState(businessSettings.supportEmail);
  const [address, setAddress] = useState(businessSettings.address);
  const [openingHours, setOpeningHours] = useState(businessSettings.openingHours);

  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if context changes externally
  useEffect(() => {
    setName(businessSettings.name);
    setTagline(businessSettings.tagline);
    setLogoText(businessSettings.logoText);
    setLogoUrl(businessSettings.logoUrl || '');
    setPhone(businessSettings.phone);
    setWhatsapp(businessSettings.socialLinks?.whatsapp || '+250788123456');
    setSupportEmail(businessSettings.supportEmail);
    setAddress(businessSettings.address);
    setOpeningHours(businessSettings.openingHours);
  }, [businessSettings]);

  // Handle image upload from file (convert to base64 data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoUrl(dataUrl);
      updateBusinessSettings({ logoUrl: dataUrl });
      showToast('Brand logo updated successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please drop a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoUrl(dataUrl);
      updateBusinessSettings({ logoUrl: dataUrl });
      showToast('Brand logo updated successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = () => {
    if (!logoUrl.trim()) {
      updateBusinessSettings({ logoUrl: null });
      showToast('Logo cleared. Reverted to standard brand typography.', 'info');
      return;
    }
    updateBusinessSettings({ logoUrl: logoUrl.trim() });
    showToast('Brand logo URL updated', 'success');
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    updateBusinessSettings({ logoUrl: null });
    showToast('Custom logo removed. Using clean standard brand typography.', 'info');
  };

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings({
      name: name.trim(),
      tagline: tagline.trim(),
      logoText: logoText.trim(),
      logoUrl: logoUrl.trim() ? logoUrl.trim() : null,
      phone: phone.trim(),
      supportEmail: supportEmail.trim(),
      address: address.trim(),
      openingHours: openingHours.trim(),
      socialLinks: {
        ...businessSettings.socialLinks,
        whatsapp: whatsapp.trim(),
      },
    });
    showToast('Brand identity & phone numbers saved successfully', 'success');
  };

  // Quick hotline save
  const handleQuickSavePhone = () => {
    if (!phone.trim()) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    updateBusinessSettings({
      phone: phone.trim(),
      socialLinks: {
        ...businessSettings.socialLinks,
        whatsapp: whatsapp.trim() || phone.trim(),
      },
    });
    showToast('Customer hotline & WhatsApp updated live across website', 'success');
  };

  const cleanWaNumber = whatsapp.replace(/\D/g, '');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#111111] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#F51B55]" />
            <span>Logo, Branding & Contact Management</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Upload your official logo, configure customer phone hotlines, and customize store identity
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAllSettings}
          className="bg-[#F51B55] hover:bg-[#d41446] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-pink-500/20 shrink-0 self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FIXED LOGO MANAGEMENT & LIVE PREVIEW */}
        <div className="lg:col-span-6 space-y-6">
          {/* Logo Card */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#F51B55]" />
                  <span>Restaurant Brand Logo</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Appears in header, footer, checkout receipts, and order tracker
                </p>
              </div>

              {businessSettings.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>

            {/* Current Logo Status Badge */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-neutral-600">Active Logo Mode:</span>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    businessSettings.logoUrl
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {businessSettings.logoUrl ? 'Custom Image Logo Active' : 'Clean Typography Mark'}
                </span>
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#F51B55] bg-pink-50/50 scale-[0.99]'
                  : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 text-neutral-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Upload className="w-5 h-5 text-[#F51B55]" />
              </div>
              <p className="text-xs font-bold text-[#111111]">
                Click to upload or drag and drop your logo file
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                PNG, SVG, JPG, or WebP • Transparent background recommended • Max 5MB
              </p>
            </div>

            {/* URL Input Alternative */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Or Paste Image Direct URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://your-domain.com/logo.png"
                  className="flex-grow p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#F51B55]"
                />
                <button
                  type="button"
                  onClick={handleApplyLogoUrl}
                  className="px-4 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Set Logo
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Display Card */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>Live Rendering Preview</span>
              </h3>
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewTheme === 'light'
                      ? 'bg-white text-[#111111] shadow-xs'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  Light Navbar
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewTheme === 'dark'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  Dark Footer
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div
              className={`p-6 rounded-2xl border transition-colors ${
                previewTheme === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900 shadow-inner'
                  : 'bg-[#111111] border-neutral-800 text-white shadow-inner'
              }`}
            >
              <div className="flex items-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name}
                    className={`h-10 max-w-[160px] object-contain ${
                      previewTheme === 'dark' ? 'brightness-0 invert' : ''
                    }`}
                  />
                ) : (
                  <span
                    className={`text-2xl font-black tracking-tight leading-none ${
                      previewTheme === 'light' ? 'text-[#111111]' : 'text-white'
                    }`}
                  >
                    {logoText ? (
                      logoText
                    ) : (
                      <>
                        {name.toUpperCase() || 'UMUJYI'}
                        <span className="text-[#F51B55]">.</span>
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Preview matches how customers view your brand across desktop and mobile devices.</span>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DEDICATED PHONE NUMBERS & CONTACT DETAILS */}
        <div className="lg:col-span-6 space-y-6">
          {/* Phone Numbers & Hotlines Card */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#F51B55]" />
                  <span>Customer Phone & Ordering Lines</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Direct call links and WhatsApp chat buttons for Kigali customers
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickSavePhone}
                className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save Phone
              </button>
            </div>

            <div className="space-y-4">
              {/* Primary Hotline Input */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                  <span>Primary Customer Hotline (Call Orders) *</span>
                  <span className="text-[10px] text-neutral-400 font-mono">e.g. +250 788 123 456</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+250 788 000 000"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-[#111111] focus:outline-none focus:border-[#F51B55]"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Shown in the top website header, footer, contact page, and mobile quick-call drawer.
                </p>
              </div>

              {/* WhatsApp Ordering Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                  <span>WhatsApp Business Number</span>
                  <span className="text-[10px] text-neutral-400 font-mono">e.g. +250 788 123 456</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-[#111111] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Quick Dial Test Card */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 block">
                  Verify Live Customer Links
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${phone}`}
                    className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F51B55]" />
                    <span>Test Phone Call ({phone || 'Not Set'})</span>
                  </a>
                  <a
                    href={`https://wa.me/${cleanWaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test WhatsApp Link</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Profile & Brand Info Form */}
          <form onSubmit={handleSaveAllSettings} className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
              <Store className="w-4 h-4 text-neutral-400" />
              <span>Business Profile & Operations</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Official Business Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#F51B55]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Logo Text Display
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="UMUJYI."
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#F51B55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="GOOD FOOD. DELIVERED FAST."
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F51B55]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>Customer Support Email</span>
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#F51B55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Headquarters Address in Kigali</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#F51B55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>General Operating Hours</span>
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#F51B55]"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#111111] hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save All Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
