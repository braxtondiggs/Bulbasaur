import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ProjectComponent } from './project/project.component';
import { GoogleAnalyticsService } from '../shared/services';
import { chunk, floor, map, merge, orderBy, reject, slice, sumBy } from 'lodash-es';
import moment from 'moment';

@Component({
  selector: 'app-content',
  styleUrls: ['./content.component.scss'],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {
  toggleLikes = false;
  loadingSkills = true;
  likes: any;
  employment: any;
  projects: any;
  skills: any;
  constructor(protected http: HttpClient, protected dialog: MatDialog, public ga: GoogleAnalyticsService) { }

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
      const totalTime = sumBy(data.Languages, 'total_seconds');
      this.skills = chunk(slice(orderBy(reject(data.Languages, ['name', 'Other']), ['total_seconds'], ['desc']), 0, 6)
        .map((o: any) => merge(o, { value: floor((o.total_seconds / totalTime) * 100) })), 3);
      this.loadingSkills = false;
    });
  }

  public openProject(project: any) {
    this.dialog.open(ProjectComponent, {
      autoFocus: false,
      data: project,
      panelClass: 'project-component'
    });
  }
}
