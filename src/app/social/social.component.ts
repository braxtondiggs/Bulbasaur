import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SnapchatQRComponent } from './snapchatQR/snapchat-qr.component';

@Component({
  selector: 'social',
  templateUrl: './social.component.html'
})
export class SocialComponent {

  constructor(private dialog: MatDialog) { }

  public openSnapQR() {
    this.dialog.open(SnapchatQRComponent, {
      height: '250px',
      panelClass: 'snapchat-qr',
      width: '250px'
    });
  }
}
