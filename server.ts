import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure data directory exists for local persistence
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Initialize settings if not exists
const DEFAULT_SETTINGS = {
  vodafoneCashWallet: '01012345678',
  vodafoneCashName: 'CV Maker Official Account',
  proPriceEgp: 49,
  premiumPriceEgp: 99,
  paymentInstructionsAr: 'قم بتحويل المبلغ المطلوب إلى رقم محفظة فودافون كاش الموضحة أعلاه عبر تطبيق أنا فودافون أو كود التحويل (*9*7*الرقم*المبلغ#). بعد إتمام التحويل، أدخل رقم هاتفك المحول منه ورقم العملية (Transaction ID) الوارد في رسالة فودافون لتأكيد طلبك وتفعيل باقتك فوراً.',
  paymentInstructionsEn: 'Transfer the required amount to the Vodafone Cash wallet number shown above via Ana Vodafone app or dialing *9*7*number*amount#. After completing the transfer, enter your sender phone number and the Transaction ID received in the SMS to immediately verify your order and activate your plan.',
  supportPhone: '+201012345678',
  supportEmail: 'support@cvmaker.site',
  adminPasswordHash: 'admin123', // In production, hashed; can be changed in settings
};

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading settings file:', e);
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// Sample initial orders for demo
const INITIAL_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'CVM-83921',
    packageId: 'pro',
    packageName: 'Professional Plan',
    packageNameAr: 'الباقة الاحترافية',
    amountEgp: 49,
    senderPhone: '01099887766',
    transactionId: 'TXN-9841203',
    customerEmail: 'ahmed.dev@example.com',
    customerName: 'أحمد محمود',
    cvTitle: 'Senior Full Stack Engineer CV',
    status: 'paid',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    approvedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    notes: 'Approved automatically after verification',
  },
  {
    id: 'ord-102',
    orderNumber: 'CVM-84190',
    packageId: 'premium',
    packageName: 'Premium Plan',
    packageNameAr: 'الباقة المميزة',
    amountEgp: 99,
    senderPhone: '01065432198',
    transactionId: 'TXN-9845519',
    customerEmail: 'sara.marketing@example.com',
    customerName: 'سارة عبد الرحمن',
    cvTitle: 'Marketing Director Resume',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    approvedAt: null,
    notes: 'Awaiting wallet receipt confirmation',
  }
];

function getOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading orders file:', e);
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(INITIAL_ORDERS, null, 2));
  return INITIAL_ORDERS;
}

function saveOrders(orders: any[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes

// 1. Settings
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  // Don't expose admin password in public settings
  const { adminPasswordHash, ...publicSettings } = settings;
  res.json({ success: true, settings: publicSettings });
});

app.post('/api/settings', (req, res) => {
  const authHeader = req.headers.authorization;
  const currentSettings = getSettings();
  
  if (!authHeader || authHeader !== `Bearer ${currentSettings.adminPasswordHash}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid admin credentials.' });
  }

  const updated = {
    ...currentSettings,
    ...req.body,
  };
  saveSettings(updated);
  res.json({ success: true, message: 'Settings saved successfully', settings: updated });
});

// Admin Auth Check
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const settings = getSettings();
  if (password === settings.adminPasswordHash) {
    return res.json({ success: true, token: settings.adminPasswordHash });
  }
  return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة / Incorrect password' });
});

// 2. Orders List (Admin)
app.get('/api/orders', (req, res) => {
  const authHeader = req.headers.authorization;
  const currentSettings = getSettings();
  if (!authHeader || authHeader !== `Bearer ${currentSettings.adminPasswordHash}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const orders = getOrders();
  res.json({ success: true, orders });
});

// 3. Create Order (Vodafone Cash Checkout)
app.post('/api/orders', (req, res) => {
  const { packageId, packageName, packageNameAr, amountEgp, senderPhone, transactionId, customerEmail, customerName, cvTitle } = req.body;

  if (!senderPhone || !transactionId || !customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'جميع الحقول مطلوبة: رقم الهاتف المحول منه، رقم العملية، والبريد الإلكتروني / All fields required',
    });
  }

  // Sanitize transactionId & phone
  const cleanTxId = String(transactionId).trim().toUpperCase();
  const cleanPhone = String(senderPhone).trim();
  const cleanEmail = String(customerEmail).trim().toLowerCase();

  const orders = getOrders();

  // Prevent duplicate transaction ID usage across orders
  const existingOrderWithTx = orders.find(
    (o) => o.transactionId && o.transactionId.toUpperCase() === cleanTxId
  );

  if (existingOrderWithTx) {
    return res.status(400).json({
      success: false,
      message: 'رقم العملية (Transaction ID) مستخدم بالفعل في طلب سابق. لا يمكن إعادة استخدام نفس الإشعار / This Transaction ID has already been submitted.',
    });
  }

  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: `CVM-${randomSuffix}`,
    packageId: packageId || 'pro',
    packageName: packageName || 'Professional Plan',
    packageNameAr: packageNameAr || 'الباقة الاحترافية',
    amountEgp: Number(amountEgp) || 49,
    senderPhone: cleanPhone,
    transactionId: cleanTxId,
    customerEmail: cleanEmail,
    customerName: customerName || 'عميل محترم',
    cvTitle: cvTitle || 'My Resume',
    status: 'pending',
    createdAt: new Date().toISOString(),
    approvedAt: null,
    notes: 'تم استلام طلب التحويل، بانتظار مراجعة الإدارة / Submitted, awaiting admin review',
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  res.json({
    success: true,
    message: 'تم تسجيل طلبك بنجاح وهو قيد المراجعة الآن / Order submitted successfully and is pending review',
    order: newOrder,
  });
});

// 4. Check Order Status (Public Order Tracker)
app.get('/api/orders/track', (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال رقم الطلب أو البريد الإلكتروني أو رقم العملية' });
  }

  const orders = getOrders();
  const found = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase() === query.toLowerCase() ||
      o.customerEmail.toLowerCase() === query.toLowerCase() ||
      o.transactionId.toLowerCase() === query.toLowerCase() ||
      o.senderPhone === query
  );

  if (found.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على أي طلب يطابق هذا البحث / No matching order found',
    });
  }

  res.json({ success: true, orders: found });
});

// 5. Verify User Access for Pro/Premium features & PDF downloads
app.post('/api/verify-access', (req, res) => {
  const { email, orderNumber } = req.body;
  const orders = getOrders();

  let hasPro = false;
  let hasPremium = false;
  let activeOrder = null;

  if (orderNumber) {
    activeOrder = orders.find((o) => o.orderNumber.toUpperCase() === String(orderNumber).trim().toUpperCase() && o.status === 'paid');
  }

  if (!activeOrder && email) {
    activeOrder = orders.find((o) => o.customerEmail.toLowerCase() === String(email).trim().toLowerCase() && o.status === 'paid');
  }

  if (activeOrder) {
    if (activeOrder.packageId === 'premium') {
      hasPremium = true;
      hasPro = true;
    } else if (activeOrder.packageId === 'pro') {
      hasPro = true;
    }
  }

  res.json({
    success: true,
    isPaid: Boolean(activeOrder),
    hasPro,
    hasPremium,
    activeOrder: activeOrder ? {
      orderNumber: activeOrder.orderNumber,
      packageName: activeOrder.packageName,
      status: activeOrder.status,
      approvedAt: activeOrder.approvedAt,
    } : null,
  });
});

// 6. Admin Approve Order
app.post('/api/orders/:orderId/approve', (req, res) => {
  const authHeader = req.headers.authorization;
  const currentSettings = getSettings();
  if (!authHeader || authHeader !== `Bearer ${currentSettings.adminPasswordHash}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { orderId } = req.params;
  const orders = getOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  orders[orderIndex].status = 'paid';
  orders[orderIndex].approvedAt = new Date().toISOString();
  orders[orderIndex].notes = req.body.notes || 'تم تأكيد استلام التحويل وتفعيل الباقة بنجاح / Confirmed & Activated';

  saveOrders(orders);
  res.json({ success: true, message: 'Order approved successfully', order: orders[orderIndex] });
});

// 7. Admin Reject Order
app.post('/api/orders/:orderId/reject', (req, res) => {
  const authHeader = req.headers.authorization;
  const currentSettings = getSettings();
  if (!authHeader || authHeader !== `Bearer ${currentSettings.adminPasswordHash}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { orderId } = req.params;
  const orders = getOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  orders[orderIndex].status = 'rejected';
  orders[orderIndex].notes = req.body.reason || 'لم يتم العثور على تحويل مطابق في المحفظة / Transfer not verified';

  saveOrders(orders);
  res.json({ success: true, message: 'Order rejected', order: orders[orderIndex] });
});

// 8. AI Assistant Endpoints
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { task, data, lang = 'ar' } = req.body;

    let prompt = '';
    const isAr = lang === 'ar';

    if (task === 'summary') {
      prompt = `You are a world-class professional CV writer and career strategist.
Generate 3 distinct, high-impact professional summaries for a resume.
Target Job Title: ${data.jobTitle || 'Professional'}
Years of experience / Background: ${data.experienceYears || 'Experienced'}
Key skills: ${data.skills || 'Not specified'}
Current draft / notes: ${data.draft || 'None'}
Language: ${isAr ? 'Arabic (العربية الفصحى الاحترافية)' : 'English (High-impact executive English)'}

Return pure JSON matching this format:
{
  "options": [
    {
      "style": "${isAr ? 'تنفيذي قوي' : 'Executive & Results-Driven'}",
      "text": "..."
    },
    {
      "style": "${isAr ? 'تقني ومباشر' : 'Modern & Metric-Focused'}",
      "text": "..."
    },
    {
      "style": "${isAr ? 'مختصر ومؤثر' : 'Concise & Impactful'}",
      "text": "..."
    }
  ]
}
Do not invent fake degrees or certifications. Keep it realistic, ATS-friendly, with strong action verbs.`;
    } else if (task === 'enhance-bullet') {
      prompt = `You are an expert resume editor and ATS specialist.
Enhance the following job description bullet point into 3 powerful, achievement-oriented versions using Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]):
Original bullet: "${data.bullet}"
Role: ${data.role || 'Professional'}
Language: ${isAr ? 'Arabic' : 'English'}

Return pure JSON:
{
  "enhancedBullets": [
    "...",
    "...",
    "..."
  ]
}`;
    } else if (task === 'suggest-skills') {
      prompt = `Suggest the top relevant hard skills, soft skills, and industry tools for the job title: "${data.jobTitle}".
Language: ${isAr ? 'Arabic' : 'English'}

Return pure JSON:
{
  "hardSkills": ["...", "...", "..."],
  "softSkills": ["...", "...", "..."],
  "tools": ["...", "...", "..."]
}`;
    } else if (task === 'ats-score') {
      prompt = `Analyze this CV for ATS (Applicant Tracking System) compatibility, readability, and recruiter impact.
CV Data:
Full Name: ${data.personalInfo?.fullName || 'Candidate'}
Title: ${data.personalInfo?.jobTitle || ''}
Summary: ${data.personalInfo?.summary || ''}
Experience Count: ${data.experiences?.length || 0}
Skills: ${(data.skills || []).map((s: any) => s.name).join(', ')}
Education Count: ${data.education?.length || 0}
Language: ${isAr ? 'Arabic' : 'English'}

Return pure JSON:
{
  "score": 85,
  "verdict": "${isAr ? 'ممتاز مع فرص تحسين بسيطة' : 'Strong ATS compatibility with minor improvement areas'}",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "keywordSuggestions": ["...", "..."]
}`;
    } else if (task === 'translate') {
      const targetLang = data.targetLang === 'ar' ? 'Arabic' : 'English';
      prompt = `Translate and professionally localize the following CV content into ${targetLang}. Ensure natural, polished corporate phrasing suitable for top tier companies and ATS systems:
Content:
${JSON.stringify(data.content)}

Return the translated content in pure JSON matching the input structure.`;
    } else if (task === 'cover-letter') {
      prompt = `Write a persuasive, highly tailored cover letter for:
Candidate Name: ${data.fullName || 'Candidate'}
Job Title applied for: ${data.jobTitle || 'Position'}
Company Name: ${data.companyName || 'Hiring Company'}
Candidate Experience & Strengths: ${data.experience || ''}
Language: ${isAr ? 'Arabic' : 'English'}

Return pure JSON:
{
  "subject": "...",
  "opening": "...",
  "bodyParagraphs": ["...", "...", "..."],
  "closing": "...",
  "fullLetter": "..."
}`;
    } else {
      prompt = `Provide helpful resume advice for: ${JSON.stringify(data)}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Error communicating with AI Assistant',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CV Maker Pro Server running on port ${PORT}`);
  });
}

startServer();
