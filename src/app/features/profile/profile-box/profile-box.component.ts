import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { SocialComponent } from '../social/social.component';
import { InstagramComponent } from './instagram/instagram.component';

@Component({
  selector: 'app-profile-box',
  standalone: true,
  imports: [SocialComponent, InstagramComponent, LazyLoadFadeDirective],
  templateUrl: './profile-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileBoxComponent {}
