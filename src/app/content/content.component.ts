import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  public toggleLikes = false;
  public loadingSkills = true;
  public likes;
  public employment;
  public projects;
  public skills;
  constructor(protected http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/data.json').subscribe((data: any) => {
      this.likes = _.chunk(data.likes, 5);
      this.employment = data.employment;
      this.projects = data.projects;
    });
    this.http.get('https://wartortle.herokuapp.com?range=last30days').subscribe((data: any) => {
      const total_time = _.sumBy(data.Languages, 'total_seconds');
      this.skills = _.chain(data.Languages).orderBy(['total_seconds'], ['desc']).slice(0, 6)
        .map(o => _.merge(o, { value: _.floor((o.total_seconds / total_time) * 200) })).chunk(3).value();
      this.loadingSkills = false;
    });
  }
}
