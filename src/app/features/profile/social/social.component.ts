import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import { GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './social.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialComponent {
  public ga = inject(GoogleAnalyticsService);
}
