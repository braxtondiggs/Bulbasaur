import { Component } from '@angular/core';
import { SnapchatQRComponent } from './snapchatQR/snapchat-qr.component';
import { GoogleAnalyticsService } from '../shared/services';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html'
})
export class SocialComponent {

  constructor(public ga: GoogleAnalyticsService) { }
}
