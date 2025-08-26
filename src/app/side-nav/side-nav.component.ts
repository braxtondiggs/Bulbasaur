import { Component } from '@angular/core';
import { GoogleAnalyticsService } from '../shared/services';

@Component({
  selector: 'app-side-nav',
  styleUrls: ['./side-nav.component.scss'],
  templateUrl: './side-nav.component.html'
})
export class SideNavComponent {
  constructor(public ga: GoogleAnalyticsService) { }

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
