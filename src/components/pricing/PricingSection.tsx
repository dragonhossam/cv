import React from 'react';
import { Language, SiteSettings } from '../../types';
import { translations } from '../../data/translations';
import { Check, Sparkles, Crown, Zap, Shield, Smartphone } from 'lucide-react';

interface PricingSectionProps {
  settings: SiteSettings;
  lang: Language;
  onSelectPlan: (plan: 'pro' | 'premium') => void;
  hasProAccess: boolean;
  hasPremiumAccess: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  settings,
  lang,
  onSelectPlan,
  hasProAccess,
  hasPremiumAccess,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <div className="py-8 space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 inline-flex items-center gap-1.5 shadow-2xs">
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isAr ? 'دفع يدوي فوري عبر فودافون كاش' : 'Instant Vodafone Cash Payment'}</span>
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {isAr ? 'خطط أسعار بسيطة وعادلة للجميع' : 'Transparent & Affordable Pricing'}
        </h2>
        <p className="text-xs md:text-sm text-slate-600">
          {isAr
            ? 'ابدأ مجاناً أو اختر الباقة الاحترافية مع قوالب الـ ATS ومساعد الذكاء الاصطناعي بدفع لمرة واحدة.'
            : 'Start free or unlock all 30 ATS templates and AI assistance with a simple one-time payment.'}
        </p>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* 1. Free Plan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.freePlan}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {isAr ? 'الباقة الأساسية' : 'Basic Starter'}
              </h3>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">0</span>
              <span className="text-xs font-bold text-slate-500">ج.م / Free</span>
            </div>

            <p className="text-xs text-slate-500">
              {isAr
                ? 'مناسبة لتجربة المحرر وإنشاء سيرة ذاتية أولية بالقوالب الأساسية.'
                : 'Great for creating a basic CV with essential templates.'}
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              {[
                isAr ? 'إنشاء سيرة ذاتية وحفظها محلياً' : 'Create & save CV locally',
                isAr ? 'استخدام القوالب المجانية الأساسية' : 'Access basic free templates',
                isAr ? 'إدخال كافة بيانات التعليم والخبرات' : 'Standard sections: Experience, Education',
                isAr ? 'معاينة حية فورية وتنسيق الألوان' : 'Live real-time preview',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <span className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center block bg-slate-100 text-slate-700">
              {isAr ? 'متاحة دائماً ومجاناً' : 'Current Active Plan'}
            </span>
          </div>
        </div>

        {/* 2. Professional Plan (49 EGP) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-blue-600 shadow-lg relative flex flex-col justify-between hover:shadow-xl transition-shadow">
          <div className="absolute -top-3.5 inset-x-0 flex justify-center">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isAr ? 'الأكثر طلباً واختياراً' : 'Most Popular Choice'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                {t.proPlan}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {isAr ? 'الباقة الاحترافية' : 'Professional Tier'}
              </h3>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-blue-700">{settings.proPriceEgp}</span>
              <span className="text-xs font-bold text-slate-500">ج.م (EGP) / {isAr ? 'لمرة واحدة' : 'One-time'}</span>
            </div>

            <p className="text-xs text-slate-500">
              {isAr
                ? 'الحل الأمثل لاجتياز اختبارات ATS والحصول على مقابلات عمل أسرع.'
                : 'Ideal for serious job seekers wanting high-converting ATS templates.'}
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              {[
                isAr ? 'جميع مميزات الباقة المجانية' : 'All Free plan features',
                isAr ? 'فتح جميع القوالب الاحترافية (30 قالباً)' : 'Full access to all 30 ATS templates',
                isAr ? 'تحميل وطباعة PDF عالي الدقة دون علامة مائية' : 'High-resolution PDF print export (No watermark)',
                isAr ? 'تنسيق متوافق بنسبة 100% مع أنظمة ATS' : '100% ATS-friendly parsing structure',
                isAr ? 'إنشاء السيرة الذاتية بالعربية أو الإنجليزية' : 'Full English & Arabic RTL support',
                isAr ? 'تخصيص كامل للألوان والخطوط وهوامش A4' : 'Custom fonts, colors, and A4 margins',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => onSelectPlan('pro')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {hasProAccess
                  ? (isAr ? 'مفعلة على هذا الجهاز' : 'Plan Active')
                  : (isAr ? `شراء عبر فودافون كاش (${settings.proPriceEgp} ج.م)` : `Buy with Vodafone Cash (${settings.proPriceEgp} EGP)`)}
              </span>
            </button>
          </div>
        </div>

        {/* 3. Premium Plan (99 EGP) */}
        <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative hover:shadow-2xl transition-shadow">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>{t.premiumPlan}</span>
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {isAr ? 'الباقة المميزة الذكية' : 'AI Career Suite'}
              </h3>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-amber-400">{settings.premiumPriceEgp}</span>
              <span className="text-xs font-bold text-slate-300">ج.م (EGP) / {isAr ? 'لمرة واحدة' : 'One-time'}</span>
            </div>

            <p className="text-xs text-slate-300">
              {isAr
                ? 'تشمل كافة قوالب المنصة + مساعد الذكاء الاصطناعي وصانع خطابات التقديم.'
                : 'All templates + Gemini AI assistant, ATS Score Analyzer, and Cover Letter builder.'}
            </p>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-200">
              {[
                isAr ? 'جميع مميزات الباقة الاحترافية' : 'All Professional plan features',
                isAr ? 'مساعد الذكاء الاصطناعي لصياغة الملخصات' : 'Gemini AI Executive Summary generator',
                isAr ? 'تحسين نقاط الخبرة بصيغة Google XYZ' : 'Enhance achievements with action verbs & metrics',
                isAr ? 'اقتراح المهارات التنافسية حسب المسمى' : 'Job-specific skill recommendations',
                isAr ? 'محلل درجات التوافق مع ATS Score' : 'Real-time ATS Compatibility Score',
                isAr ? 'منشئ خطابات التقديم (Cover Letter Builder)' : 'Complete Cover Letter Builder & templates',
                isAr ? 'أولوية المراجعة السريعة لطلبات فودافون كاش' : 'Priority instant activation review',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => onSelectPlan('premium')}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {hasPremiumAccess
                  ? (isAr ? 'مفعلة على هذا الجهاز' : 'Plan Active')
                  : (isAr ? `شراء عبر فودافون كاش (${settings.premiumPriceEgp} ج.م)` : `Buy with Vodafone Cash (${settings.premiumPriceEgp} EGP)`)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
