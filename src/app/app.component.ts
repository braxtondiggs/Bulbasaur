import { Component, HostListener, ViewEncapsulation, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { GoogleAnalyticsService } from '@shared/services';
import { HeaderComponent } from '@core/layout/header/header.component';
import { ProfileBoxComponent } from '@features/profile/profile-box/profile-box.component';
import { ContentComponent } from '@features/portfolio/content/content.component';
import { SideNavComponent } from '@core/layout/side-nav/side-nav.component';
import { themeChange } from 'theme-change';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgIconsModule,
    LoadingBarHttpClientModule,
    HeaderComponent,
    ProfileBoxComponent,
    ContentComponent,
    SideNavComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public scroll = 0;
  public ga = inject(GoogleAnalyticsService);

  ngOnInit(): void {
    this.initializeTheme();
  }

  @HostListener('window:scroll', [])
  public onScroll(): void {
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  public isScroll(): boolean {
    return this.scroll > 55;
  }

  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private initializeTheme(): void {
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

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme-manual')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      }
    });
  }
}
