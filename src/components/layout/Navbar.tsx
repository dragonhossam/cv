import React from 'react';
import { Language, SiteSettings } from '../../types';
import { translations } from '../../data/translations';
import {
  FileText,
  Sparkles,
  Layout,
  Crown,
  Search,
  Shield,
  Printer,
  Download,
  Languages,
  Clock,
  Menu,
  X,
  Smartphone,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  lang: Language;
  onToggleLang: () => void;
  hasProAccess: boolean;
  hasPremiumAccess: boolean;
  onOpenCheckout: (tier: 'pro' | 'premium') => void;
  onOpenTracker: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  lang,
  onToggleLang,
  hasProAccess,
  hasPremiumAccess,
  onOpenCheckout,
  onOpenTracker,
  onPrint,
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: t.navHome, icon: FileText },
    { id: 'templates', label: t.navTemplates, icon: Layout },
    { id: 'editor', label: t.navEditor, icon: FileText },
    { id: 'coverletter', label: t.navCoverLetter, icon: FileText },
    { id: 'pricing', label: t.navPricing, icon: Crown },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-base tracking-tight font-sans">
                CV Maker
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                Pro
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">
              {lang === 'ar' ? 'منصة السير الذاتية الاحترافية' : 'ATS Resume Builder'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-blue-700 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Order Tracker Link */}
          <button
            type="button"
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            title={t.navTrackOrder}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">{t.navTrackOrder}</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-200"
            title="Switch Language / تبديل اللغة"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ar' ? 'English' : 'العربية (RTL)'}</span>
          </button>

          {/* Plan Status or Upgrade Button */}
          {hasPremiumAccess ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Premium VIP</span>
            </span>
          ) : hasProAccess ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pro Plan Active</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onOpenCheckout('pro')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'فودافون كاش (49 ج.م)' : 'Vodafone Cash (49 EGP)'}</span>
            </button>
          )}

          {/* Print PDF Button */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.printCV}</span>
          </button>

          {/* Admin Link */}
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={t.navAdmin}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className="w-full text-start px-3 py-2 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer block"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenCheckout('pro');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold text-center cursor-pointer"
            >
              {lang === 'ar' ? 'شراء باقة فودافون كاش (49 ج.م)' : 'Buy via Vodafone Cash (49 EGP)'}
            </button>
            <button
              type="button"
              onClick={() => {
                handleNav('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold text-center cursor-pointer"
            >
              {t.navAdmin}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
