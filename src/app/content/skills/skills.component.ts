import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSelectChange, MatTabChangeEvent } from '@angular/material';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'skills',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  private date: any = { start: Date, end: Date };
  private chart: any = { languages: Chart, activity: Chart, editors: Chart };
  private skills: any;
  private chartName = 'languages';
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

  selectedTabChange(selection: MatTabChangeEvent): void {
    this.chartName = _.toLower(selection.tab.textLabel);
    this.updateSeries();
  }

  getSkills(range: string = 'last30days'): void {
    this.http.get(`https://wartortle.herokuapp.com?range=${range}${this.getCustomDate(range)}`).subscribe((data: any) => {
      this.skills = data;
      this.updateSeries();
    });
  }

  updateSeries() {
    const total_count: number = _.reduce(this.skills.Languages, function(sum, n) {
      return sum + n.total_seconds;
    }, 0);
    if (this.chartName === 'languages') {
      this.chart.languages.removeSerie(0);
      this.chart.languages.addSerie({
        name: 'Percentage',
        data: _.map(this.skills.Languages, (o: any) => [o.name, _.ceil((o.total_seconds / total_count) * 100, 2)])
      });
    } else if (this.chartName === 'activity') {
      this.chart.activity.removeSerie(0);
      this.chart.activity.addSerie({
        showInLegend: false,
        data: _.map(this.skills.Timeline, 'total_seconds').map((o: any) => o / 3600)
      });
      this.chart.activity.ref.xAxis[0].update({
        categories: _.map(this.skills.Timeline, 'date').map(function(v) {
          return moment(v).format('MMM Do');
        })
      });
    } else if (this.chartName === 'editors') {
      this.chart.editors.removeSerie(0);
      this.chart.editors.addSerie({
        name: 'Percentage',
        data: _.map(this.skills.Editors, (o: any) => [o.name, _.ceil((o.total_seconds / total_count) * 100, 2)])
      });
    }
  }

  getCustomDate(range: string): string {
    return range === 'customrange' && this.date.start && this.date.end ? `&start=${this.date.start}&end=${this.date.end}` : '';
  }

  setDefaultCharts(): void {
    this.chart = {
      languages: new Chart({
        chart: {
          type: 'pie',
          height: 450,
          width: 722
        },
        tooltip: {
          headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
          pointFormat: ''
        },
        title: {
          text: null
        },
        credits: {
          enabled: false
        }
      }),
      activity: new Chart({
        chart: {
          type: 'line',
          height: 400,
          width: 722
        },
        title: {
          text: null
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormatter: function() {
            const time = this.y * 3600,
              hrs = _.floor(time / 3600),
              mins = _.floor((time % 3600) / 60);
            return ((hrs > 0) ? `${hrs} Hours ` : '') + ((mins > 0) ? mins + ' Mins' : '');
          }
        },
        yAxis: {
          title: {
            text: 'Hours'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        }
      }),
      editors: new Chart({
        chart: {
          type: 'pie',
          height: 450,
          width: 722
        },
        tooltip: {
          headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
          pointFormat: ''
        },
        title: {
          text: null
        },
        credits: {
          enabled: false
        }
      })
    };
  }
}
