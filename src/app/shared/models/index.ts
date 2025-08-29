/* eslint-disable @typescript-eslint/naming-convention */
// Data models for the application
import * as highcharts from 'highcharts';

export interface DateRange {
  start: string;
  end: string | null;
}

export interface Employment {
  id: string;
  name: string;
  position: string;
  description: string;
  location: string;
  type: string;
  remote: boolean;
  current: boolean;
  date: DateRange;
  duration?: string;
  image: {
    icon: string;
    alt: string;
  };
  technologies?: string[];
  achievements?: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  type: string;
  status: string;
  featured: boolean;
  technologies: string[];
  platforms: string[];
  image: {
    icon: string;
    screenshot: string;
    other?: string;
    alt: string;
  };
  description: string;
  features?: string[];
  highlights?: string[];
  urls?: {
    web?: string;
    android?: string;
    ios?: string;
    other?: string;
    award?: string;
  };
  dateCreated: string;
  lastUpdated: string;
  discontinuedDate?: string;
  // Legacy fields for backward compatibility
  name?: string;
  summary?: string;
  description_modified?: string;
  url?: {
    web?: string;
    android?: string;
    ios?: string;
    other?: string;
  };
  github?: string;
  mobile?: boolean;
}

export interface Interests {
  name: string;
  title: string;
  description: string;
  icon: string;
  emoji: string;
}

export interface AppData {
  employment: Employment[];
  projects: Project[];
  interests: Interests[];
}

export interface SkillLanguage {
  name: string;
  total_seconds: number;
  value?: number;
}

export interface SkillEditor {
  name: string;
  total_seconds: number;
}

export interface TimelineEntry {
  date: string;
  total_seconds: number;
}

export interface SkillsData {
  Languages: SkillLanguage[];
  Editors: SkillEditor[];
  Timeline: TimelineEntry[];
}

export interface ChartData {
  languages: highcharts.Options;
  activity: highcharts.Options;
  editors: highcharts.Options;
}

export interface CustomDateRange {
  begin: string;
  end: string;
}
