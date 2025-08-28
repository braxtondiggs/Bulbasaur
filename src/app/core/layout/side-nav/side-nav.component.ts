import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgIcon, LazyLoadFadeDirective],
  templateUrl: './side-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent {
  public ga = inject(GoogleAnalyticsService);

  public scrollToSection(sectionId: string): void {
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
