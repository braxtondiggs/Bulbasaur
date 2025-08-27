// Data models for the application

export interface DateRange {
  start: string;
  end: string | null;
}

export interface Employment {
  company: string;
  position: string;
  description: string;
  date: DateRange;
  logo?: string;
  technologies?: string[];
}

export interface Project {
  id: string;
  name: string;
  title: string;
  description: string[];
  description_modified?: string;
  image: {
    screenshot: string;
    other?: string;
  };
  url: {
    web?: string;
    android?: string;
    ios?: string;
    other?: string;
  };
  github?: string;
  technologies: string[];
  featured?: boolean;
  mobile?: boolean;
}

export interface Like {
  name: string;
  description: string;
  icon?: string;
}

export interface AppData {
  employment: Employment[];
  projects: Project[];
  likes: Like[];
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
  languages: Highcharts.Options;
  activity: Highcharts.Options;
  editors: Highcharts.Options;
}

export interface CustomDateRange {
  begin: string;
  end: string;
}