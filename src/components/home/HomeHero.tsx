import React from 'react';
import { Language, SiteSettings } from '../../types';
import { translations } from '../../data/translations';
import { CV_TEMPLATES } from '../../data/templates';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Star,
  Users,
  Award,
  Zap,
  Smartphone,
  Layout,
  Wand2,
} from 'lucide-react';

interface HomeHeroProps {
  lang: Language;
  onStartEditing: () => void;
  onExploreTemplates: () => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenCheckout: (tier: 'pro' | 'premium') => void;
  settings: SiteSettings;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  lang,
  onStartEditing,
  onExploreTemplates,
  onSelectTemplate,
  onOpenCheckout,
  settings,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const featuredTemplates = CV_TEMPLATES.filter((t) => t.popular).slice(0, 4);

  return (
    <div className="space-y-16 py-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isAr
              ? 'أكثر من 30 قالب سيرة ذاتية معتمد دولياً ومتوافق مع ATS'
              : '30+ Certified ATS-Friendly Resume Templates'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {isAr ? (
            <>
              ابنِ سيرة ذاتية احترافية تفتح لك أبواب{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500">
                أفضل الوظائف
              </span>
            </>
          ) : (
            <>
              Build a High-Converting Resume That Lands{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500">
                Top Tier Interviews
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {isAr
            ? 'منصة متكاملة تدعم اللغتين العربية والإنجليزية، مع أكثر من 30 قالباً هندسياً وإدارياً وتقنياً، ومساعد بالذكاء الاصطناعي ونظام دفع يدوي فوري عبر فودافون كاش.'
            : 'Engineered for recruiters and ATS bots. Choose from 30+ distinctive layouts, write compelling bullets with Gemini AI, and export print-ready PDFs.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onStartEditing}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'ابدأ إنشاء سيرتك الذاتية مجاناً' : 'Build Your CV Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExploreTemplates}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Layout className="w-4 h-4 text-blue-600" />
            <span>{isAr ? 'استعراض 30 قالباً احترافياً' : 'Browse 30 Templates'}</span>
          </button>
        </div>

        {/* Local Payment Trust Pill */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <Smartphone className="w-4 h-4 text-red-600" />
              <span>{isAr ? 'دفع محلي عبر Vodafone Cash' : 'Vodafone Cash Ready'}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              {isAr ? `الباقة الاحترافية بـ ${settings.proPriceEgp} ج.م فقط` : `Pro Plan at ${settings.proPriceEgp} EGP`}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'تأكيد ومراجعة آمنة' : 'Safe Verification'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Layout,
            title: isAr ? '30 قالباً مميزاً وغير مكرر' : '30 Distinct Layouts',
            desc: isAr ? 'قوالب عمود واحد، عمودين، وشريط جانبي لمختلف التخصصات.' : 'Single-col, two-col, and sidebar designs tailored per industry.',
            color: 'text-blue-600 bg-blue-50',
          },
          {
            icon: ShieldCheck,
            title: isAr ? 'توافق تام 100% مع ATS' : '100% ATS Friendly',
            desc: isAr ? 'خطوط مقروءة وهيكلية برمجية تجتاز مرشحات التوظيف العالمية.' : 'Selectable text, clean hierarchy, zero parsing errors.',
            color: 'text-emerald-600 bg-emerald-50',
          },
          {
            icon: Wand2,
            title: isAr ? 'مساعد الذكاء الاصطناعي الذكي' : 'Gemini AI Assistant',
            desc: isAr ? 'صياغة ملخصات تنفيذية وتحويل المسؤوليات إلى أرقام وإنجازات.' : 'Executive summaries, bullet rewrites, and skill suggestions.',
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            icon: Smartphone,
            title: isAr ? 'دفع سلس بفودافون كاش' : 'Instant Local Payment',
            desc: isAr ? 'تحويل فوري بدون بطاقات بنكية مع إشعار تفعيل سريع.' : 'Pay via Vodafone Cash in Egypt with clear manual verification.',
            color: 'text-rose-600 bg-rose-50',
          },
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feat.color} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{feat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Featured Templates Preview Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? 'نماذج مختارة من مكتبة القوالب' : 'Featured Handpicked Templates'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'اختر أي قالب وابدأ التعديل فوراً بنقرة واحدة' : 'Pick any template to load into the live editor'}
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreTemplates}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{isAr ? 'عرض كافة الـ 30 قالباً' : 'View All 30'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div
                className="h-44 bg-slate-100 flex items-center justify-center p-3 relative cursor-pointer"
                onClick={() => {
                  onSelectTemplate(tpl.id);
                  onStartEditing();
                }}
              >
                <div className="w-24 h-32 bg-white shadow rounded-xs p-2 flex flex-col justify-between group-hover:scale-105 transition-transform">
                  <div className="h-4 w-full rounded-xs" style={{ backgroundColor: tpl.accentColor }} />
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-slate-300 rounded-full" />
                    <div className="h-1 w-3/4 bg-slate-200 rounded-full" />
                    <div className="h-1 w-5/6 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-0.5 w-full bg-slate-100 rounded-full" />
                </div>

                <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                  {tpl.isPremium ? 'Pro 49 EGP' : 'Free'}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">
                    {isAr ? tpl.nameAr : tpl.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{tpl.layout}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl.id);
                    onStartEditing();
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isAr ? 'تخصيص هذا القالب' : 'Customize Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
