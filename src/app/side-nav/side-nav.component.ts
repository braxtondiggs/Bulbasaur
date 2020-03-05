import { Component, ViewEncapsulation } from '@angular/core';
import { GoogleAnalyticsService } from '../shared/services';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-side-nav',
  styleUrls: ['./side-nav.component.scss'],
  templateUrl: './side-nav.component.html'
})
export class SideNavComponent {
  constructor(public ga: GoogleAnalyticsService) { }
}
