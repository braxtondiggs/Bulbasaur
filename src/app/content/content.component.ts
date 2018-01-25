import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  public likes;
  public employment;
  public projects;
  constructor(protected http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/data.json').subscribe((data: any) => {
      this.likes = _.chunk(data.likes, 5);
      console.log(this.likes);
      this.employment = data.employment;
      this.projects = data.projects;
    });
  }
}
