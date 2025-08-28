// Data models for the application

export interface DateRange {
  start: string;
  end: string | null;
}

export interface Employment {
  company: string;
  name: string;
  position: string;
  description: string;
  location: string;
  date: DateRange;
  logo?: string;
  image: {
    icon: string;
  };
  technologies?: string[];
}

export interface Project {
  id: string;
  name: string;
  title: string;
  summary: string;
  description: string[];
  description_modified?: string;
  status: string;
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
  languages: Highcharts.Options;
  activity: Highcharts.Options;
  editors: Highcharts.Options;
}

export interface CustomDateRange {
  begin: string;
  end: string;
}
