import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { NgIconsModule } from '@ng-icons/core';
import { GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [
    NgIconsModule
],
  templateUrl: './social.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialComponent {
  public ga = inject(GoogleAnalyticsService);
}
