import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ProjectComponent } from './project/project.component';
import * as _ from 'lodash';
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
      this.likes = _.chunk(data.likes, 5);
      this.employment = _.map(data.employment, (o: any) => _.merge(o, {
        date: {
          end: o.date.end ? moment(o.date.end, 'YYYY-MM-DD').format() : null,
          start: moment(o.date.start, 'YYYY-MM-DD').format()
        }
      }));
      this.projects = data.projects;
    });
    this.http.get('https://wartortle.herokuapp.com?range=last30days').subscribe((data: any) => {
      const total_time = _.sumBy(data.Languages, 'total_seconds');
      this.skills = _.chain(data.Languages).reject(['name', 'Other']).orderBy(['total_seconds'], ['desc']).slice(0, 6)
        .map((o: any) => _.merge(o, { value: _.floor((o.total_seconds / total_time) * 100) })).chunk(3).value();
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
