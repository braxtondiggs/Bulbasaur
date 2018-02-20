import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Instafeed from 'instafeed.js';
import * as _ from 'lodash';

@Component({
  selector: 'profilebox',
  styleUrls: ['./profile-box.component.scss'],
  templateUrl: './profile-box.component.html'
})
export class ProfileBoxComponent implements OnInit {
  public instagram: Promise<any>;
  public insta_loading = true;

  public ngOnInit() {
    this.instagram = new Promise<any>((resolve: any) => {
      new Instafeed({
        accessToken: '295204961.cccb769.ae311b21cd83437991b3e7753f8c1cfb',
        get: 'user',
        success: (response: any) => { this.insta_loading = false; return resolve(_.slice(response.data, 0, 9)); },
        userId: '295204961'
      }).run();
    });
  }
}
