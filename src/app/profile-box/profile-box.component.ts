import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { SnapchatQRComponent } from './snapchatQR/snapchat-qr.component';
import * as Instafeed from 'instafeed.js';
import * as _ from 'lodash';

@Component({
  selector: 'profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss']
})
export class ProfileBoxComponent implements OnInit {
  public instagram;
  public insta_loading = true;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.instagram = new Promise<any>(resolve => {
      new Instafeed({
        get: 'user',
        userId: '295204961',
        accessToken: '295204961.cccb769.ae311b21cd83437991b3e7753f8c1cfb',
        success: response => { this.insta_loading = false; return resolve(_.slice(response.data, 0, 9)); }
      }).run();
    });
  }

  openSnapQR() {
    this.dialog.open(SnapchatQRComponent, {
      width: '250px',
      height: '250px',
      panelClass: 'snapchat-qr'
    });
  }
}
