import React, { useState } from 'react';
import { CVData, Language } from '../../types';
import { translations } from '../../data/translations';
import {
  X,
  Wand2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Languages,
  Target,
  FileText,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CVData;
  lang: Language;
  initialTask?: string;
  initialData?: any;
  onApplySummary: (summary: string) => void;
  onApplySkills: (skills: string[]) => void;
  onApplyTranslatedCV?: (translatedData: any) => void;
  isPaidUser: boolean;
  onRequireUpgrade: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  cv,
  lang,
  initialTask = 'summary',
  initialData = {},
  onApplySummary,
  onApplySkills,
  onApplyTranslatedCV,
  isPaidUser,
  onRequireUpgrade,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<string>(initialTask);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Tab 1: Summary state
  const [summaryRole, setSummaryRole] = useState(cv.personalInfo.jobTitle || 'Software Engineer');
  const [summaryExp, setSummaryExp] = useState('5+ years');
  const [summaryResults, setSummaryResults] = useState<any[]>([]);

  // Tab 2: Bullet enhancer state
  const [bulletInput, setBulletInput] = useState(
    initialData?.bullet || 'Responsible for managing projects and team members.'
  );
  const [enhancedBullets, setEnhancedBullets] = useState<string[]>([]);

  // Tab 3: Skills suggestion state
  const [skillsJobTitle, setSkillsJobTitle] = useState(cv.personalInfo.jobTitle || '');
  const [suggestedSkills, setSuggestedSkills] = useState<{ hardSkills: string[]; softSkills: string[] } | null>(null);

  // Tab 4: ATS Score state
  const [atsAnalysis, setAtsAnalysis] = useState<any>(null);

  // Tab 5: Translate CV
  const [targetLang, setTargetLang] = useState<'ar' | 'en'>(lang === 'ar' ? 'en' : 'ar');
  const [translationResult, setTranslationResult] = useState<any>(null);

  // Call Gemini API
  const handleGenerate = async (task: string, payload: any) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          data: payload,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error executing AI generation');
      }

      return data.result;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to call Gemini AI Assistant');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Generate Summaries
  const generateSummaries = async () => {
    const res = await handleGenerate('summary', {
      jobTitle: summaryRole,
      experienceYears: summaryExp,
      draft: cv.personalInfo.summary,
      skills: cv.skills.map((s) => s.name).join(', '),
    });
    if (res?.options) {
      setSummaryResults(res.options);
    }
  };

  // Enhance Bullet
  const enhanceBullet = async () => {
    const res = await handleGenerate('enhance-bullet', {
      bullet: bulletInput,
      role: cv.personalInfo.jobTitle,
    });
    if (res?.enhancedBullets) {
      setEnhancedBullets(res.enhancedBullets);
    }
  };

  // Suggest Skills
  const suggestSkills = async () => {
    const res = await handleGenerate('suggest-skills', {
      jobTitle: skillsJobTitle || cv.personalInfo.jobTitle,
    });
    if (res) {
      setSuggestedSkills(res);
    }
  };

  // Calculate ATS Score
  const calculateAtsScore = async () => {
    const res = await handleGenerate('ats-score', {
      personalInfo: cv.personalInfo,
      experiences: cv.experiences,
      education: cv.education,
      skills: cv.skills,
    });
    if (res) {
      setAtsAnalysis(res);
    }
  };

  // Translate CV
  const translateCV = async () => {
    const res = await handleGenerate('translate', {
      targetLang,
      content: {
        fullName: cv.personalInfo.fullName,
        jobTitle: cv.personalInfo.jobTitle,
        summary: cv.personalInfo.summary,
        experiences: cv.experiences.map((e) => ({
          title: e.title,
          company: e.company,
          description: e.description,
          highlights: e.highlights,
        })),
        skills: cv.skills.map((s) => s.name),
      },
    });
    if (res) {
      setTranslationResult(res);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white relative flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>{lang === 'ar' ? 'مساعد الذكاء الاصطناعي للسير الذاتية' : 'AI Resume Career Strategist'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/30 text-blue-200 border border-blue-400/20">
                  Gemini 3.8
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'ar'
                  ? 'صياغة احترافية، تحسين الإنجازات بالأرقام، وفحص التوافق مع ATS'
                  : 'Executive summaries, impact bullets, ATS scoring, and bilingual translation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-1 overflow-x-auto scrollbar-none py-1.5">
          {[
            { id: 'summary', label: lang === 'ar' ? 'صياغة الملخص' : 'Summary Writer', icon: FileText },
            { id: 'enhance-bullet', label: lang === 'ar' ? 'تحسين نقاط الخبرة' : 'Enhance Bullets', icon: Target },
            { id: 'suggest-skills', label: lang === 'ar' ? 'اقتراح مهارات' : 'Suggest Skills', icon: Sparkles },
            { id: 'ats-score', label: lang === 'ar' ? 'فحص ATS' : 'ATS Score', icon: BarChart2 },
            { id: 'translate', label: lang === 'ar' ? 'ترجمة السيرة' : 'Translate CV', icon: Languages },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Summary Writer */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المسمى الوظيفي المستهدف' : 'Target Job Title'}
                  </label>
                  <input
                    type="text"
                    value={summaryRole}
                    onChange={(e) => setSummaryRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'سنوات ومستوى الخبرة' : 'Years of Experience'}
                  </label>
                  <input
                    type="text"
                    value={summaryExp}
                    onChange={(e) => setSummaryExp(e.target.value)}
                    placeholder="e.g. 7+ years in tech"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={generateSummaries}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'توليد 3 نماذج احترافية بـ AI' : 'Generate 3 Tailored Options'}</span>
                  </>
                )}
              </button>

              {summaryResults.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'ar' ? 'الخيارات المولدة بواسطة الذكاء الاصطناعي:' : 'AI Generated Summaries:'}
                  </h4>
                  {summaryResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.style}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.text, idx)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                          >
                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onApplySummary(item.text);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {lang === 'ar' ? 'استخدام هذا الملخص' : 'Apply to CV'}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Enhance Bullets */}
          {activeTab === 'enhance-bullet' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'أدخل النقطة أو المهمة التي تريد تحسينها' : 'Enter existing bullet / responsibility'}
                </label>
                <textarea
                  rows={3}
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={enhanceBullet}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تحويل إلى إنجازات مبهرة وصيغة XYZ' : 'Enhance with Action Verbs & Metrics'}</span>
                  </>
                )}
              </button>

              {enhancedBullets.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'ar' ? 'الصياغات المقترحة:' : 'Enhanced Variations:'}
                  </h4>
                  {enhancedBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3"
                    >
                      <p className="text-xs text-slate-800 leading-relaxed flex-1">
                        • {bullet}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(bullet, idx)}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
                      >
                        {copiedIdx === idx ? t.copied : (lang === 'ar' ? 'نسخ' : 'Copy')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Suggest Skills */}
          {activeTab === 'suggest-skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'المسمى الوظيفي المطلوب اقتراح مهاراته' : 'Target Job Title'}
                </label>
                <input
                  type="text"
                  value={skillsJobTitle}
                  onChange={(e) => setSkillsJobTitle(e.target.value)}
                  placeholder="e.g. Senior Product Manager / مبرمج تطبيقات"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={suggestSkills}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'استخراج أهم المهارات الأكثر طلباً' : 'Suggest In-Demand Skills'}</span>
                  </>
                )}
              </button>

              {suggestedSkills && (
                <div className="space-y-3 pt-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 mb-1.5">
                      {lang === 'ar' ? 'المهارات التقنية والتخصصية (Hard Skills):' : 'Hard & Technical Skills:'}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.hardSkills?.map((skill, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onApplySkills([skill])}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium cursor-pointer"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800 mb-1.5">
                      {lang === 'ar' ? 'المهارات الشخصية والقيادية (Soft Skills):' : 'Soft & Leadership Skills:'}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.softSkills?.map((skill, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onApplySkills([skill])}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium cursor-pointer"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. ATS Score & Check */}
          {activeTab === 'ats-score' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.atsTitle}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'يقوم النموذج بفحص سيرتك الحالية ومقارنتها بمعايير أنظمة التوظيف العالمية.'
                      : 'Evaluates format, keyword density, action verbs, and ATS compatibility.'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={calculateAtsScore}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  <span>{t.atsCalculate}</span>
                </button>
              </div>

              {atsAnalysis && (
                <div className="space-y-4 pt-2">
                  {/* Score Pill */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-700 uppercase">
                        {t.atsScoreLabel}
                      </span>
                      <div className="text-xs text-slate-600 mt-1 font-medium">{atsAnalysis.verdict}</div>
                    </div>
                    <div className="text-3xl font-black text-blue-700">
                      {atsAnalysis.score}
                      <span className="text-sm font-bold text-blue-400">/100</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  {atsAnalysis.strengths && (
                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                      <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.atsStrengths}</span>
                      </h5>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        {atsAnalysis.strengths.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {atsAnalysis.improvements && (
                    <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                      <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{t.atsImprovements}</span>
                      </h5>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        {atsAnalysis.improvements.map((imp: string, idx: number) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. Translate CV */}
          {activeTab === 'translate' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {lang === 'ar' ? 'ترجمة السيرة الذاتية بدقة عالية' : 'Bilingual Resume Translation'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'ترجمة احترافية للملخص والخبرات والمهارات مع مراعاة المصطلحات المهنية.'
                      : 'Professional localization between English and Arabic.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="en">English (الإنجليزية)</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={translateCV}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {translationResult && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-700">
                      {lang === 'ar' ? 'تمت الترجمة بنجاح' : 'Translation Ready'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(translationResult, null, 2), 999)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      {copiedIdx === 999 ? t.copied : (lang === 'ar' ? 'نسخ الترجمة' : 'Copy All')}
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 space-y-2 max-h-60 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200 font-sans">
                    <div>
                      <strong>Job Title:</strong> {translationResult.jobTitle}
                    </div>
                    <div>
                      <strong>Summary:</strong> {translationResult.summary}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
