import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Chart } from 'angular-highcharts';
import { GoogleAnalyticsService } from '../../shared/services';
import { ceil, floor, isUndefined, map, reduce, reject, toLower } from 'lodash-es';
import * as moment from 'moment';
import { SatDatepicker } from 'saturn-datepicker';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-skills',
  styleUrls: ['./skills.component.scss'],
  templateUrl: './skills.component.html'
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
  constructor(protected http: HttpClient, private ga: GoogleAnalyticsService) { }

  public ngOnInit() {
    this.setDefaultCharts();
    this.getSkills();
  }

  public selectionChange(selection: MatSelectChange): void {
    if (selection.value !== 'customrange') {
      this.getSkills(selection.value);
      this.ga.eventEmitter('skills', 'select', selection.value);
    }
  }

  public selectedTabChange(selection: MatTabChangeEvent): void {
    this.chartName = toLower(selection.tab.textLabel);
    this.updateSeries();
    this.ga.eventEmitter('skills', 'tab', selection.tab.textLabel);
  }

  public getSkills(range: string = 'last30days'): void {
    this.http.get(`https://wartortle.herokuapp.com?range=${range}${this.getCustomDate(range)}`)
      .subscribe((data: any) => {
        this.skills = data;
        this.updateSeries();
      });
  }

  public updateSeries() {
    this.skills.Editors = reject(this.skills.Editors, (o) => isUndefined(o.total_seconds));
    this.skills.Languages = reject(this.skills.Languages, (o) => isUndefined(o.total_seconds));
    const totalCount: number = reduce(this.skills.Languages, (sum: number, n: any) => sum + n.total_seconds, 0);
    if (this.chartName === 'languages') {
      this.chart.languages.removeSeries(0);
      this.chart.languages.addSeries({
        data: map(this.skills.Languages, (o: any) => [o.name, ceil((o.total_seconds / totalCount) * 100, 2)]),
        name: 'Percentage'
      });
    } else if (this.chartName === 'activity') {
      this.chart.activity.removeSeries(0);
      this.chart.activity.addSeries({
        data: map(this.skills.Timeline, 'total_seconds').map((o: any) => o / 3600),
        showInLegend: false
      });
      this.chart.activity.ref.xAxis[0].update({
        categories: map(this.skills.Timeline, 'date').map((v: string) => moment(v).format('MMM Do'))
      });
    } else if (this.chartName === 'editors') {
      this.chart.editors.removeSeries(0);
      this.chart.editors.addSeries({
        data: map(this.skills.Editors, (o: any) => [o.name, ceil((o.total_seconds / totalCount) * 100, 2)]),
        name: 'Percentage'
      });
    }
  }

  public setCustomRange(datepicker: SatDatepicker<any>, selector: MatSelect): void {
    this.selected = 'customrange';
    datepicker.open();
    selector.close();
  }

  public dateChange(event: MatDatepickerInputEvent<any>): void {
    this.hasDateSelected = true;
    this.date = {
      begin: moment(event.value.begin).format('MMM Do YYYY'),
      end: moment(event.value.end).format('MMM Do YYYY')
    };
    this.getSkills('customrange');
  }

  public getCustomDate(range: string): string {
    return range === 'customrange' && this.date.begin && this.date.end ?
      `&start=${this.date.begin}&end=${this.date.end}` : '';
  }

  public setDefaultCharts(): void {
    const width: number = document.getElementById('skills').clientWidth - 40;
    this.chart = {
      activity: new Chart({
        chart: {
          type: 'line',
          width
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        tooltip: {
          pointFormatter() {
            // tslint:disable-next-line: one-variable-per-declaration
            const time = this.y * 3600,
              hrs = floor(time / 3600),
              mins = floor((time % 3600) / 60);
            return ((hrs > 0) ? `${hrs} Hours ` : '') + ((mins > 0) ? mins + ' Mins' : '');
          }
        },
        yAxis: {
          plotLines: [{
            color: '#808080',
            value: 0,
            width: 1
          }],
          title: {
            text: 'Hours'
          }
        }
      }),
      editors: new Chart({
        chart: {
          type: 'pie',
          width
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        tooltip: {
          headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
          pointFormat: ''
        }
      }),
      languages: new Chart({
        chart: {
          type: 'pie',
          width
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        tooltip: {
          headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
          pointFormat: ''
        }
      })
    };
  }
}
