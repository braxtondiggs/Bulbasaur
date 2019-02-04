import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ProjectComponent } from './project/project.component';
import { chunk, floor, map, merge, orderBy, reject, slice, sumBy } from 'lodash-es';
import * as moment from 'moment';

@Component({
  selector: 'content',
  styleUrls: ['./content.component.scss'],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {
  public toggleLikes = false;
  public loadingSkills = true;
  public likes: any;
  public employment: any;
  public projects: any;
  public skills: any;
  constructor(protected http: HttpClient, protected dialog: MatDialog) { }

  public ngOnInit() {
    this.http.get('assets/data.json').subscribe((data: any) => {
      this.likes = chunk(data.likes, 5);
      this.employment = map(data.employment, (o: any) => merge(o, {
        date: {
          end: o.date.end ? moment(o.date.end, 'YYYY-MM-DD').format() : null,
          start: moment(o.date.start, 'YYYY-MM-DD').format()
        }
      }));
      this.projects = data.projects;
    });
    this.http.get('https://wartortle.herokuapp.com?range=last30days').subscribe((data: any) => {
      const total_time = sumBy(data.Languages, 'total_seconds');
      this.skills = chunk(slice(orderBy(reject(data.Languages, ['name', 'Other']), ['total_seconds'], ['desc']), 0, 6)
        .map((o: any) => merge(o, { value: floor((o.total_seconds / total_time) * 100) })), 3);
      this.loadingSkills = false;
    });
  }

  public openProject(project: any) {
    this.dialog.open(ProjectComponent, {
      data: project,
      panelClass: 'project-component'
    });
  }
}
