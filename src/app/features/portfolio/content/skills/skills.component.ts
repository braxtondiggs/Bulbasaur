import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { CustomDateRange, SkillsData } from '@shared/models';
import { DateFormatPipe, ParsePipe } from '@shared/pipes/date.pipe';
import { GoogleAnalyticsService } from '@shared/services';
import dayjs from 'dayjs';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, AnimateOnScrollDirective, ParsePipe, DateFormatPipe, HighchartsChartComponent],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnInit, OnDestroy {
  public Highcharts: typeof Highcharts = Highcharts;
  public updateFlag: boolean = false;
  public date: CustomDateRange = { begin: '', end: '' };
  public skills!: SkillsData;
  public chartName: 'languages' | 'activity' | 'editors' = 'languages';
  public selectedTabIndex = 0;
  public readonly minDate = dayjs('2016-06-22', 'YYYY-MM-DD').format();
  public readonly maxDate = dayjs().subtract(1, 'days').format();

  // Chart options for each chart type
  public languagesChartOptions: Highcharts.Options = {};
  public activityChartOptions: Highcharts.Options = {};
  public editorsChartOptions: Highcharts.Options = {};

  public form = new FormGroup({
    range: new FormControl<string>('last30days', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    start: new FormControl<string>('', { validators: [Validators.required] }),
    end: new FormControl<string>('', { validators: [Validators.required] }),
  });

  private readonly destroy$ = new Subject<void>();
  private isDarkMode = false;

  @ViewChild('selector') selector!: any;
  @ViewChild('picker') datePicker!: any;
  @ViewChild('languagesChart') languagesChart!: HighchartsChartComponent;
  @ViewChild('activityChart') activityChart!: HighchartsChartComponent;
  @ViewChild('editorsChart') editorsChart!: HighchartsChartComponent;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private ga = inject(GoogleAnalyticsService);

  public ngOnInit(): void {
    this.detectTheme();
    this.initializeChartOptions();
    this.getSkills();
    setTimeout(() => this.cdr.detectChanges(), 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Trigger chart resize when window resizes
    this.resizeCharts();
  }

  private resizeCharts(): void {
    // Trigger update flag to force chart resize
    this.updateFlag = true;
    this.cdr.detectChanges();

    // Reset update flag after a short delay
    setTimeout(() => {
      this.updateFlag = false;
    }, 100);
  }

  private detectTheme(): void {
    const htmlElement = document.documentElement;
    const theme = htmlElement.getAttribute('data-theme');
    this.isDarkMode = ['dark', 'cyberpunk', 'synthwave'].includes(theme || '');

    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = htmlElement.getAttribute('data-theme');
          this.isDarkMode = ['dark', 'cyberpunk', 'synthwave'].includes(newTheme || '');
          this.initializeChartOptions();
          this.updateChartData();
        }
      });
    });

    observer.observe(htmlElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectionChange(selection: Event | { value: string }): void {
    let value: string;
    if ('value' in selection) {
      value = selection.value;
    } else {
      const target = selection.target as HTMLSelectElement;
      value = target.value;
    }
    if (value !== 'customrange') {
      this.getSkills(value);
      this.ga.eventEmitter('skills', 'select', value);
    }
  }

  public selectedTabChange(selection: { index: number }): void {
    this.selectedTabIndex = selection.index;
    const tabLabels: Array<'languages' | 'activity' | 'editors'> = ['languages', 'activity', 'editors'];
    this.chartName = tabLabels[selection.index];
    this.cdr.detectChanges();
    this.ga.eventEmitter('skills', 'tab', this.chartName);
  }

  public dateRangeChange(): void {
    if (this.form.valid) {
      this.date = {
        begin: dayjs(this.form.value.start).format('YYYY-MM-DD'),
        end: dayjs(this.form.value.end).format('YYYY-MM-DD'),
      };
      this.getSkills('customrange');
    }
  }

  public openCustomRange() {
    this.datePicker.open();
    this.selector.close();
  }

  private initializeChartOptions(): void {
    const colors = this.getThemeColors();
    const baseOptions: Partial<Highcharts.Options> = {
      credits: { enabled: false },
      chart: {
        backgroundColor: colors.background,
        style: { fontFamily: 'BandaRegular, sans-serif' },
        borderRadius: 8,
        spacing: [15, 15, 15, 15],
        // Make charts fully responsive
        width: null, // Let container determine width
        height: null, // Let container determine height
        reflow: true, // Enable automatic reflow
      },
      title: { text: null },
      accessibility: { enabled: false },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              chart: {
                spacing: [10, 10, 10, 10],
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: false,
                  },
                  showInLegend: true,
                },
              },
            },
          },
        ],
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
          },
        },
      },
    };

    // Languages Chart (Pie)
    this.languagesChartOptions = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'pie',
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.border,
        style: { color: colors.text, fontSize: '12px', fontFamily: 'BandaRegular, sans-serif' },
        pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: { color: colors.text, fontSize: '12px', fontFamily: 'BandaRegular, sans-serif' },
          },
          showInLegend: false,
          borderWidth: 2,
          borderColor: colors.background,
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Languages',
          data: [],
        },
      ],
    };

    // Activity Chart (Area Spline)
    this.activityChartOptions = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'areaspline',
        height: 400,
        zooming: { type: 'x' },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.border,
        style: { color: colors.text, fontSize: '12px', fontFamily: 'BandaRegular, sans-serif' },
        formatter: function () {
          const hours = this.y || 0;
          const time = hours * 3600;
          const hrs = Math.floor(hours);
          const mins = Math.floor((time % 3600) / 60);
          return (
            `<span style="color: ${this.color}">●</span> ` +
            `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : '0m'}`
          );
        },
      },
      xAxis: {
        type: 'datetime',
        gridLineColor: colors.gridLine,
        lineColor: colors.border,
        tickColor: colors.border,
        labels: {
          style: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif',
          },
        },
        title: {
          text: 'Date',
          style: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif',
          },
        },
      },
      yAxis: {
        gridLineColor: colors.gridLine,
        lineColor: colors.border,
        tickColor: colors.border,
        labels: {
          style: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif',
          },
        },
        title: {
          text: 'Hours',
          style: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif',
          },
        },
        plotLines: [
          {
            color: colors.plotLine,
            value: 0,
            width: 1,
            zIndex: 4,
          },
        ],
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.2,
          marker: {
            enabled: true,
            radius: 4,
            states: { hover: { radius: 6, lineWidth: 2 } },
          },
        },
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: colors.text,
          fontFamily: 'BandaRegular, sans-serif',
        },
        itemHoverStyle: {
          color: colors.textHover,
          fontFamily: 'BandaRegular, sans-serif',
        },
      },
      series: [],
    };

    // Editors Chart (Pie)
    this.editorsChartOptions = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'pie',
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.border,
        style: { color: colors.text, fontSize: '12px', fontFamily: 'BandaRegular, sans-serif' },
        pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: { color: colors.text, fontSize: '12px', fontFamily: 'BandaRegular, sans-serif' },
          },
          showInLegend: false,
          borderWidth: 2,
          borderColor: colors.background,
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Editors',
          data: [],
        },
      ],
    };
  }

  private updateChartData(): void {
    if (!this.skills || !this.skills.Languages || !this.skills.Editors || !this.skills.Timeline) {
      return;
    }

    // Filter out undefined data
    this.skills.Editors = this.skills.Editors.filter(editor => editor.total_seconds !== undefined);
    this.skills.Languages = this.skills.Languages.filter(language => language.total_seconds !== undefined);

    const totalCount: number = this.skills.Languages.reduce((sum: number, language) => sum + language.total_seconds, 0);

    // Update Languages Chart
    const languagesData = this.skills.Languages.map(language => [
      language.name,
      Math.ceil((language.total_seconds / totalCount) * 100 * 100) / 100,
    ]);

    this.languagesChartOptions = {
      ...this.languagesChartOptions,
      series: [
        {
          type: 'pie',
          name: 'Languages',
          data: languagesData,
        },
      ],
    };

    // Update Activity Chart
    const activityData = this.skills.Timeline.map(item => item.total_seconds / 3600);
    const categories = this.skills.Timeline.map(item => dayjs(item.date).format('MMM Do'));

    this.activityChartOptions = {
      ...this.activityChartOptions,
      xAxis: {
        ...this.activityChartOptions.xAxis,
        categories: categories,
      },
      series: [
        {
          type: 'areaspline',
          name: 'Daily Activity',
          data: activityData,
          showInLegend: false,
        },
      ],
    };

    // Update Editors Chart
    const editorsData = this.skills.Editors.map(editor => [
      editor.name,
      Math.ceil((editor.total_seconds / totalCount) * 100 * 100) / 100,
    ]);

    this.editorsChartOptions = {
      ...this.editorsChartOptions,
      series: [
        {
          type: 'pie',
          name: 'Editors',
          data: editorsData,
        },
      ],
    };

    this.updateFlag = true;
    this.cdr.detectChanges();
  }

  private getCustomDate(range: string): string {
    return range === 'customrange' && this.date.begin && this.date.end
      ? `&start=${this.date.begin}&end=${this.date.end}`
      : '';
  }

  private getSkills(range: string = 'last30days'): void {
    this.http
      .get<SkillsData>(`https://code.braxtondiggs.com/api?range=${range}${this.getCustomDate(range)}`)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading skills data:', error);
          this.cdr.detectChanges();
          return of({ Languages: [], Editors: [], Timeline: [] } as SkillsData);
        })
      )
      .subscribe(data => {
        this.skills = data;
        this.updateChartData();
        this.cdr.detectChanges();
      });
  }

  private getThemeColors() {
    const theme = document.documentElement.getAttribute('data-theme');

    // DaisyUI theme-based colors with fallback explicit colors
    switch (theme) {
      case 'dark':
        return {
          background: 'transparent',
          text: '#a6adba',
          textHover: '#ffffff',
          border: '#2a2e37',
          gridLine: 'rgba(42, 46, 55, 0.3)',
          plotLine: '#1f2937',
          tooltipBg: '#1f2937',
        };
      case 'cyberpunk':
        return {
          background: 'transparent',
          text: '#FFE300',
          textHover: '#FF003C',
          border: '#FF003C',
          gridLine: 'rgba(255, 227, 0, 0.2)',
          plotLine: '#00D8FF',
          tooltipBg: '#1A0B33',
        };
      case 'synthwave':
        return {
          background: 'transparent',
          text: '#E4007C',
          textHover: '#00D9FF',
          border: '#E4007C',
          gridLine: 'rgba(228, 0, 124, 0.2)',
          plotLine: '#00D9FF',
          tooltipBg: '#1A0B2E',
        };
      default: // light theme
        return {
          background: 'transparent',
          text: '#1f2937',
          textHover: '#374151',
          border: '#e5e7eb',
          gridLine: 'rgba(229, 231, 235, 0.3)',
          plotLine: '#f3f4f6',
          tooltipBg: '#ffffff',
        };
    }
  }
}
