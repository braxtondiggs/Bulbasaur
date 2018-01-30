import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SnapchatQRComponent } from './snapchatQR/snapchat-qr.component';

@Component({
  selector: 'social',
  templateUrl: './social.component.html'
})
export class SocialComponent implements OnInit {
  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  openSnapQR() {
    this.dialog.open(SnapchatQRComponent, {
      width: '250px',
      height: '250px',
      panelClass: 'snapchat-qr'
    });
  }
}
