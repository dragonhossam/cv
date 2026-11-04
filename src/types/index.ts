export type Language = 'en' | 'ar';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string;
  summary: string;
  website: string;
  linkedin: string;
  github: string;
  nationality?: string;
  dateOfBirth?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1 - 5
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools' | 'General';
}

export interface LanguageSkill {
  id: string;
  name: string;
  proficiency: string; // e.g., Native, Fluent, Intermediate, Basic, C1, B2
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Course {
  id: string;
  title: string;
  institution: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  description: string;
  link?: string;
  technologies?: string;
  highlights?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface Volunteer {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface CVSettings {
  templateId: string;
  themeColor: string;
  secondaryColor?: string;
  font: 'inter' | 'cairo' | 'tajawal' | 'serif' | 'mono';
  fontSize: 'compact' | 'normal' | 'relaxed';
  spacing: 'tight' | 'normal' | 'spacious';
  margins: 'narrow' | 'normal' | 'wide';
  language: Language;
  showPhoto: boolean;
  sectionOrder: string[];
  hiddenSections: string[];
}

export interface CVData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: LanguageSkill[];
  certifications: Certification[];
  courses: Course[];
  projects: Project[];
  achievements: Achievement[];
  volunteer: Volunteer[];
  references: Reference[];
  customSections: CustomSection[];
  settings: CVSettings;
}

export type TemplateCategory =
  | 'modern'
  | 'corporate'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'academic'
  | 'technical'
  | 'finance'
  | 'medical'
  | 'engineering'
  | 'graduate'
  | 'international';

export type LayoutType =
  | 'single-col'
  | 'two-col'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'executive-banner'
  | 'modern-grid'
  | 'academic-classic';

export interface CVTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: TemplateCategory;
  categoryName: string;
  categoryNameAr: string;
  layout: LayoutType;
  hasPhoto: boolean;
  accentColor: string;
  font: 'inter' | 'cairo' | 'tajawal' | 'serif' | 'mono';
  description: string;
  descriptionAr: string;
  isPremium: boolean;
  popular?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  packageId: 'free' | 'pro' | 'premium';
  packageName: string;
  packageNameAr: string;
  amountEgp: number;
  senderPhone: string;
  transactionId: string;
  customerEmail: string;
  customerName: string;
  cvTitle: string;
  status: 'pending' | 'paid' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
  notes?: string;
}

export interface SiteSettings {
  vodafoneCashWallet: string;
  vodafoneCashName: string;
  proPriceEgp: number;
  premiumPriceEgp: number;
  paymentInstructionsAr: string;
  paymentInstructionsEn: string;
  supportPhone: string;
  supportEmail: string;
}

export interface CoverLetterData {
  id: string;
  fullName: string;
  jobTitle: string;
  companyName: string;
  hiringManager?: string;
  date: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  signoff: string;
}
