import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { NgIconsModule } from '@ng-icons/core';
import { HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from '@shared/services';
import { SkillsComponent } from './skills/skills.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from '@core/layout/footer/footer.component';
import { ProjectComponent } from './project/project.component';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import dayjs from 'dayjs';
import { AppData, Employment, Project, Like, SkillLanguage } from '@shared/models';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { SkillPipe } from '@shared/pipes/skill.pipe';
import { ParsePipe, DateFormatPipe, DifferencePipe } from '@shared/pipes/date.pipe';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NgIconsModule,
    SkillsComponent,
    ContactComponent,
    FooterComponent,
    ProjectComponent,
    AnimateOnScrollDirective,
    LazyLoadFadeDirective,
    SkillPipe,
    ParsePipe,
    DateFormatPipe,
    DifferencePipe
],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
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
        this.cdr.detectChanges(); // Trigger change detection after data loads
      });
  }

  private loadSkillsData(): void {
    this.http.get<{ Languages: SkillLanguage[] }>('https://code.braxtondiggs.com/api?range=last30days')
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

  public trackByLikeName(index: number, like: Like): string {
    return like.name;
  }
}
