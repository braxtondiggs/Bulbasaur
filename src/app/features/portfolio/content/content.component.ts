import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from '@shared/services';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import dayjs from 'dayjs';
import { AppData, Employment, Project, Like, SkillLanguage } from '@shared/models';

@Component({
  selector: 'app-content',
  styleUrls: ['./content.component.scss'],
  templateUrl: './content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
  toggleLikes = false;
  loadingSkills = true;
  likes: Like[] = [];
  employment: Employment[] = [];
  projects: Project[] = [];
  skills: SkillLanguage[][] = [];
  selectedProject: Project | null = null;
  showProjectModal = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private http: HttpClient, public ga: GoogleAnalyticsService) { }

  public ngOnInit(): void {
    this.loadAppData();
    this.loadSkillsData();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAppData(): void {
    this.http.get<AppData>('assets/data.json')
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading app data:', error);
          return of({ employment: [], projects: [], likes: [] } as AppData);
        })
      )
      .subscribe(data => {
        this.likes = data.likes;
        this.employment = data.employment.map((employment: Employment) => ({
          ...employment,
          date: {
            end: employment.date.end ? dayjs(employment.date.end, 'YYYY-MM-DD').format() : null,
            start: dayjs(employment.date.start, 'YYYY-MM-DD').format()
          }
        }));
        this.projects = data.projects;
      });
  }

  private loadSkillsData(): void {
    this.http.get<{ Languages: SkillLanguage[] }>('https://code.braxtondiggs.com/api?range=last30days')
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading skills data:', error);
          this.loadingSkills = false;
          return of({ Languages: [] });
        })
      )
      .subscribe(data => {
        let totalTime = 0;
        for (const lang of data.Languages) {
          totalTime += lang.total_seconds;
        }
        const filteredLanguages = data.Languages
          .filter(lang => lang.name !== 'Other')
          .sort((a, b) => b.total_seconds - a.total_seconds)
          .slice(0, 6)
          .map((language: SkillLanguage) => ({
            ...language,
            value: Math.floor((language.total_seconds / totalTime) * 100)
          }));

        // Chunk into groups of 3
        this.skills = [];
        for (let i = 0; i < filteredLanguages.length; i += 3) {
          this.skills.push(filteredLanguages.slice(i, i + 3));
        }
        this.loadingSkills = false;
      });
  }

  public openProject(project: Project): void {
    this.selectedProject = project;
    this.showProjectModal = true;
  }

  public closeProject(): void {
    this.showProjectModal = false;
    this.selectedProject = null;
  }

  public getYears(time: number): string {
    if (time === 1) {
      return `${time} year`;
    } else if (time <= 0) {
      return '<1 year';
    } else {
      return `${time} years`;
    }
  }

  public trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  public trackByEmploymentIndex(index: number, employment: Employment): string {
    return `${employment.company}-${employment.position}`;
  }

  public trackBySkillName(index: number, skill: SkillLanguage): string {
    return skill.name;
  }

  public trackByLikeName(index: number, like: Like): string {
    return like.name;
  }
}
