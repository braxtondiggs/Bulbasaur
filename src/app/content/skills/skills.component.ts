import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSelectChange } from '@angular/material';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  private date: any = { start: Date, end: Date };
  private chart: any = { languages: Chart };
  private selected = 'last30days';
  constructor(protected http: HttpClient) { }

  ngOnInit() {
    this.setDefaultCharts();
    this.getSkills();
  }

  selectionChange(selection: MatSelectChange): void {
    if (selection.value !== 'customrange') {
      this.getSkills(selection.value);
    } else {
      // TODO: Open date modal
    }
  }

  getSkills(range: string = 'last30days'): void {
    this.http.get(`https://wartortle.herokuapp.com?range=${range}${this.getCustomDate(range)}`).subscribe((data: any) => {
      const total_count: number = _.reduce(data.Languages, function(sum, n) {
        return sum + n.total_seconds;
      }, 0);
      console.log(_.map(data.Languages, (o: any) => _.merge(o, { y: _.ceil((o.total_seconds / total_count) * 100, 2) })));
      _.forEach(data.Languages, (language) => {
        console.log(_.merge(language, { y: _.ceil((language.total_seconds / total_count) * 100, 2) }));
        this.chart.languages.addSerie(_.merge(language, { data: _.ceil((language.total_seconds / total_count) * 100, 2) }));
      });
    });
  }

  getCustomDate(range: string): string {
    return range === 'customrange' && this.date.start && this.date.end ? `&start=${this.date.start}&end=${this.date.end}` : '';
  }
  setDefaultCharts(): void {
    this.chart = {
      languages: new Chart({
        chart: {
          type: 'pie',
          height: 450
        },
        /*tooltip: {
          headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
          pointFormat: ''
        },*/
        title: {
          text: 'Languages'
        },
        credits: {
          enabled: false
        }
      })
    };
  }
}
