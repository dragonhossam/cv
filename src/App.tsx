import React, { useState, useEffect } from 'react';
import { CVData, Language, SiteSettings, Order } from './types';
import { INITIAL_CV_AR, INITIAL_CV_EN } from './data/initialCV';
import { CV_TEMPLATES } from './data/templates';
import { translations } from './data/translations';
import { Navbar } from './components/layout/Navbar';
import { HomeHero } from './components/home/HomeHero';
import { CVEditor } from './components/editor/CVEditor';
import { CVRenderer } from './components/templates/CVRenderer';
import { TemplateGallery } from './components/templates/TemplateGallery';
import { CoverLetterBuilder } from './components/coverletter/CoverLetterBuilder';
import { PricingSection } from './components/pricing/PricingSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VodafoneCheckoutModal } from './components/payment/VodafoneCheckoutModal';
import { OrderTrackerModal } from './components/payment/OrderTrackerModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import {
  Printer,
  Download,
  Upload,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layout,
  Crown,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const DEFAULT_SETTINGS: SiteSettings = {
  vodafoneCashWallet: '01012345678',
  vodafoneCashName: 'CV Maker Official Account',
  proPriceEgp: 49,
  premiumPriceEgp: 99,
  paymentInstructionsAr:
    'قم بتحويل المبلغ المطلوب إلى رقم محفظة فودافون كاش الموضحة أعلاه عبر تطبيق أنا فودافون أو كود التحويل (*9*7*الرقم*المبلغ#). بعد إتمام التحويل، أدخل رقم هاتفك المحول منه ورقم العملية (Transaction ID) لتأكيد طلبك وتفعيل باقتك فوراً.',
  paymentInstructionsEn:
    'Transfer the required amount to the Vodafone Cash wallet number above via Ana Vodafone app or dialing *9*7*number*amount#. After transfer, enter your sender phone number and Transaction ID to activate your plan.',
  supportPhone: '+201012345678',
  supportEmail: 'support@cvmaker.site',
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('cvm_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  const [currentView, setCurrentView] = useState<string>('home');

  // Load CV data
  const [cv, setCV] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(`cvm_data_${lang}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return lang === 'ar' ? INITIAL_CV_AR : INITIAL_CV_EN;
  });

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // Pro & Premium Access state
  const [hasProAccess, setHasProAccess] = useState<boolean>(() => {
    return localStorage.getItem('cvm_has_pro') === 'true';
  });
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean>(() => {
    return localStorage.getItem('cvm_has_premium') === 'true';
  });

  // Modals
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<'pro' | 'premium'>('pro');
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTask, setAiTask] = useState('summary');
  const [aiFieldData, setAiFieldData] = useState<any>({});

  // Zoom scale for editor live preview
  const [previewZoom, setPreviewZoom] = useState<number>(0.75);

  // Fetch settings from server
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);

  // Save CV data to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`cvm_data_${lang}`, JSON.stringify(cv));
    } catch (e) {
      console.error(e);
    }
  }, [cv, lang]);

  // Sync document direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('cvm_lang', lang);
  }, [lang]);

  // Toggle Language
  const handleToggleLang = () => {
    const nextLang: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    // Switch default CV demo for selected language
    setCV(nextLang === 'ar' ? INITIAL_CV_AR : INITIAL_CV_EN);
  };

  // Open Checkout
  const handleOpenCheckout = (tier: 'pro' | 'premium') => {
    setCheckoutTier(tier);
    setCheckoutOpen(true);
  };

  // Handle Order Success
  const handleOrderSuccess = (order: Order) => {
    // Save order number to localStorage for tracking
    localStorage.setItem('cvm_last_order', order.orderNumber);
  };

  // Apply paid order from tracker
  const handleApplyPaidOrder = (order: Order) => {
    if (order.packageId === 'premium') {
      setHasPremiumAccess(true);
      setHasProAccess(true);
      localStorage.setItem('cvm_has_premium', 'true');
      localStorage.setItem('cvm_has_pro', 'true');
    } else {
      setHasProAccess(true);
      localStorage.setItem('cvm_has_pro', 'true');
    }
    alert(
      lang === 'ar'
        ? `تم تفعيل ${order.packageNameAr} بنجاح على هذا المتصفح!`
        : `${order.packageName} successfully activated on this browser!`
    );
  };

  // Open AI Assistant
  const handleOpenAI = (task: string = 'summary', fieldData?: any) => {
    setAiTask(task);
    setAiFieldData(fieldData || {});
    setAiModalOpen(true);
  };

  // Print CV as PDF
  const handlePrint = () => {
    const currentTpl = CV_TEMPLATES.find((t) => t.id === cv.settings.templateId);
    if (currentTpl?.isPremium && !hasProAccess) {
      handleOpenCheckout('pro');
      return;
    }
    window.print();
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cv.personalInfo.fullName || 'resume'}_cv.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.personalInfo) {
            setCV(parsed);
            alert(lang === 'ar' ? 'تم استيراد البيانات بنجاح!' : 'Data imported successfully!');
          }
        } catch {
          alert(lang === 'ar' ? 'الملف غير صالح' : 'Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Reset to default sample
  const handleResetSample = () => {
    if (
      window.confirm(
        lang === 'ar'
          ? 'هل تريد استعادة البيانات النموذجية الافتراضية؟'
          : 'Reset to default sample data?'
      )
    ) {
      setCV(lang === 'ar' ? INITIAL_CV_AR : INITIAL_CV_EN);
    }
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        lang={lang}
        onToggleLang={handleToggleLang}
        hasProAccess={hasProAccess}
        hasPremiumAccess={hasPremiumAccess}
        onOpenCheckout={handleOpenCheckout}
        onOpenTracker={() => setTrackerOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <HomeHero
            lang={lang}
            onStartEditing={() => setCurrentView('editor')}
            onExploreTemplates={() => setCurrentView('templates')}
            onSelectTemplate={(tplId) => {
              setCV({
                ...cv,
                settings: { ...cv.settings, templateId: tplId },
              });
            }}
            onOpenCheckout={handleOpenCheckout}
            settings={settings}
          />
        )}

        {/* 2. TEMPLATES LIBRARY VIEW */}
        {currentView === 'templates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t.navTemplates}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ar'
                    ? '30 قالباً احترافياً بتصميمات وأعمدة وشبكات متباينة تلائم كافة مجالات العمل.'
                    : '30 visually distinct layouts engineered for recruiters and modern ATS platforms.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('editor')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {t.navEditor}
                </button>
              </div>
            </div>

            <TemplateGallery
              currentTemplateId={cv.settings.templateId}
              onSelectTemplate={(tplId) => {
                setCV({
                  ...cv,
                  settings: { ...cv.settings, templateId: tplId },
                });
                setCurrentView('editor');
              }}
              lang={lang}
              hasProAccess={hasProAccess}
              onRequireUpgrade={() => handleOpenCheckout('pro')}
            />
          </div>
        )}

        {/* 3. CV EDITOR & LIVE PREVIEW VIEW */}
        {currentView === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: CV Editor Form */}
            <div className="lg:col-span-5 h-[calc(100vh-8rem)] sticky top-20 flex flex-col no-print">
              <CVEditor
                cv={cv}
                onChange={setCV}
                lang={lang}
                onOpenAI={handleOpenAI}
              />
            </div>

            {/* Right: Live Preview Panel */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Preview Action Header Toolbar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.previewCV}</span>
                  </span>

                  {/* Active template badge */}
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 border border-slate-200">
                    {CV_TEMPLATES.find((t) => t.id === cv.settings.templateId)?.name || 'Modern Slate'}
                  </span>
                </div>

                {/* Toolbar Controls */}
                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom((z) => Math.max(0.5, z - 0.1))}
                      className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold px-1.5 text-slate-700">
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))}
                      className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* AI Assistant Quick Trigger */}
                  <button
                    type="button"
                    onClick={() => handleOpenAI('ats-score')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.atsScore}</span>
                  </button>

                  {/* Template Picker Dropdown */}
                  <button
                    type="button"
                    onClick={() => setCurrentView('templates')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Layout className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'تغيير القالب' : 'Templates'}</span>
                  </button>

                  {/* Print / Save PDF Button */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.printCV}</span>
                  </button>
                </div>
              </div>

              {/* Data Import / Export Quick Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 no-print">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Download className="w-3 h-3" />
                    <span>{t.exportJSON}</span>
                  </button>
                  <label className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-medium">
                    <Upload className="w-3 h-3" />
                    <span>{t.importJSON}</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleResetSample}
                    className="hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'استعادة النموذج' : 'Reset Sample'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'ورق قياسي A4 للطباعة' : 'Standard A4 210×297mm'}
                </div>
              </div>

              {/* Real-time A4 Paper Render Container */}
              <div className="w-full flex justify-center overflow-x-auto pb-12 pt-2 scrollbar-none">
                <div
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    transform: `scale(${previewZoom})`,
                    transformOrigin: 'top center',
                    marginBottom: previewZoom < 1 ? `-${297 * (1 - previewZoom)}mm` : '0',
                  }}
                  className="transition-transform duration-150"
                >
                  <CVRenderer cv={cv} scale={1} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. COVER LETTER VIEW */}
        {currentView === 'coverletter' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t.navCoverLetter}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ar'
                    ? 'أنشئ خطاب تقديم متوافق مع سيرتك الذاتية وموجه لأي وظيفة بواسطة الذكاء الاصطناعي.'
                    : 'Write a persuasive, tailored cover letter matched with your CV data and target role.'}
                </p>
              </div>
            </div>
            <CoverLetterBuilder cv={cv} lang={lang} />
          </div>
        )}

        {/* 5. PRICING & MONETIZATION VIEW */}
        {currentView === 'pricing' && (
          <PricingSection
            settings={settings}
            lang={lang}
            onSelectPlan={handleOpenCheckout}
            hasProAccess={hasProAccess}
            hasPremiumAccess={hasPremiumAccess}
          />
        )}

        {/* 6. ADMIN DASHBOARD VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard
            settings={settings}
            onUpdateSettings={setSettings}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
            <button onClick={() => setCurrentView('home')} className="hover:text-blue-600 cursor-pointer">
              {t.navHome}
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('templates')} className="hover:text-blue-600 cursor-pointer">
              {t.navTemplates}
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('editor')} className="hover:text-blue-600 cursor-pointer">
              {t.navEditor}
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('pricing')} className="hover:text-blue-600 cursor-pointer">
              {t.navPricing}
            </button>
            <span>•</span>
            <button onClick={() => setTrackerOpen(true)} className="hover:text-blue-600 cursor-pointer">
              {t.navTrackOrder}
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('admin')} className="hover:text-blue-600 cursor-pointer">
              {t.navAdmin}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            {lang === 'ar'
              ? `© 2026 CV Maker Pro - جميع الحقوق محفوظة. المنصة الاحترافية لصناعة السير الذاتية وأنظمة التوظيف.`
              : `© 2026 CV Maker Pro - All rights reserved. High-Impact ATS Resume Builder & Career Suite.`}
          </p>
        </div>
      </footer>

      {/* VODAFONE CASH CHECKOUT MODAL */}
      <VodafoneCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        packageType={checkoutTier}
        settings={settings}
        lang={lang}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ORDER TRACKER MODAL */}
      <OrderTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        lang={lang}
        onApplyPaidOrder={handleApplyPaidOrder}
      />

      {/* GEMINI AI ASSISTANT MODAL */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        cv={cv}
        lang={lang}
        initialTask={aiTask}
        initialData={aiFieldData}
        onApplySummary={(sum) => {
          setCV({
            ...cv,
            personalInfo: { ...cv.personalInfo, summary: sum },
          });
        }}
        onApplySkills={(newSkills) => {
          const currentNames = cv.skills.map((s) => s.name.toLowerCase());
          const toAdd = newSkills
            .filter((s) => !currentNames.includes(s.toLowerCase()))
            .map((name) => ({
              id: `sk-${Date.now()}-${Math.random()}`,
              name,
              level: 4,
              category: 'Technical' as const,
            }));
          setCV({
            ...cv,
            skills: [...cv.skills, ...toAdd],
          });
        }}
        isPaidUser={hasPremiumAccess}
        onRequireUpgrade={() => handleOpenCheckout('premium')}
      />
    </div>
  );
}
