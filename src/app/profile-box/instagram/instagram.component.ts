import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'instagram',
  styleUrls: ['./instagram.component.scss'],
  templateUrl: './instagram.component.html'
})
export class InstagramComponent implements OnInit {
  public instagram$: Observable<any>;
  constructor(private http: HttpClient) { }

  public ngOnInit() {
    this.instagram$ = this.http.get('https://api.instagram.com/v1/users/self/media/recent', {
      params: {
        access_token: '295204961.cccb769.ae3119271dc44bfdac9f8f4c3334a810',
        count: '6'
      }
    });
  }
}
