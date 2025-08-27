import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialComponent {

  constructor(public ga: GoogleAnalyticsService) { }
}
