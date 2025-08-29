/* eslint-disable @typescript-eslint/naming-convention */
import { TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FooterComponent } from '@core/layout/footer/footer.component';
import { NgIcon } from '@ng-icons/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { AppData, Employment, Interests, Project, SkillLanguage } from '@shared/models';
import { DateFormatPipe, DifferencePipe, ParsePipe } from '@shared/pipes/date.pipe';
import { SkillPipe } from '@shared/pipes/skill.pipe';
import { AnalyticsHelperService, GoogleAnalyticsService, ModalService } from '@shared/services';
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
  public loadingSkills = true;
  public interests: Interests[] = [];
  public employment: Employment[] = [];
  public projects: Project[] = [];
  public skills: SkillLanguage[][] = [];
  public selectedProject: Project | null = null;
  public showProjectModal = false;

  private readonly destroy$ = new Subject<void>();
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly modalService = inject(ModalService);
  public ga = inject(GoogleAnalyticsService);
  private readonly analyticsHelper = inject(AnalyticsHelperService);

  public ngOnInit(): void {
    this.loadAppData();
    this.loadSkillsData();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public trackResumeDownload(): void {
    this.analyticsHelper.trackResumeDownload('pdf');
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
    // Track project view
    this.analyticsHelper.trackProjectInteraction('view', project.name || project.title, project.category);

    this.selectedProject = project;
    this.showProjectModal = true;
    this.modalService.setModalOpen(true);
  }

  public closeProject(): void {
    this.showProjectModal = false;
    this.selectedProject = null;
    this.modalService.setModalOpen(false);
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
    return `${employment.name}-${employment.position}`;
  }

  public trackBySkillName(index: number, skill: SkillLanguage): string {
    return skill.name;
  }

  public trackByInterestTitle(index: number, interest: Interests): string {
    return interest.title;
  }
}
