import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'lodash';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  public toggleLikes = false;
  public likes;
  public employment;
  public projects;
  public skills;
  constructor(protected http: HttpClient) { }

  ngOnInit() {
    Observable.forkJoin([
      this.http.get('assets/data.json'),
      this.http.get('https://wartortle.herokuapp.com?range=last30days')]
    ).subscribe((data: any) => {
      const total_time = _.sumBy(data[1].Languages, 'total_seconds');
      this.likes = _.chunk(data[0].likes, 5);
      this.employment = data[0].employment;
      this.projects = data[0].projects;
      this.skills = _.chain(data[1].Languages).orderBy(['total_seconds'], ['desc']).slice(0, 6)
        .map(o => _.merge(o, { value: _.floor((o.total_seconds / total_time) * 200) })).chunk(3).value();
    });
  }
}
