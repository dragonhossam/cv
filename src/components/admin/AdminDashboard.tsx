import React, { useState, useEffect } from 'react';
import { Order, SiteSettings, Language } from '../../types';
import { translations } from '../../data/translations';
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Settings,
  Smartphone,
  Save,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onUpdateSettings,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cvm_admin_token'));
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');

  // Editable settings state
  const [editWallet, setEditWallet] = useState(settings.vodafoneCashWallet);
  const [editProPrice, setEditProPrice] = useState(settings.proPriceEgp);
  const [editPremPrice, setEditPremPrice] = useState(settings.premiumPriceEgp);
  const [editInstructionsAr, setEditInstructionsAr] = useState(settings.paymentInstructionsAr);
  const [editInstructionsEn, setEditInstructionsEn] = useState(settings.paymentInstructionsEn);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('cvm_admin_token', data.token);
        setToken(data.token);
      } else {
        setAuthError(data.message || (isAr ? 'كلمة المرور غير صحيحة' : 'Incorrect password'));
      }
    } catch {
      setAuthError(isAr ? 'فشل الاتصال بالخادم' : 'Server connection failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cvm_admin_token');
    setToken(null);
  };

  // Approve Order
  const handleApprove = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: isAr ? 'تم التحقق من استلام التحويل بالمحفظة' : 'Confirmed received in wallet' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reject Order
  const handleReject = async (orderId: string) => {
    const reason = prompt(
      isAr ? 'سبب رفض الطلب (مثال: لم يتم العثور على المبلغ في المحفظة):' : 'Reason for rejection:'
    );
    if (reason === null) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vodafoneCashWallet: editWallet,
          proPriceEgp: Number(editProPrice),
          premiumPriceEgp: Number(editPremPrice),
          paymentInstructionsAr: editInstructionsAr,
          paymentInstructionsEn: editInstructionsEn,
        }),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        onUpdateSettings(data.settings);
        setSaveSuccessMsg(isAr ? 'تم حفظ الإعدادات بنجاح!' : 'Settings updated successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch {
      alert('Error updating settings');
    }
  };

  // Export orders to CSV
  const exportCSV = () => {
    const headers = ['OrderNumber', 'Package', 'AmountEGP', 'SenderPhone', 'TransactionID', 'Email', 'CustomerName', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.packageId,
      o.amountEgp,
      o.senderPhone,
      o.transactionId,
      o.customerEmail,
      `"${o.customerName}"`,
      o.status,
      new Date(o.createdAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cvmaker_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not authenticated, show login form
  if (!token) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isAr ? 'لوحة تحكم الإدارة الآمنة' : 'Admin Control Panel'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'أدخل كلمة مرور المسؤول لإدارة طلبات فودافون كاش وتعديل الأسعار'
              : 'Enter admin password to manage Vodafone Cash orders and site pricing'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'كلمة مرور الإدارة' : 'Admin Password'}
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="admin123"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {isAr ? 'كلمة المرور الافتراضية: admin123' : 'Default password: admin123'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            {isAr ? 'تسجيل الدخول' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const paidOrders = orders.filter((o) => o.status === 'paid').length;
  const rejectedOrders = orders.filter((o) => o.status === 'rejected').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + (Number(o.amountEgp) || 0), 0);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchEmail = ord.customerEmail.toLowerCase().includes(q);
      const matchTx = ord.transactionId.toLowerCase().includes(q);
      const matchPhone = ord.senderPhone.includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      if (!matchNum && !matchEmail && !matchTx && !matchPhone && !matchName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Admin Access
            </span>
            <span className="text-xs text-slate-400">Vodafone Cash & Operations</span>
          </div>
          <h1 className="text-xl font-bold mt-1">
            {isAr ? 'لوحة تحكم إدارة السير الذاتية والمبيعات' : 'CV Maker Pro Admin Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصدير كشف Excel / CSV' : 'Export CSV'}</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? 'خروج' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalOrders}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-700 uppercase">{isAr ? 'طلبات قيد المراجعة' : 'Pending Review'}</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingOrders}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">{isAr ? 'الطلبات المقبولة' : 'Paid & Approved'}</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{paidOrders}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-red-700 uppercase">{isAr ? 'الطلبات المرفوضة' : 'Rejected'}</div>
          <div className="text-2xl font-black text-red-600 mt-1">{rejectedOrders}</div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-blue-700 uppercase">{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</div>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {totalRevenue} <span className="text-xs font-bold">ج.م</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isAr ? 'إدارة الطلبات والتحويلات' : 'Orders & Transfers Management'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isAr ? 'إعدادات فودافون كاش والأسعار' : 'Vodafone Cash & Pricing Settings'}
        </button>
      </div>

      {/* TAB 1: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="w-4 h-4 absolute top-2.5 start-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث برقم الطلب، الإيميل، رقم المحفظة، أو العملية...' : 'Search order #, email, phone, tx ID...'}
                className="w-full ps-9 pe-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-1.5 w-full sm:w-auto">
              {(['all', 'pending', 'paid', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all'
                    ? isAr ? 'الكل' : 'All'
                    : st === 'pending'
                    ? isAr ? 'قيد المراجعة' : 'Pending'
                    : st === 'paid'
                    ? isAr ? 'مدفوع' : 'Paid'
                    : isAr ? 'مرفوض' : 'Rejected'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-3 text-start">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الباقة والمبلغ' : 'Package & Amount'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'رقم المحفظة والعملية' : 'Sender & Tx ID'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className="py-2.5 px-3 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      {isAr ? 'لا توجد طلبات مطابقة للبحث' : 'No matching orders found'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-700">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{ord.customerName}</div>
                        <div className="text-slate-500 text-[11px]">{ord.customerEmail}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">
                          {isAr ? ord.packageNameAr : ord.packageName}
                        </div>
                        <div className="text-emerald-700 font-bold font-mono">
                          {ord.amountEgp} EGP
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div className="text-slate-900 text-[11px] flex items-center gap-1" dir="ltr">
                          <Smartphone className="w-3 h-3 text-slate-400" />
                          <span>{ord.senderPhone}</span>
                        </div>
                        <div className="text-blue-600 text-[11px] font-bold">
                          {ord.transactionId}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {ord.status === 'paid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {isAr ? 'مدفوع ومفعل' : 'Paid'}
                          </span>
                        )}
                        {ord.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {isAr ? 'بانتظار المراجعة' : 'Pending'}
                          </span>
                        )}
                        {ord.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 text-red-600" />
                            {isAr ? 'مرفوض' : 'Rejected'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {ord.status !== 'paid' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(ord.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="Approve Payment"
                            >
                              {isAr ? 'قبول وتفعيل' : 'Approve'}
                            </button>
                          )}
                          {ord.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleReject(ord.id)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="Reject"
                            >
                              {isAr ? 'رفض' : 'Reject'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SETTINGS EDITOR */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>{isAr ? 'إعدادات فودافون كاش والأسعار المعروضة' : 'Vodafone Cash & Pricing Config'}</span>
            </h3>
            {saveSuccessMsg && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveSuccessMsg}</span>
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isAr ? 'رقم محفظة فودافون كاش المعتمدة للتحويل' : 'Vodafone Cash Wallet Number'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={editWallet}
                onChange={(e) => setEditWallet(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {isAr
                  ? 'هذا هو الرقم الذي سيظهر لجميع العملاء في نافذة الدفع مع زر النسخ المباشر.'
                  : 'This wallet number will be displayed on the checkout modal with the copy button.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'سعر الباقة الاحترافية Pro (ج.م)' : 'Professional Plan Price (EGP)'}
                </label>
                <input
                  type="number"
                  required
                  value={editProPrice}
                  onChange={(e) => setEditProPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'سعر الباقة المميزة Premium (ج.م)' : 'Premium Plan Price (EGP)'}
                </label>
                <input
                  type="number"
                  required
                  value={editPremPrice}
                  onChange={(e) => setEditPremPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isAr ? 'تعليمات التحويل للعميل (باللغة العربية)' : 'Payment Instructions (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={editInstructionsAr}
                onChange={(e) => setEditInstructionsAr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isAr ? 'تعليمات التحويل للعميل (باللغة الإنجليزية)' : 'Payment Instructions (English)'}
              </label>
              <textarea
                rows={3}
                value={editInstructionsEn}
                onChange={(e) => setEditInstructionsEn(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
