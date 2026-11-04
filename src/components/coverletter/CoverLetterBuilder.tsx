import React, { useState } from 'react';
import { CVData, Language } from '../../types';
import { translations } from '../../data/translations';
import {
  FileText,
  Wand2,
  Printer,
  Copy,
  Check,
  Building,
  User,
  Briefcase,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface CoverLetterBuilderProps {
  cv: CVData;
  lang: Language;
}

export const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({ cv, lang }) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [companyName, setCompanyName] = useState('Google Inc. / شركة النظم العالمية');
  const [targetRole, setTargetRole] = useState(cv.personalInfo.jobTitle || 'Senior Software Engineer');
  const [hiringManager, setHiringManager] = useState(isAr ? 'مدير التوظيف المحترم' : 'Hiring Manager');
  const [subject, setSubject] = useState(
    isAr
      ? `طلب توظيف لوظيفة ${targetRole} - ${cv.personalInfo.fullName}`
      : `Application for ${targetRole} - ${cv.personalInfo.fullName}`
  );

  const [opening, setOpening] = useState(
    isAr
      ? `يسرني أن أتقدم بطلبي لشغل وظيفة ${targetRole} لدى ${companyName}، واثقاً من أن خبرتي الممتدة في هندسة البرمجيات والقيادة التقنية ستشكل إضافة نوعية لفريقكم.`
      : `I am writing to express my enthusiastic interest in the ${targetRole} position at ${companyName}. With over 8 years of specialized software architecture experience, I am eager to contribute to your engineering excellence.`
  );

  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>([
    isAr
      ? `خلال مسيرتي المهنية الأخيرة، قدت تصميم وبناء بنى تحتية سحابية تخدم ملايين المستخدمين بنجاح، مما أسهم في خفض تكاليف الاستضافة بنسبة 35% وزيادة سرعة الاستجابة بنسبة تزيد عن 50%.`
      : `In my recent roles, I have spearheaded the design and delivery of high-throughput distributed microservices serving over 5M active monthly users while reducing infrastructure overhead by 35%.`,
    isAr
      ? `أمتلك سجلاً حافلاً في قيادة وتأهيل الفرق البرمجية وتطبيق منهجيات Agile الحديثة مع التزام صارم بأعلى معايير جودة الكود والأمان.`
      : `I bring deep hands-on expertise in React, TypeScript, and cloud-native systems, coupled with a proven track record of mentoring high-performing engineering squads.`,
  ]);

  const [closing, setClosing] = useState(
    isAr
      ? `أتطلع بشغف لمناقشة كيف يمكن لخبراتي ومهاراتي دعم أهداف ${companyName} وتطلعاتكم المستقبلية. شاكراً لكم وقتكم واهتمامكم.`
      : `I would welcome the opportunity to discuss how my technical acumen and leadership style align with the high standards of ${companyName}. Thank you for your time and consideration.`
  );

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate with AI
  const handleAIGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'cover-letter',
          data: {
            fullName: cv.personalInfo.fullName,
            jobTitle: targetRole,
            companyName,
            experience: `${cv.personalInfo.summary}. Skills: ${cv.skills.slice(0, 5).map((s) => s.name).join(', ')}`,
          },
          lang,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        if (data.result.subject) setSubject(data.result.subject);
        if (data.result.opening) setOpening(data.result.opening);
        if (data.result.bodyParagraphs) setBodyParagraphs(data.result.bodyParagraphs);
        if (data.result.closing) setClosing(data.result.closing);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    const fullText = `${cv.personalInfo.fullName}\n${cv.personalInfo.email} | ${cv.personalInfo.phone}\n${new Date().toLocaleDateString()}\n\n${hiringManager}\n${companyName}\n\nSubject: ${subject}\n\n${opening}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}\n\nSincerely,\n${cv.personalInfo.fullName}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Editor Controls Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{lang === 'ar' ? 'إعداد خطاب التقديم (Cover Letter)' : 'Cover Letter Settings'}</span>
            </h2>
            <button
              type="button"
              disabled={loading}
              onClick={handleAIGenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
              <span>{lang === 'ar' ? 'توليد ذكي بـ AI' : 'Generate with AI'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'اسم الشركة المستهدفة' : 'Target Company Name'}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'المسمى الوظيفي المتقدم إليه' : 'Applied Job Title'}
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'موضوع الخطاب (Subject)' : 'Subject Line'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'الفقرة الافتتاحية' : 'Opening Paragraph'}
              </label>
              <textarea
                rows={3}
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {bodyParagraphs.map((p, idx) => (
              <div key={idx}>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? `فقرة المتن (${idx + 1})` : `Body Paragraph ${idx + 1}`}
                </label>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const updated = [...bodyParagraphs];
                    updated[idx] = e.target.value;
                    setBodyParagraphs(updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'فقرة الختام' : 'Closing Paragraph'}
              </label>
              <textarea
                rows={2}
                value={closing}
                onChange={(e) => setClosing(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Paper Column */}
      <div className="lg:col-span-7 space-y-4">
        {/* Actions Bar */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm no-print">
          <span className="text-xs font-bold text-slate-700">
            {lang === 'ar' ? 'معاينة جاهزة للطباعة A4' : 'A4 Print-Ready Live Preview'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : (lang === 'ar' ? 'نسخ النص' : 'Copy Text')}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printCV}</span>
            </button>
          </div>
        </div>

        {/* Paper Document */}
        <div
          id="cv-preview-container"
          className="a4-sheet bg-white text-slate-800 shadow-xl p-12 mx-auto rounded-xl border border-slate-200 space-y-6 text-xs leading-relaxed print-area font-sans"
        >
          {/* Sender Header */}
          <div className="border-b-2 border-slate-900 pb-5">
            <h1 className="text-xl font-bold text-slate-900">{cv.personalInfo.fullName}</h1>
            <p className="text-xs text-blue-700 font-semibold">{cv.personalInfo.jobTitle}</p>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 mt-2">
              <span>{cv.personalInfo.email}</span>
              <span dir="ltr">{cv.personalInfo.phone}</span>
              <span>{cv.personalInfo.location}</span>
            </div>
          </div>

          {/* Date & Recipient */}
          <div className="space-y-1 text-slate-700">
            <div className="text-slate-500">{new Date().toLocaleDateString()}</div>
            <div className="font-bold text-slate-900">{hiringManager}</div>
            <div className="font-semibold">{companyName}</div>
          </div>

          {/* Subject */}
          <div className="font-bold text-slate-900 bg-slate-50 p-2.5 rounded border-s-4 border-blue-600 text-[13px]">
            {subject}
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-slate-700 leading-relaxed text-[12px]">
            <p>{opening}</p>
            {bodyParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <p>{closing}</p>
          </div>

          {/* Signoff */}
          <div className="pt-6">
            <div className="text-slate-600 mb-6">{isAr ? 'وتفضلوا بقبول فائق الاحترام والتقدير،' : 'Sincerely,'}</div>
            <div className="font-bold text-sm text-slate-900">{cv.personalInfo.fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
