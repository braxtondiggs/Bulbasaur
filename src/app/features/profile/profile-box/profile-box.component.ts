import { Component, ChangeDetectionStrategy } from '@angular/core';

import { SocialComponent } from '../social/social.component';
import { InstagramComponent } from './instagram/instagram.component';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';

@Component({
  selector: 'app-profile-box',
  standalone: true,
  imports: [
    SocialComponent,
    InstagramComponent,
    LazyLoadFadeDirective
],
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileBoxComponent { }
