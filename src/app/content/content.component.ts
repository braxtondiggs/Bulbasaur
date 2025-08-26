import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from '../shared/services';
import { chunk, floor, map, merge, orderBy, reject, slice, sumBy } from 'lodash-es';
import dayjs from 'dayjs';

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
  selectedProject: any = null;
  showProjectModal = false;
  constructor(protected http: HttpClient, public ga: GoogleAnalyticsService) { }

  public ngOnInit() {
    this.http.get('assets/data.json').subscribe((data: any) => {
      this.likes = data.likes;
      this.employment = map(data.employment, (o: any) => merge(o, {
        date: {
          end: o.date.end ? dayjs(o.date.end, 'YYYY-MM-DD').format() : null,
          start: dayjs(o.date.start, 'YYYY-MM-DD').format()
        }
      }));
      this.projects = data.projects;
    });
    this.http.get('https://code.braxtondiggs.com/api?range=last30days').subscribe((data: any) => {
      const totalTime = sumBy(data.Languages, 'total_seconds');
      this.skills = chunk(slice(orderBy(reject(data.Languages, ['name', 'Other']), ['total_seconds'], ['desc']), 0, 6)
        .map((o: any) => merge(o, { value: floor((o.total_seconds / totalTime) * 100) })), 3);
      this.loadingSkills = false;
    });
  }

  public openProject(project: any) {
    this.selectedProject = project;
    this.showProjectModal = true;
  }

  public closeProject() {
    this.showProjectModal = false;
    this.selectedProject = null;
  }

  public getYears(time: number): string {
    if (time === 1) {
      return `${time} year`;
    } else if (time <= 0) {
      return '<1 year';
    } else {
      return `${time} years`;
    }
  }
}
