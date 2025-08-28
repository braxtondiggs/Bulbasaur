import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { NgIconsModule } from '@ng-icons/core';
import { GoogleAnalyticsService } from '@shared/services';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    NgIconsModule,
    LazyLoadFadeDirective
],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
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
