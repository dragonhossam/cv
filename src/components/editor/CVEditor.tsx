import React, { useState } from 'react';
import { CVData, Language } from '../../types';
import { translations } from '../../data/translations';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Globe,
  Award,
  BookOpen,
  FolderKanban,
  Trophy,
  HeartHandshake,
  Users,
  Palette,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Wand2,
  Upload,
} from 'lucide-react';

interface CVEditorProps {
  cv: CVData;
  onChange: (updated: CVData) => void;
  lang: Language;
  onOpenAI: (task: string, fieldData?: any) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({ cv, onChange, lang, onOpenAI }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<string>('personal');

  // Helper to update personal info
  const handlePersonalChange = (field: string, value: string) => {
    onChange({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value,
      },
    });
  };

  // Helper to update settings
  const handleSettingChange = (field: string, value: any) => {
    onChange({
      ...cv,
      settings: {
        ...cv.settings,
        [field]: value,
      },
    });
  };

  // Section toggle visibility
  const toggleSectionVisibility = (sectionName: string) => {
    const hidden = cv.settings.hiddenSections || [];
    const isHidden = hidden.includes(sectionName);
    const updatedHidden = isHidden
      ? hidden.filter((s) => s !== sectionName)
      : [...hidden, sectionName];
    handleSettingChange('hiddenSections', updatedHidden);
  };

  // Experience handlers
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
    };
    onChange({ ...cv, experiences: [newExp, ...cv.experiences] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = cv.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp));
    onChange({ ...cv, experiences: updated });
  };

  const removeExperience = (id: string) => {
    onChange({ ...cv, experiences: cv.experiences.filter((exp) => exp.id !== id) });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    };
    onChange({ ...cv, education: [newEdu, ...cv.education] });
  };

  const updateEducation = (id: string, field: string, value: any) => {
    const updated = cv.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu));
    onChange({ ...cv, education: updated });
  };

  const removeEducation = (id: string) => {
    onChange({ ...cv, education: cv.education.filter((edu) => edu.id !== id) });
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill = {
      id: `sk-${Date.now()}`,
      name: '',
      level: 4,
      category: 'Technical' as const,
    };
    onChange({ ...cv, skills: [...cv.skills, newSkill] });
  };

  const updateSkill = (id: string, field: string, value: any) => {
    const updated = cv.skills.map((sk) => (sk.id === id ? { ...sk, [field]: value } : sk));
    onChange({ ...cv, skills: updated });
  };

  const removeSkill = (id: string) => {
    onChange({ ...cv, skills: cv.skills.filter((sk) => sk.id !== id) });
  };

  // Projects handlers
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: '',
      role: '',
      description: '',
      link: '',
      technologies: '',
      highlights: [],
    };
    onChange({ ...cv, projects: [newProj, ...cv.projects] });
  };

  const updateProject = (id: string, field: string, value: any) => {
    const updated = cv.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj));
    onChange({ ...cv, projects: updated });
  };

  const removeProject = (id: string) => {
    onChange({ ...cv, projects: cv.projects.filter((proj) => proj.id !== id) });
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Editor Navigation Tabs
  const tabs = [
    { id: 'personal', label: t.personalInfo, icon: User },
    { id: 'summary', label: t.professionalSummary, icon: FileText },
    { id: 'experience', label: t.workExperience, icon: Briefcase },
    { id: 'education', label: t.education, icon: GraduationCap },
    { id: 'skills', label: t.skills, icon: Sparkles },
    { id: 'projects', label: t.projects, icon: FolderKanban },
    { id: 'certifications', label: t.certifications, icon: Award },
    { id: 'styling', label: lang === 'ar' ? 'المظهر والألوان' : 'Style & Theme', icon: Palette },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Top Section Nav Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none p-1.5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Main Tab Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* 1. PERSONAL INFO TAB */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>{t.personalInfo}</span>
              </h2>
            </div>

            {/* Photo & Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {cv.personalInfo.photoUrl ? (
                  <img
                    src={cv.personalInfo.photoUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {lang === 'ar' ? 'صورة الملف الشخصي' : 'Profile Photo'}
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>{lang === 'ar' ? 'رفع صورة' : 'Upload File'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <label className="flex items-center gap-1 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={cv.settings.showPhoto}
                        onChange={(e) => handleSettingChange('showPhoto', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{lang === 'ar' ? 'إظهار الصورة في السيرة الذاتية' : 'Show Photo in CV'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.fullName}</label>
                <input
                  type="text"
                  value={cv.personalInfo.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. John Doe / م. أحمد محمد"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.jobTitle}</label>
                <input
                  type="text"
                  value={cv.personalInfo.jobTitle}
                  onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Senior Software Architect"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.email}</label>
                <input
                  type="email"
                  value={cv.personalInfo.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.phone}</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={cv.personalInfo.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="+20 101 234 5678"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.location}</label>
                <input
                  type="text"
                  value={cv.personalInfo.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Cairo, Egypt / Dubai, UAE"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.website}</label>
                <input
                  type="text"
                  value={cv.personalInfo.website}
                  onChange={(e) => handlePersonalChange('website', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="https://myportfolio.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.linkedin}</label>
                <input
                  type="text"
                  value={cv.personalInfo.linkedin}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.github}</label>
                <input
                  type="text"
                  value={cv.personalInfo.github}
                  onChange={(e) => handlePersonalChange('github', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="github.com/username"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFESSIONAL SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t.professionalSummary}</span>
              </h2>
              <button
                type="button"
                onClick={() =>
                  onOpenAI('summary', {
                    jobTitle: cv.personalInfo.jobTitle,
                    draft: cv.personalInfo.summary,
                    skills: cv.skills.map((s) => s.name).join(', '),
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 shadow-sm cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'صياغة ذكية بواسطة AI' : 'Generate with AI'}</span>
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">
                {lang === 'ar'
                  ? 'اكتب ملخصاً مهنياً قوياً يبرز سنوات خبرتك وأهم مجالات تميزك والنتائج التي حققتها.'
                  : 'Write a compelling 3-4 sentence summary highlighting your years of experience, core domains, and major measurable results.'}
              </p>
              <textarea
                rows={6}
                value={cv.personalInfo.summary}
                onChange={(e) => handlePersonalChange('summary', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed"
                placeholder={lang === 'ar' ? 'اكتب نبذتك المهنية هنا...' : 'Write your executive summary here...'}
              />
            </div>
          </div>
        )}

        {/* 3. WORK EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>{t.workExperience}</span>
              </h2>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة خبرة' : 'Add Experience'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {cv.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      #{idx + 1} {exp.company || (lang === 'ar' ? 'خبرة عمل جديدة' : 'New Role')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.jobTitle}</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="e.g. Senior Tech Lead"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.company}</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="e.g. Google / Vodafone"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.location}</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="Cairo / Remote"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t.startDate}</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          placeholder="YYYY-MM"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t.endDate}</label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                          placeholder={exp.current ? (lang === 'ar' ? 'حتى الآن' : 'Present') : 'YYYY-MM'}
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>{t.currentJob}</span>
                  </label>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t.description}</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="High level responsibilities..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">{t.highlights}</label>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenAI('enhance-bullet', {
                            bullet: exp.highlights[0] || exp.description || 'Led projects and boosted performance',
                            role: exp.title,
                          })
                        }
                        className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'تحسين النقاط بالذكاء الاصطناعي' : 'Enhance with AI'}</span>
                      </button>
                    </div>
                    {exp.highlights.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex gap-2 mb-1.5">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newHighlights = [...exp.highlights];
                            newHighlights[bIdx] = e.target.value;
                            updateExperience(exp.id, 'highlights', newHighlights);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          placeholder="e.g. Boosted API performance by 40% using Redis caching"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newHighlights = exp.highlights.filter((_, i) => i !== bIdx);
                            updateExperience(exp.id, 'highlights', newHighlights);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        updateExperience(exp.id, 'highlights', [...exp.highlights, '']);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium mt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'إضافة نقطة إنجاز' : 'Add Bullet'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{t.education}</span>
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة مؤهل' : 'Add Education'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {cv.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      #{idx + 1} {edu.degree || (lang === 'ar' ? 'مؤهل تعليمي جديد' : 'New Degree')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.degree}</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="B.Sc. in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.institution}</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="Cairo University"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {lang === 'ar' ? 'التقدير / المعدل' : 'Grade / GPA'}
                      </label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="Excellent / 3.8 GPA"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t.startDate}</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          placeholder="2016"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t.endDate}</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{t.skills}</span>
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAI('suggest-skills', { jobTitle: cv.personalInfo.jobTitle })}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium hover:bg-indigo-100 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'اقتراح مهارات بالذكاء الاصطناعي' : 'Suggest Skills'}</span>
                </button>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة مهارة' : 'Add Skill'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cv.skills.map((skill) => (
                <div key={skill.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="e.g. React.js / Node.js"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', Number(e.target.value))}
                    className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={5}>5/5 (Master)</option>
                    <option value={4}>4/5 (Advanced)</option>
                    <option value={3}>3/5 (Intermediate)</option>
                    <option value={2}>2/5 (Basic)</option>
                    <option value={1}>1/5 (Novice)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-600" />
                <span>{t.projects}</span>
              </h2>
              <button
                type="button"
                onClick={addProject}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة مشروع' : 'Add Project'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {cv.projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                      className="w-2/3 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                      placeholder="Project Name / اسم المشروع"
                    />
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.technologies || ''}
                      onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Technologies: React, Node, AWS"
                    />
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Demo / GitHub URL"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Project details, your role, and achievements..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>{t.certifications}</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newCert = {
                    id: `cert-${Date.now()}`,
                    name: '',
                    issuer: '',
                    date: '',
                  };
                  onChange({ ...cv, certifications: [...cv.certifications, newCert] });
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة شهادة' : 'Add Certification'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {cv.certifications.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-2 items-center">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const updated = cv.certifications.map((item) =>
                        item.id === c.id ? { ...item, name: e.target.value } : item
                      );
                      onChange({ ...cv, certifications: updated });
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Certification Name"
                  />
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => {
                      const updated = cv.certifications.map((item) =>
                        item.id === c.id ? { ...item, issuer: e.target.value } : item
                      );
                      onChange({ ...cv, certifications: updated });
                    }}
                    className="w-1/3 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Issuer (e.g. AWS)"
                  />
                  <input
                    type="text"
                    value={c.date}
                    onChange={(e) => {
                      const updated = cv.certifications.map((item) =>
                        item.id === c.id ? { ...item, date: e.target.value } : item
                      );
                      onChange({ ...cv, certifications: updated });
                    }}
                    className="w-24 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="Date"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...cv,
                        certifications: cv.certifications.filter((item) => item.id !== c.id),
                      });
                    }}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. STYLING & SETTINGS TAB */}
        {activeTab === 'styling' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>{lang === 'ar' ? 'تخصيص المظهر والألوان والخطوط' : 'Style & Appearance'}</span>
              </h2>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {lang === 'ar' ? 'اللون الرئيسي للقالب' : 'Theme Accent Color'}
              </label>
              <div className="flex items-center gap-3">
                {[
                  '#1e293b', // Slate Navy
                  '#1e3a8a', // Corporate Blue
                  '#0f766e', // Nordic Teal
                  '#065f46', // Emerald
                  '#7c3aed', // Creative Violet
                  '#c026d3', // Magenta
                  '#ea580c', // Amber
                  '#881337', // Crimson Harvard
                  '#18181b', // Pure Charcoal
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleSettingChange('themeColor', color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      cv.settings.themeColor === color ? 'scale-125 border-blue-600 shadow-md' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={cv.settings.themeColor}
                  onChange={(e) => handleSettingChange('themeColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {lang === 'ar' ? 'نوع الخط (Typography)' : 'Font Family'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'inter', label: 'Inter (Modern Sans)' },
                  { id: 'cairo', label: 'Cairo (عربي عصري)' },
                  { id: 'tajawal', label: 'Tajawal (عربي أنيق)' },
                  { id: 'serif', label: 'Serif (Classic Formal)' },
                  { id: 'mono', label: 'Monospace (Dev / Tech)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSettingChange('font', f.id)}
                    className={`px-3 py-2 text-xs rounded-xl border text-center font-medium transition-all cursor-pointer ${
                      cv.settings.font === f.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Visibility Toggles */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {lang === 'ar' ? 'إظهار / إخفاء أقسام السيرة الذاتية' : 'Show / Hide Sections'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'professionalSummary', label: t.professionalSummary },
                  { id: 'experiences', label: t.workExperience },
                  { id: 'education', label: t.education },
                  { id: 'skills', label: t.skills },
                  { id: 'projects', label: t.projects },
                  { id: 'certifications', label: t.certifications },
                  { id: 'languages', label: t.languages },
                  { id: 'achievements', label: t.achievements },
                ].map((sec) => {
                  const isHidden = cv.settings.hiddenSections?.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => toggleSectionVisibility(sec.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        !isHidden
                          ? 'bg-slate-50 border-slate-300 text-slate-800'
                          : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                      }`}
                    >
                      <span>{sec.label}</span>
                      {!isHidden ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
