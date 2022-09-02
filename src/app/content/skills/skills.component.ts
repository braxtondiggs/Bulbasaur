import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GoogleAnalyticsService } from '../../shared/services';
import { ceil, floor, isUndefined, map, reduce, reject, toLower } from 'lodash-es';
import * as Highcharts from 'highcharts';
import * as dayjs from 'dayjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-skills',
  styleUrls: ['./skills.component.scss'],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
  public updateFlag: boolean = false;
  public Highcharts: typeof Highcharts = Highcharts;
  public date: any = { begin: Date, end: Date };
  public chart: { languages: Highcharts.Options, activity: Highcharts.Options, editors: Highcharts.Options } = { languages: {}, activity: {}, editors: {} };
  public skills: any;
  public chartName = 'languages';
  public minDate = dayjs('2016-06-22', 'YYYY-MM-DD').format();
  public maxDate = dayjs().subtract(1, 'days').format();
  public form = new UntypedFormGroup({
    range: new UntypedFormControl('last30days', [Validators.required]),
    start: new UntypedFormControl(null, [Validators.required]),
    end: new UntypedFormControl(null, [Validators.required])
  });
  private chartRef: any = { languages: {}, editors: {}, activity: {} };
  @ViewChild('selector') selector: MatSelect;
  @ViewChild('picker') datePicker: MatDatepicker<Date>;
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

  public dateRangeChange(): void {
    if (this.form.valid) {
      this.date = {
        begin: dayjs(this.form.value.start).format('MMM Do YYYY'),
        end: dayjs(this.form.value.end).format('MMM Do YYYY')
      };
      this.getSkills('customrange');
    }
  }

  public openCustomRange() {
    this.datePicker.open();
    this.selector.close();
  }

  private updateSeries() {
    this.skills.Editors = reject(this.skills.Editors, (o) => isUndefined(o.total_seconds));
    this.skills.Languages = reject(this.skills.Languages, (o) => isUndefined(o.total_seconds));
    const totalCount: number = reduce(this.skills.Languages, (sum: number, n: any) => sum + n.total_seconds, 0);
    if (this.chartName === 'languages') {
      this.chartRef.languages.series[0].remove();
      this.chartRef.languages.addSeries({
        data: map(this.skills.Languages, (o: any) => [o.name, ceil((o.total_seconds / totalCount) * 100, 2)]),
        name: 'Percentage'
      });
    } else if (this.chartName === 'activity') {
      this.chartRef.activity.series[0].remove();
      this.chartRef.activity.addSeries({
        data: map(this.skills.Timeline, 'total_seconds').map((o: any) => o / 3600),
        showInLegend: false
      });
      this.chart.activity.xAxis = {
        categories: map(this.skills.Timeline, 'date').map((v: string) => dayjs(v).format('MMM Do'))
      };
    } else if (this.chartName === 'editors') {
      this.chartRef.editors.series[0].remove();
      this.chartRef.editors.addSeries({
        data: map(this.skills.Editors, (o: any) => [o.name, ceil((o.total_seconds / totalCount) * 100, 2)]),
        name: 'Percentage'
      });
    }
    this.updateFlag = true;
  }

  public chartCallbackLang(ev) {
    this.chartRef.languages = ev;
  }

  public chartCallbackAct(ev) {
    this.chartRef.activity = ev;
  }

  public chartCallbackEditor(ev) {
    this.chartRef.editors = ev;
  }

  private getCustomDate(range: string): string {
    return range === 'customrange' && this.date.begin && this.date.end ?
      `&start=${this.date.begin}&end=${this.date.end}` : '';
  }

  private getSkills(range: string = 'last30days'): void {
    this.http.get(`https://wartortle.herokuapp.com?range=${range}${this.getCustomDate(range)}`)
      .subscribe((data: any) => {
        this.skills = data;
        this.updateSeries();
      });
  }

  private setDefaultCharts(): void {
    const width: number = document.getElementById('skills').clientWidth - 40;
    this.chart = {
      activity: {
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
        },
        series: [{}] as any
      },
      editors: {
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
        },
        series: [{}] as any
      },
      languages: {
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
        },
        series: [{}] as any
      }
    };
  }
}
