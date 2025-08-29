import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { HeaderComponent } from '@core/layout/header/header.component';
import { SideNavComponent } from '@core/layout/side-nav/side-nav.component';
import { ContentComponent } from '@features/portfolio/content/content.component';
import { ProfileBoxComponent } from '@features/profile/profile-box/profile-box.component';
import { NgIcon } from '@ng-icons/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AnalyticsHelperService, GoogleAnalyticsService, ModalService } from '@shared/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { themeChange } from 'theme-change';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    LoadingBarHttpClientModule,
    HeaderComponent,
    ProfileBoxComponent,
    ContentComponent,
    SideNavComponent
  ],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  public scroll = 0;
  public modalOpen = false;
  private readonly destroy$ = new Subject<void>();
  public ga = inject(GoogleAnalyticsService);
  private readonly analyticsHelper = inject(AnalyticsHelperService);
  private readonly modalService = inject(ModalService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  public ngOnInit(): void {
    this.initializeTheme();

    // Subscribe to modal state changes
    this.modalService.modalOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => {
      this.modalOpen = isOpen;
      this.cdr.detectChanges();
    });

    // Track performance metrics after page load
    setTimeout(() => {
      this.analyticsHelper.trackPerformance();
    }, 1000);

    // Track user engagement time
    this.startEngagementTracking();
  }

  private startEngagementTracking(): void {
    if (!this.isBrowser) return;
    
    const startTime = Date.now();

    // Track engagement when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.analyticsHelper.trackEngagement(startTime);
    });

    // Track engagement periodically for long sessions
    setInterval(() => {
      this.analyticsHelper.trackEngagement(startTime);
    }, 300000); // Every 5 minutes
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  public onScroll(): void {
    if (!this.isBrowser) return;
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Track scroll depth
    const scrollPercentage = Math.round(
      (this.scroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    this.analyticsHelper.trackScrollDepth(scrollPercentage);
  }

  public isScroll(): boolean {
    return this.scroll > 55;
  }

  public trackScrollToTop(): void {
    this.analyticsHelper.trackNavigation('top', 'scroll');
  }

  public scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private initializeTheme(): void {
    if (!this.isBrowser) return;
    
    // Initialize theme-change
    themeChange(false);

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialTheme = 'light';
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (systemPrefersDark) {
      initialTheme = 'dark';
    }

    // Apply the initial theme to both html and body for better DaisyUI support
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.body.setAttribute('data-theme', initialTheme);
    localStorage.setItem('theme', initialTheme);

    // Track initial theme setting
    this.analyticsHelper.trackThemeChange(initialTheme as 'light' | 'dark' | 'auto');

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme-manual')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Track automatic theme change
        this.analyticsHelper.trackThemeChange('auto');
      }
    });
  }
}
