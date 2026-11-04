import React, { useState } from 'react';
import { CVTemplate, TemplateCategory, Language } from '../../types';
import { CV_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import { translations } from '../../data/translations';
import { Check, Sparkles, Crown, Search, Filter, Layout, ArrowRight } from 'lucide-react';

interface TemplateGalleryProps {
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  lang: Language;
  hasProAccess: boolean;
  onRequireUpgrade: (tier: 'pro' | 'premium', templateName: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentTemplateId,
  onSelectTemplate,
  lang,
  hasProAccess,
  onRequireUpgrade,
}) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [freeOnly, setFreeOnly] = useState<boolean>(false);

  // Filter templates
  const filteredTemplates = CV_TEMPLATES.filter((tpl) => {
    if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
      return false;
    }
    if (freeOnly && tpl.isPremium) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tpl.name.toLowerCase().includes(q) || tpl.nameAr.includes(q);
      const matchCat = tpl.categoryName.toLowerCase().includes(q) || tpl.categoryNameAr.includes(q);
      const matchDesc = tpl.description.toLowerCase().includes(q) || tpl.descriptionAr.includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  const handleSelect = (tpl: CVTemplate) => {
    if (tpl.isPremium && !hasProAccess) {
      onRequireUpgrade('pro', lang === 'ar' ? tpl.nameAr : tpl.name);
      return;
    }
    onSelectTemplate(tpl.id);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute top-3 start-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث في 30 قالب احترافي...' : 'Search across 30 CV templates...'}
            className="w-full ps-9 pe-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Free Only Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{t.filterFreeOnly}</span>
          </label>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {t.allTemplates}
        </button>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {lang === 'ar' ? cat.nameAr : cat.name}
          </button>
        ))}
      </div>

      {/* Grid of 30 Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isSelected = currentTemplateId === tpl.id;
          const isLocked = tpl.isPremium && !hasProAccess;

          return (
            <div
              key={tpl.id}
              className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md ${
                isSelected ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Visual Layout Mockup Card */}
              <div
                className="h-44 bg-slate-100 p-4 relative flex items-center justify-center overflow-hidden border-b border-slate-200 cursor-pointer"
                onClick={() => handleSelect(tpl)}
              >
                {/* Mini Paper Representation */}
                <div className="w-28 h-36 bg-white shadow-md rounded-sm p-2 flex flex-col justify-between transform transition-transform group-hover:scale-105">
                  {/* Mini Header */}
                  {tpl.layout === 'executive-banner' ? (
                    <div className="h-6 w-full rounded-xs mb-1" style={{ backgroundColor: tpl.accentColor }} />
                  ) : (
                    <div className="flex items-center gap-1 mb-1">
                      {tpl.hasPhoto && (
                        <div
                          className="w-4 h-4 rounded-full shrink-0"
                          style={{ backgroundColor: tpl.accentColor }}
                        />
                      )}
                      <div className="flex-1 space-y-0.5">
                        <div className="h-1.5 w-12 bg-slate-800 rounded-full" />
                        <div className="h-1 w-8 rounded-full" style={{ backgroundColor: tpl.accentColor }} />
                      </div>
                    </div>
                  )}

                  {/* Mini Body Columns */}
                  {tpl.layout === 'sidebar-left' || tpl.layout === 'sidebar-right' ? (
                    <div className="flex-1 flex gap-1">
                      <div className="w-1/3 bg-slate-100 rounded-xs p-0.5 space-y-1">
                        <div className="h-1 w-full bg-slate-300 rounded-full" />
                        <div className="h-1 w-3/4 bg-slate-300 rounded-full" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-1 w-full bg-slate-300 rounded-full" />
                        <div className="h-1 w-5/6 bg-slate-200 rounded-full" />
                        <div className="h-1 w-4/5 bg-slate-200 rounded-full" />
                      </div>
                    </div>
                  ) : tpl.layout === 'two-col' ? (
                    <div className="flex-1 flex gap-1">
                      <div className="flex-1 space-y-1">
                        <div className="h-1 w-full bg-slate-300 rounded-full" />
                        <div className="h-1 w-4/5 bg-slate-200 rounded-full" />
                      </div>
                      <div className="w-2/5 space-y-1">
                        <div className="h-1 w-full bg-slate-300 rounded-full" />
                        <div className="h-1 w-3/4 bg-slate-200 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-1">
                      <div className="h-1 w-full bg-slate-300 rounded-full" />
                      <div className="h-1 w-5/6 bg-slate-200 rounded-full" />
                      <div className="h-1 w-3/4 bg-slate-200 rounded-full" />
                      <div className="h-1 w-full bg-slate-100 rounded-full" />
                    </div>
                  )}

                  {/* Mini Footer line */}
                  <div className="h-0.5 w-full bg-slate-100 rounded-full mt-1" />
                </div>

                {/* Badge Top Left */}
                <div className="absolute top-3 start-3 flex gap-1.5">
                  {tpl.isPremium ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                      <Crown className="w-3 h-3" />
                      Pro 49 EGP
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      Free
                    </span>
                  )}
                  {tpl.popular && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      Popular
                    </span>
                  )}
                </div>

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Template Info Card */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lang === 'ar' ? tpl.nameAr : tpl.name}
                    </h3>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {tpl.layout}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {lang === 'ar' ? tpl.descriptionAr : tpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tpl.accentColor }}
                    />
                    <span>{lang === 'ar' ? tpl.categoryNameAr : tpl.categoryName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(tpl)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isLocked
                        ? 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
                        : 'bg-slate-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isSelected
                      ? (lang === 'ar' ? 'القالب المفعل' : 'Active')
                      : isLocked
                      ? (lang === 'ar' ? 'فتح عبر فودافون كاش' : 'Unlock Pro')
                      : t.useTemplate}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
