import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './social.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialComponent {
  public ga = inject(GoogleAnalyticsService);
  private analyticsHelper = inject(AnalyticsHelperService);

  public trackSocialClick(platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'facebook'): void {
    this.analyticsHelper.trackSocialClick(platform, 'profile');
  }

  public trackEmailClick(): void {
    this.ga.trackEvent({
      action: 'click',
      category: 'contact',
      label: 'email_link',
      custom_parameters: {
        contact_method: 'email',
        context: 'profile'
      }
    });
  }

  public trackExternalLink(platform: string, url: string): void {
    this.ga.trackExternalLink(url, platform);
  }
}
