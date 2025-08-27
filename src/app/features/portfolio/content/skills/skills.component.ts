import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from '@shared/services';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import dayjs from 'dayjs';
import { SkillsData, ChartData, CustomDateRange } from '@shared/models';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent implements OnInit, OnDestroy {
  public updateFlag: boolean = false;
  public readonly Highcharts: typeof Highcharts = Highcharts;
  public date: CustomDateRange = { begin: '', end: '' };
  public chart: ChartData = { languages: {}, activity: {}, editors: {} };
  public skills!: SkillsData;
  public chartName: 'languages' | 'activity' | 'editors' = 'languages';
  public selectedTabIndex = 0;
  public readonly minDate = dayjs('2016-06-22', 'YYYY-MM-DD').format();
  public readonly maxDate = dayjs().subtract(1, 'days').format();
  public form = new FormGroup({
    range: new FormControl<string>('last30days', { nonNullable: true, validators: [Validators.required] }),
    start: new FormControl<string>('', { validators: [Validators.required] }),
    end: new FormControl<string>('', { validators: [Validators.required] })
  });
  
  private readonly chartRef: Record<string, Highcharts.Chart> = { languages: {} as Highcharts.Chart, editors: {} as Highcharts.Chart, activity: {} as Highcharts.Chart };
  private readonly destroy$ = new Subject<void>();
  
  @ViewChild('selector') selector!: any;
  @ViewChild('picker') datePicker!: any;
  
  constructor(private http: HttpClient, private ga: GoogleAnalyticsService) { }

  public ngOnInit(): void {
    this.setDefaultCharts();
    this.getSkills();
  }
  
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectionChange(selection: Event | { value: string }): void {
    const target = selection as any;
    const value = target.target ? target.target.value : target.value;
    if (value !== 'customrange') {
      this.getSkills(value);
      this.ga.eventEmitter('skills', 'select', value);
    }
  }

  public selectedTabChange(selection: { index: number }): void {
    this.selectedTabIndex = selection.index;
    const tabLabels: Array<'languages' | 'activity' | 'editors'> = ['languages', 'activity', 'editors'];
    this.chartName = tabLabels[selection.index];
    this.updateSeries();
    this.ga.eventEmitter('skills', 'tab', this.chartName);
  }

  public dateRangeChange(): void {
    if (this.form.valid) {
      this.date = {
        begin: dayjs(this.form.value.start).format('YYYY-MM-DD'),
        end: dayjs(this.form.value.end).format('YYYY-MM-DD')
      };
      this.getSkills('customrange');
    }
  }

  public openCustomRange() {
    this.datePicker.open();
    this.selector.close();
  }

  private updateSeries(): void {
    if (!this.skills) {
      return;
    }
    
    this.skills.Editors = this.skills.Editors.filter(editor => editor.total_seconds !== undefined);
    this.skills.Languages = this.skills.Languages.filter(language => language.total_seconds !== undefined);
    const totalCount: number = this.skills.Languages.reduce((sum: number, language) => sum + language.total_seconds, 0);
    if (this.chartName === 'languages' && this.chartRef.languages.series?.[0]) {
      this.chartRef.languages.series[0].remove();
      this.chartRef.languages.addSeries({
        type: 'pie',
        data: this.skills.Languages.map(language => [language.name, Math.ceil((language.total_seconds / totalCount) * 100 * 100) / 100]) as any,
        name: 'Percentage'
      } as any);
    } else if (this.chartName === 'activity' && this.chartRef.activity.series?.[0]) {
      this.chartRef.activity.series[0].remove();
      this.chartRef.activity.addSeries({
        type: 'line',
        data: this.skills.Timeline.map(item => item.total_seconds).map((seconds: number) => seconds / 3600) as any,
        showInLegend: false
      } as any);
      this.chart.activity.xAxis = {
        categories: this.skills.Timeline.map(item => item.date).map((dateStr: string) => dayjs(dateStr).format('MMM Do'))
      };
    } else if (this.chartName === 'editors' && this.chartRef.editors.series?.[0]) {
      this.chartRef.editors.series[0].remove();
      this.chartRef.editors.addSeries({
        type: 'pie',
        data: this.skills.Editors.map(editor => [editor.name, Math.ceil((editor.total_seconds / totalCount) * 100 * 100) / 100]) as any,
        name: 'Percentage'
      } as any);
    }
    this.updateFlag = true;
  }

  public chartCallbackLang(chart: Highcharts.Chart): void {
    this.chartRef.languages = chart;
  }

  public chartCallbackAct(chart: Highcharts.Chart): void {
    this.chartRef.activity = chart;
  }

  public chartCallbackEditor(chart: Highcharts.Chart): void {
    this.chartRef.editors = chart;
  }

  private getCustomDate(range: string): string {
    return range === 'customrange' && this.date.begin && this.date.end ?
      `&start=${this.date.begin}&end=${this.date.end}` : '';
  }

  private getSkills(range: string = 'last30days'): void {
    this.http.get<SkillsData>(`https://code.braxtondiggs.com/api?range=${range}${this.getCustomDate(range)}`)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading skills data:', error);
          return of({ Languages: [], Editors: [], Timeline: [] } as SkillsData);
        })
      )
      .subscribe(data => {
        this.skills = data;
        this.updateSeries();
      });
  }

  private setDefaultCharts(): void {
    const skillsElement = document.getElementById('skills');
    const width: number = skillsElement ? skillsElement.clientWidth - 40 : 800;
    this.chart = {
      activity: {
        accessibility: {
          enabled: false
        },
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
            const time = this.y * 3600,
              hrs = Math.floor(time / 3600),
              mins = Math.floor((time % 3600) / 60);
            return `${(hrs > 0) ? `${hrs} Hours ` : ''}${(mins > 0) ? `${mins} Mins` : ''}`;
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
        accessibility: {
          enabled: false
        },
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
        accessibility: {
          enabled: false
        },
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

