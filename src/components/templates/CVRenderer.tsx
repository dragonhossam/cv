import React from 'react';
import { CVData, CVTemplate } from '../../types';
import { CV_TEMPLATES } from '../../data/templates';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface CVRendererProps {
  cv: CVData;
  scale?: number;
  printMode?: boolean;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ cv, scale = 1, printMode = false }) => {
  const template: CVTemplate =
    CV_TEMPLATES.find((t) => t.id === cv.settings.templateId) || CV_TEMPLATES[0];

  const isRtl = cv.settings.language === 'ar';
  const themeColor = cv.settings.themeColor || template.accentColor || '#1e293b';

  // Helper to check if a section is hidden
  const isVisible = (sectionName: string) => !cv.settings.hiddenSections?.includes(sectionName);

  // Font class
  const getFontClass = () => {
    if (cv.settings.font === 'serif' || template.font === 'serif') return 'font-serif-classic';
    if (cv.settings.font === 'mono' || template.font === 'mono') return 'font-mono-code';
    if (cv.settings.font === 'cairo') return 'font-cairo';
    if (cv.settings.font === 'tajawal') return 'font-tajawal';
    if (isRtl) return 'font-cairo';
    return 'font-sans';
  };

  // Section titles localized
  const titles = {
    summary: isRtl ? 'الملخص المهني' : 'Professional Summary',
    experience: isRtl ? 'الخبرات المهنية' : 'Work Experience',
    education: isRtl ? 'المؤهلات التعليمية' : 'Education',
    skills: isRtl ? 'المهارات والقدرات' : 'Key Skills',
    languages: isRtl ? 'اللغات' : 'Languages',
    certifications: isRtl ? 'الشهادات والاعتمادات' : 'Certifications',
    projects: isRtl ? 'المشاريع البارزة' : 'Featured Projects',
    courses: isRtl ? 'الدورات والتدريب' : 'Courses & Training',
    achievements: isRtl ? 'الجوائز والإنجازات' : 'Achievements & Awards',
    volunteer: isRtl ? 'العمل التطوعي' : 'Volunteer Experience',
    references: isRtl ? 'المعرفون' : 'References',
    contact: isRtl ? 'معلومات الاتصال' : 'Contact Information',
  };

  // Common Contact Badges
  const renderContactInfo = (layoutClass: string = 'flex flex-wrap gap-3 text-xs') => (
    <div className={layoutClass}>
      {cv.personalInfo.email && (
        <span className="flex items-center gap-1.5 opacity-90">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span>{cv.personalInfo.email}</span>
        </span>
      )}
      {cv.personalInfo.phone && (
        <span className="flex items-center gap-1.5 opacity-90" dir="ltr">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>{cv.personalInfo.phone}</span>
        </span>
      )}
      {cv.personalInfo.location && (
        <span className="flex items-center gap-1.5 opacity-90">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{cv.personalInfo.location}</span>
        </span>
      )}
      {cv.personalInfo.website && (
        <span className="flex items-center gap-1.5 opacity-90">
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>{cv.personalInfo.website.replace(/^https?:\/\//, '')}</span>
        </span>
      )}
      {cv.personalInfo.linkedin && (
        <span className="flex items-center gap-1.5 opacity-90">
          <Linkedin className="w-3.5 h-3.5 shrink-0" />
          <span>{cv.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
        </span>
      )}
      {cv.personalInfo.github && (
        <span className="flex items-center gap-1.5 opacity-90">
          <Github className="w-3.5 h-3.5 shrink-0" />
          <span>{cv.personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
        </span>
      )}
    </div>
  );

  // Experience Section
  const renderExperience = () => {
    if (!isVisible('experiences') || cv.experiences.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <Briefcase className="w-4 h-4" />
          <span>{titles.experience}</span>
        </h3>
        <div className="space-y-4">
          {cv.experiences.map((exp) => (
            <div key={exp.id} className="text-xs">
              <div className="flex justify-between items-baseline flex-wrap font-semibold text-slate-900">
                <span className="text-sm">{exp.title}</span>
                <span className="text-slate-500 font-normal" dir="ltr">
                  {exp.startDate} - {exp.current ? (isRtl ? 'حتى الآن' : 'Present') : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between text-slate-700 italic mb-1.5">
                <span>{exp.company}</span>
                {exp.location && <span>{exp.location}</span>}
              </div>
              {exp.description && <p className="text-slate-600 leading-relaxed mb-1.5">{exp.description}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Education Section
  const renderEducation = () => {
    if (!isVisible('education') || cv.education.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{titles.education}</span>
        </h3>
        <div className="space-y-3">
          {cv.education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span className="text-sm">{edu.degree}</span>
                <span className="text-slate-500 font-normal" dir="ltr">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-slate-700 italic">{edu.institution} {edu.location && `• ${edu.location}`}</div>
              {edu.grade && <div className="text-slate-600 font-medium mt-0.5">{edu.grade}</div>}
              {edu.description && <p className="text-slate-600 mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Skills Section
  const renderSkills = (layout: 'chips' | 'bars' | 'list' = 'chips') => {
    if (!isVisible('skills') || cv.skills.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <Sparkles className="w-4 h-4" />
          <span>{titles.skills}</span>
        </h3>
        {layout === 'bars' ? (
          <div className="space-y-2 text-xs">
            {cv.skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between mb-0.5">
                  <span className="font-medium text-slate-800">{skill.name}</span>
                  <span className="text-slate-500">{skill.level}/5</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: themeColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 text-xs">
            {cv.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Languages Section
  const renderLanguages = () => {
    if (!isVisible('languages') || cv.languages.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <Globe className="w-4 h-4" />
          <span>{titles.languages}</span>
        </h3>
        <div className="space-y-1.5 text-xs">
          {cv.languages.map((lang) => (
            <div key={lang.id} className="flex justify-between text-slate-700">
              <span className="font-medium">{lang.name}</span>
              <span className="text-slate-500">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Projects Section
  const renderProjects = () => {
    if (!isVisible('projects') || cv.projects.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <BookOpen className="w-4 h-4" />
          <span>{titles.projects}</span>
        </h3>
        <div className="space-y-3">
          {cv.projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span className="text-sm flex items-center gap-1.5">
                  {proj.title}
                  {proj.link && (
                    <span className="text-slate-400 font-normal text-[10px]">({proj.link})</span>
                  )}
                </span>
                {proj.role && <span className="text-slate-500 font-normal">{proj.role}</span>}
              </div>
              {proj.technologies && (
                <div className="text-[11px] font-mono text-slate-600 mb-1">
                  Stack: {proj.technologies}
                </div>
              )}
              <p className="text-slate-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Certifications Section
  const renderCertifications = () => {
    if (!isVisible('certifications') || cv.certifications.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <Award className="w-4 h-4" />
          <span>{titles.certifications}</span>
        </h3>
        <div className="space-y-2 text-xs">
          {cv.certifications.map((c) => (
            <div key={c.id}>
              <div className="font-semibold text-slate-900">{c.name}</div>
              <div className="text-slate-600 flex justify-between">
                <span>{c.issuer}</span>
                <span className="text-slate-500" dir="ltr">{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Achievements Section
  const renderAchievements = () => {
    if (!isVisible('achievements') || cv.achievements.length === 0) return null;
    return (
      <div className="mb-5 avoid-break">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-2"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{titles.achievements}</span>
        </h3>
        <div className="space-y-2 text-xs">
          {cv.achievements.map((ach) => (
            <div key={ach.id}>
              <div className="font-semibold text-slate-900 flex justify-between">
                <span>{ach.title}</span>
                {ach.date && <span className="text-slate-500 font-normal" dir="ltr">{ach.date}</span>}
              </div>
              <p className="text-slate-600">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Profile Photo Component
  const renderPhoto = (className: string = 'w-24 h-24 rounded-full object-cover border-2 shadow-sm') => {
    if (!cv.settings.showPhoto || !cv.personalInfo.photoUrl) return null;
    return (
      <img
        src={cv.personalInfo.photoUrl}
        alt={cv.personalInfo.fullName}
        className={className}
        style={{ borderColor: themeColor }}
      />
    );
  };

  // ==========================================
  // Layout 1: Executive Banner (C-Suite, Wallstreet, Gulf Prestige)
  // ==========================================
  if (template.layout === 'executive-banner') {
    return (
      <div
        id="cv-preview-container"
        className={`a4-sheet bg-white text-slate-800 shadow-xl overflow-hidden leading-normal ${getFontClass()} print-area`}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ transform: printMode ? 'none' : `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* Banner Header */}
        <div
          className="p-8 text-white relative"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-center gap-6">
            {renderPhoto('w-28 h-28 rounded-xl object-cover border-2 border-white/50 shadow-md shrink-0')}
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight mb-1 text-white">
                {cv.personalInfo.fullName}
              </h1>
              <p className="text-base text-white/90 font-medium mb-3 tracking-wide">
                {cv.personalInfo.jobTitle}
              </p>
              {renderContactInfo('flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-white/80')}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
          {/* Summary */}
          {isVisible('professionalSummary') && cv.personalInfo.summary && (
            <div className="mb-6 p-4 bg-slate-50 border-s-4 rounded-e text-xs leading-relaxed text-slate-700" style={{ borderColor: themeColor }}>
              <div className="font-bold text-slate-900 mb-1 uppercase tracking-wider">{titles.summary}</div>
              {cv.personalInfo.summary}
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Main Column */}
            <div className="col-span-8">
              {renderExperience()}
              {renderProjects()}
            </div>

            {/* Side Column */}
            <div className="col-span-4">
              {renderEducation()}
              {renderSkills('bars')}
              {renderCertifications()}
              {renderLanguages()}
              {renderAchievements()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Layout 2: Sidebar (Left / Right) (Modern Slate, Dev Terminal, Clinical, etc.)
  // ==========================================
  if (template.layout === 'sidebar-left' || template.layout === 'sidebar-right') {
    const isSidebarRight = template.layout === 'sidebar-right';

    return (
      <div
        id="cv-preview-container"
        className={`a4-sheet bg-white text-slate-800 shadow-xl overflow-hidden leading-normal flex ${getFontClass()} print-area ${
          isSidebarRight ? (isRtl ? 'flex-row' : 'flex-row-reverse') : (isRtl ? 'flex-row-reverse' : 'flex-row')
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ transform: printMode ? 'none' : `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* Sidebar */}
        <div className="w-[34%] bg-slate-50 p-6 border-e border-slate-200 shrink-0 flex flex-col">
          {cv.settings.showPhoto && cv.personalInfo.photoUrl && (
            <div className="mb-5 flex justify-center">
              {renderPhoto('w-32 h-32 rounded-2xl object-cover border-2 shadow-sm')}
            </div>
          )}

          {/* Contact Box in Sidebar */}
          <div className="mb-6">
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              {titles.contact}
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              {cv.personalInfo.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{cv.personalInfo.email}</span>
                </div>
              )}
              {cv.personalInfo.phone && (
                <div className="flex items-center gap-2" dir="ltr">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{cv.personalInfo.phone}</span>
                </div>
              )}
              {cv.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{cv.personalInfo.location}</span>
                </div>
              )}
              {cv.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{cv.personalInfo.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {cv.personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{cv.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                </div>
              )}
              {cv.personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{cv.personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills in Sidebar */}
          {renderSkills('bars')}

          {/* Languages in Sidebar */}
          {renderLanguages()}

          {/* Certifications in Sidebar */}
          {renderCertifications()}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-7">
          {/* Header */}
          <div className="mb-5 pb-4 border-b border-slate-200">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {cv.personalInfo.fullName}
            </h1>
            <p className="text-sm font-semibold tracking-wide" style={{ color: themeColor }}>
              {cv.personalInfo.jobTitle}
            </p>
          </div>

          {/* Summary */}
          {isVisible('professionalSummary') && cv.personalInfo.summary && (
            <div className="mb-5">
              <h3
                className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: `${themeColor}40`, color: themeColor }}
              >
                {titles.summary}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{cv.personalInfo.summary}</p>
            </div>
          )}

          {renderExperience()}
          {renderEducation()}
          {renderProjects()}
          {renderAchievements()}
        </div>
      </div>
    );
  }

  // ==========================================
  // Layout 3: Two Column (Tech Nordic, Editorial, FinTech, Graduate Launch)
  // ==========================================
  if (template.layout === 'two-col' || template.layout === 'modern-grid') {
    return (
      <div
        id="cv-preview-container"
        className={`a4-sheet bg-white text-slate-800 shadow-xl overflow-hidden leading-normal p-8 ${getFontClass()} print-area`}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ transform: printMode ? 'none' : `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* Header with Photo & Title */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b-2" style={{ borderColor: themeColor }}>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
              {cv.personalInfo.fullName}
            </h1>
            <p className="text-sm font-semibold mb-2" style={{ color: themeColor }}>
              {cv.personalInfo.jobTitle}
            </p>
            {renderContactInfo('flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600')}
          </div>
          {renderPhoto('w-24 h-24 rounded-full object-cover border-2 shadow shrink-0')}
        </div>

        {/* Summary */}
        {isVisible('professionalSummary') && cv.personalInfo.summary && (
          <div className="mb-5 text-xs text-slate-600 leading-relaxed border-s-2 ps-3" style={{ borderColor: themeColor }}>
            {cv.personalInfo.summary}
          </div>
        )}

        {/* Dual Column Content */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            {renderExperience()}
            {renderProjects()}
          </div>
          <div className="col-span-5">
            {renderEducation()}
            {renderSkills('chips')}
            {renderLanguages()}
            {renderCertifications()}
            {renderAchievements()}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Layout 4: Single Column (Corporate Traditional, Pure Minimal, Harvard Scholar, CPA, etc.)
  // ==========================================
  return (
    <div
      id="cv-preview-container"
      className={`a4-sheet bg-white text-slate-800 shadow-xl overflow-hidden leading-normal p-8 ${getFontClass()} print-area`}
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ transform: printMode ? 'none' : `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Centered or Aligned Header */}
      <div className="text-center pb-5 mb-5 border-b border-slate-300">
        {cv.settings.showPhoto && cv.personalInfo.photoUrl && (
          <div className="flex justify-center mb-3">
            {renderPhoto('w-20 h-20 rounded-full object-cover border shadow-sm')}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
          {cv.personalInfo.fullName}
        </h1>
        <p className="text-sm font-medium mb-3" style={{ color: themeColor }}>
          {cv.personalInfo.jobTitle}
        </p>
        <div className="flex justify-center">
          {renderContactInfo('flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600')}
        </div>
      </div>

      {/* Summary */}
      {isVisible('professionalSummary') && cv.personalInfo.summary && (
        <div className="mb-5 text-xs text-slate-700 leading-relaxed text-center max-w-2xl mx-auto">
          {cv.personalInfo.summary}
        </div>
      )}

      {/* Single Column Flow */}
      {renderExperience()}
      {renderEducation()}
      {renderProjects()}
      {renderSkills('chips')}
      
      <div className="grid grid-cols-2 gap-4">
        {renderCertifications()}
        {renderLanguages()}
      </div>

      {renderAchievements()}
    </div>
  );
};
