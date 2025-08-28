import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FooterComponent } from '@core/layout/footer/footer.component';
import { NgIcon } from '@ng-icons/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { AppData, Employment, Interests, Project, SkillLanguage } from '@shared/models';
import { DateFormatPipe, DifferencePipe, ParsePipe } from '@shared/pipes/date.pipe';
import { SkillPipe } from '@shared/pipes/skill.pipe';
import { GoogleAnalyticsService } from '@shared/services';
import dayjs from 'dayjs';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ContactComponent } from './contact/contact.component';
import { ProjectComponent } from './project/project.component';
import { SkillsComponent } from './skills/skills.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NgIcon,
    SkillsComponent,
    ContactComponent,
    FooterComponent,
    ProjectComponent,
    AnimateOnScrollDirective,
    LazyLoadFadeDirective,
    SkillPipe,
    ParsePipe,
    DateFormatPipe,
    DifferencePipe,
    TitleCasePipe
  ],
  templateUrl: './content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
  loadingSkills = true;
  interests: Interests[] = [];
  employment: Employment[] = [];
  projects: Project[] = [];
  skills: SkillLanguage[][] = [];
  selectedProject: Project | null = null;
  showProjectModal = false;

  private readonly destroy$ = new Subject<void>();
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  public ga = inject(GoogleAnalyticsService);

  public ngOnInit(): void {
    this.loadAppData();
    this.loadSkillsData();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAppData(): void {
    this.http
      .get<AppData>('assets/data.json')
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading app data:', error);
          return of({ employment: [], projects: [], interests: [] } as AppData);
        })
      )
      .subscribe(data => {
        this.interests = data.interests;
        this.employment = data.employment.map((employment: Employment) => ({
          ...employment,
          date: {
            end: employment.date.end ? dayjs(employment.date.end, 'YYYY-MM-DD').format() : null,
            start: dayjs(employment.date.start, 'YYYY-MM-DD').format()
          }
        }));
        this.projects = data.projects;
        this.cdr.detectChanges(); // Trigger change detection after data loads
      });
  }

  private loadSkillsData(): void {
    this.http
      .get<{ Languages: SkillLanguage[] }>('https://code.braxtondiggs.com/api?range=last30days')
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading skills data:', error);
          this.loadingSkills = false;
          this.cdr.detectChanges(); // Trigger change detection on error
          return of({ Languages: [] });
        })
      )
      .subscribe(data => {
        let totalTime = 0;
        for (const lang of data.Languages) {
          totalTime += lang.total_seconds;
        }
        const filteredLanguages = data.Languages.filter(lang => lang.name !== 'Other')
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
        this.cdr.detectChanges(); // Trigger change detection after skills data loads
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

  public trackByInterestTitle(index: number, interest: Interests): string {
    return interest.title;
  }
}
