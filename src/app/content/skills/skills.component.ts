import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSelectChange, MatTabChangeEvent, MatSelect, MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
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
  public date: any = { begin: Date, end: Date };
  public chart: any = { languages: Chart, activity: Chart, editors: Chart };
  public skills: any;
  public chartName = 'languages';
  public selected = 'last30days';
  public hasDateSelected = false;
  public minDate = moment('2016-06-22', 'YYYY-MM-DD').format();
  public maxDate = moment().subtract(1, 'days').format();
  constructor(protected http: HttpClient) { }

  ngOnInit() {
    this.setDefaultCharts();
    this.getSkills();
  }

  selectionChange(selection: MatSelectChange): void {
    if (selection.value !== 'customrange') {
      this.getSkills(selection.value);
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
    const total_count: number = _.reduce(this.skills.Languages, (sum: number, n: any) => sum + n.total_seconds, 0);
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
        categories: _.map(this.skills.Timeline, 'date').map((v: string) => moment(v).format('MMM Do'))
      });
    } else if (this.chartName === 'editors') {
      this.chart.editors.removeSerie(0);
      this.chart.editors.addSerie({
        name: 'Percentage',
        data: _.map(this.skills.Editors, (o: any) => [o.name, _.ceil((o.total_seconds / total_count) * 100, 2)])
      });
    }
  }

  setCustomRange(datepicker: MatDatepicker<any>, selector: MatSelect): void {
    this.selected = 'customrange';
    datepicker.open();
    selector.close();
  }

  dateChange(event: MatDatepickerInputEvent<any>): void {
    this.hasDateSelected = true;
    this.date = { begin: moment(event.value.begin).format('MMM Do YYYY'), end: moment(event.value.end).format('MMM Do YYYY') };
    this.getSkills('customrange');
  }

  getCustomDate(range: string): string {
    return range === 'customrange' && this.date.begin && this.date.end ? `&start=${this.date.begin}&end=${this.date.end}` : '';
  }

  setDefaultCharts(): void {
    const width: number = document.getElementById('skills').clientWidth - 40;
    this.chart = {
      languages: new Chart({
        chart: {
          type: 'pie',
          width
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
          width
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
          width
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
