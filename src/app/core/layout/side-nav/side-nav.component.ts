import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgIcon, LazyLoadFadeDirective],
  templateUrl: './side-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent {
  public ga = inject(GoogleAnalyticsService);
  public analyticsHelper = inject(AnalyticsHelperService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  public scrollToSection(sectionId: string): void {
    // Track navigation event
    this.analyticsHelper.trackNavigation(sectionId, 'menu');

    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
