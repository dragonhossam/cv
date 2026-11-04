import React, { useState } from 'react';
import { Language, SiteSettings } from '../../types';
import { translations } from '../../data/translations';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  CreditCard,
  Mail,
  User,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface VodafoneCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: 'pro' | 'premium';
  settings: SiteSettings;
  lang: Language;
  onOrderSuccess: (order: any) => void;
}

export const VodafoneCheckoutModal: React.FC<VodafoneCheckoutModalProps> = ({
  isOpen,
  onClose,
  packageType,
  settings,
  lang,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  const price = packageType === 'premium' ? settings.premiumPriceEgp : settings.proPriceEgp;
  const packageName = packageType === 'premium' ? 'Premium Plan (الباقة المميزة)' : 'Professional Plan (الباقة الاحترافية)';
  const packageNameAr = packageType === 'premium' ? 'الباقة المميزة' : 'الباقة الاحترافية';

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(settings.vodafoneCashWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!senderPhone || !transactionId || !customerEmail) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى إدخال رقم المحفظة المحول منها، رقم العملية، والبريد الإلكتروني'
          : 'Please provide sender phone, transaction ID, and email address.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: packageType,
          packageName,
          packageNameAr,
          amountEgp: price,
          senderPhone,
          transactionId,
          customerEmail,
          customerName: customerName || (lang === 'ar' ? 'عميل محترم' : 'Valued Customer'),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'حدث خطأ أثناء تسجيل الطلب');
      }

      setSubmittedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold tracking-wide">
              Vodafone Cash
            </span>
            <span className="text-xs text-white/90">
              {lang === 'ar' ? 'دفع يدوي فوري وآمن' : 'Instant Manual Transfer'}
            </span>
          </div>

          <h2 className="text-xl font-bold">{t.paymentTitle}</h2>
          <p className="text-xs text-white/80 mt-1">{t.paymentSubtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedOrder ? (
            /* Order Success View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === 'ar' ? 'تم استلام طلب التحويل بنجاح!' : 'Order Submitted Successfully!'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {lang === 'ar'
                    ? 'طلبك قيد المراجعة حالياً. سيتم تفعيل حسابك بمجرد مطابقة إشعار التحويل من قبل الإدارة.'
                    : 'Your order is currently pending review. It will be activated immediately once verified by admin.'}
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2 text-start">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-500">{lang === 'ar' ? 'رقم الطلب:' : 'Order Number:'}</span>
                  <span className="font-bold text-blue-700 text-sm font-mono">{submittedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-500">{lang === 'ar' ? 'الباقة:' : 'Package:'}</span>
                  <span className="font-bold">{lang === 'ar' ? submittedOrder.packageNameAr : submittedOrder.packageName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-500">{lang === 'ar' ? 'المبلغ:' : 'Amount:'}</span>
                  <span className="font-bold text-emerald-700">{submittedOrder.amountEgp} ج.م (EGP)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-500">{lang === 'ar' ? 'رقم العملية:' : 'Transaction ID:'}</span>
                  <span className="font-mono text-slate-900">{submittedOrder.transactionId}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-slate-500">{lang === 'ar' ? 'حالة الطلب:' : 'Status:'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {lang === 'ar' ? 'قيد المراجعة (Pending)' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 text-start leading-relaxed">
                {lang === 'ar'
                  ? 'يمكنك متابعة حالة طلبك في أي وقت عبر تبويب "متابعة الطلب" في القائمة العلوية باستخدام رقم الطلب أو بريدك الإلكتروني.'
                  : 'You can check your order status at any time via the "Track Order" link using your Order Number or Email.'}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                {lang === 'ar' ? 'تم، إغلاق هذه النافذة' : 'Close and Continue'}
              </button>
            </div>
          ) : (
            /* Order Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Package & Amount Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                    {t.selectedPackage}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{packageName}</h4>
                </div>
                <div className="text-end">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                    {t.requiredAmount}
                  </span>
                  <div className="text-lg font-black text-red-600">
                    {price} <span className="text-xs font-bold">ج.م (EGP)</span>
                  </div>
                </div>
              </div>

              {/* Wallet Info Box */}
              <div className="bg-red-50/60 border border-red-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-slate-900">{t.walletNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyWallet}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-red-300 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyWallet}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center py-2 bg-white rounded-xl border border-red-200 shadow-inner">
                  <span className="text-xl font-black text-slate-900 font-mono tracking-widest" dir="ltr">
                    {settings.vodafoneCashWallet}
                  </span>
                </div>

                {/* Instructions */}
                <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                  <div className="font-semibold text-slate-800">{t.instructionsHeader}</div>
                  <p className="text-slate-600">
                    {lang === 'ar' ? settings.paymentInstructionsAr : settings.paymentInstructionsEn}
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.senderPhoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder={t.senderPhonePlaceholder}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.transactionIdLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder={t.transactionIdPlaceholder}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {t.duplicateTxWarning}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.customerEmailLabel} *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.customerNameLabel}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={lang === 'ar' ? 'الاسم الكريم' : 'Your name'}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Security note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'أمان تام: لا نطلب أبداً الرقم السري (PIN) أو كود التحقق (OTP) الخاص بمحفظتك.'
                    : 'Safe & Secure: We never request your wallet PIN or OTP.'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>{lang === 'ar' ? 'جارٍ تسجيل الطلب...' : 'Submitting Order...'}</span>
                ) : (
                  <>
                    <span>{t.submitPayment}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
