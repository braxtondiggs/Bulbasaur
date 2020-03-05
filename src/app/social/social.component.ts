import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnapchatQRComponent } from './snapchatQR/snapchat-qr.component';
import { GoogleAnalyticsService } from '../shared/services';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html'
})
export class SocialComponent {

  constructor(private dialog: MatDialog, public ga: GoogleAnalyticsService) { }

  public openSnapQR() {
    this.dialog.open(SnapchatQRComponent, {
      height: '250px',
      panelClass: 'snapchat-qr',
      width: '250px'
    });
  }
}
