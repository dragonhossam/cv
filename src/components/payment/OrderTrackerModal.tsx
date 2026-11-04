import React, { useState } from 'react';
import { Language, Order } from '../../types';
import { translations } from '../../data/translations';
import {
  X,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  Download,
  Calendar,
  Smartphone,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onApplyPaidOrder: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  lang,
  onApplyPaidOrder,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrders(null);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || (lang === 'ar' ? 'لم يتم العثور على طلب بهذا الرقم' : 'No order found'));
      }

      setOrders(data.orders);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء البحث');
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
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>{t.trackTitle}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">{t.trackSubtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute top-3 start-3 text-slate-400" />
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.trackPlaceholder}
                className="w-full ps-9 pe-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (lang === 'ar' ? 'بحث...' : 'Searching...') : t.trackButton}
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Orders Results */}
          {orders && orders.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ar' ? `النتائج (${orders.length}):` : `Results (${orders.length}):`}
              </h3>

              {orders.map((ord) => {
                const isPaid = ord.status === 'paid';
                const isPending = ord.status === 'pending';
                const isRejected = ord.status === 'rejected';

                return (
                  <div
                    key={ord.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isPaid
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : isRejected
                        ? 'bg-red-50/60 border-red-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          ({lang === 'ar' ? ord.packageNameAr : ord.packageName})
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isPaid && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.orderStatusPaid}</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-2xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t.orderStatusPending}</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-2xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{t.orderStatusRejected}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                      <div>
                        <span className="text-slate-400 block">{lang === 'ar' ? 'المبلغ المطلوب:' : 'Amount:'}</span>
                        <span className="font-bold text-slate-800">{ord.amountEgp} EGP</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{lang === 'ar' ? 'رقم العملية:' : 'Tx ID:'}</span>
                        <span className="font-mono text-slate-800">{ord.transactionId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{lang === 'ar' ? 'المحول منه:' : 'Sender Phone:'}</span>
                        <span dir="ltr" className="font-mono text-slate-800">{ord.senderPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{lang === 'ar' ? 'تاريخ الطلب:' : 'Date:'}</span>
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {ord.notes && (
                      <div className="text-[11px] bg-white/70 p-2 rounded-lg text-slate-700 italic border border-slate-200/50">
                        {ord.notes}
                      </div>
                    )}

                    {isPaid && (
                      <button
                        type="button"
                        onClick={() => {
                          onApplyPaidOrder(ord);
                          onClose();
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {lang === 'ar'
                            ? 'تفعيل مميزات الباقة في هذا الجهاز الآن'
                            : 'Activate Plan on this Device'}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
