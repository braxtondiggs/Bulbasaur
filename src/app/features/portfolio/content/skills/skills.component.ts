import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  HostListener
} from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from '@shared/services';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import dayjs from 'dayjs';
import { SkillsData, ChartData, CustomDateRange } from '@shared/models';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { ParsePipe, DateFormatPipe } from '@shared/pipes/date.pipe';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HighchartsChartModule,
    AnimateOnScrollDirective,
    ParsePipe,
    DateFormatPipe
  ],
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
    range: new FormControl<string>('last30days', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    start: new FormControl<string>('', { validators: [Validators.required] }),
    end: new FormControl<string>('', { validators: [Validators.required] })
  });

  private readonly chartRef: Record<string, Highcharts.Chart> = {
    languages: {} as Highcharts.Chart,
    editors: {} as Highcharts.Chart,
    activity: {} as Highcharts.Chart
  };
  private readonly destroy$ = new Subject<void>();

  @ViewChild('selector') selector!: any;
  @ViewChild('picker') datePicker!: any;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private ga = inject(GoogleAnalyticsService);
  private isDarkMode = false;

  public ngOnInit(): void {
    this.detectTheme();
    this.setDefaultCharts();
    this.getSkills();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Responsive chart resizing
    if (this.chartRef.languages?.reflow) {
      this.chartRef.languages.reflow();
    }
    if (this.chartRef.activity?.reflow) {
      this.chartRef.activity.reflow();
    }
    if (this.chartRef.editors?.reflow) {
      this.chartRef.editors.reflow();
    }
  }

  private detectTheme(): void {
    const htmlElement = document.documentElement;
    const theme = htmlElement.getAttribute('data-theme');
    this.isDarkMode = ['dark', 'cyberpunk', 'synthwave'].includes(theme || '');

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = htmlElement.getAttribute('data-theme');
          this.isDarkMode = ['dark', 'cyberpunk', 'synthwave'].includes(newTheme || '');
          this.setDefaultCharts();
          this.updateSeries();
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

    this.skills.Editors = this.skills.Editors.filter(
      editor => editor.total_seconds !== undefined
    );
    this.skills.Languages = this.skills.Languages.filter(
      language => language.total_seconds !== undefined
    );
    const totalCount: number = this.skills.Languages.reduce(
      (sum: number, language) => sum + language.total_seconds, 0
    );

    if (this.chartName === 'languages' && this.chartRef.languages?.series?.[0]) {
      this.chartRef.languages.series[0].remove();
      this.chartRef.languages.addSeries({
        type: 'pie',
        data: this.skills.Languages.map(language => [
          language.name,
          Math.ceil((language.total_seconds / totalCount) * 100 * 100) / 100
        ]),
        name: 'Percentage'
      });
    } else if (this.chartName === 'activity' && this.chartRef.activity?.series?.[0]) {
      this.chartRef.activity.series[0].remove();
      this.chartRef.activity.addSeries({
        type: 'line',
        data: this.skills.Timeline.map(item => item.total_seconds).map((seconds: number) => seconds / 3600),
        showInLegend: false
      });
      this.chart.activity.xAxis = {
        categories: this.skills.Timeline.map(item => item.date).map((dateStr: string) => dayjs(dateStr).format('MMM Do'))
      };
    } else if (this.chartName === 'editors' && this.chartRef.editors?.series?.[0]) {
      this.chartRef.editors.series[0].remove();
      this.chartRef.editors.addSeries({
        type: 'pie',
        data: this.skills.Editors.map(editor => [
          editor.name,
          Math.ceil((editor.total_seconds / totalCount) * 100 * 100) / 100
        ]),
        name: 'Percentage'
      });
    }

    this.updateFlag = true;
    // Trigger change detection after updating charts
    this.cdr.detectChanges();
  }

  public chartCallbackLang(chart: Highcharts.Chart): void {
    this.chartRef.languages = chart;
    // Trigger change detection to ensure chart is properly rendered
    this.cdr.detectChanges();
  }

  public chartCallbackAct(chart: Highcharts.Chart): void {
    this.chartRef.activity = chart;
    // Trigger change detection to ensure chart is properly rendered
    this.cdr.detectChanges();
  }

  public chartCallbackEditor(chart: Highcharts.Chart): void {
    this.chartRef.editors = chart;
    // Trigger change detection to ensure chart is properly rendered
    this.cdr.detectChanges();
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
          this.cdr.detectChanges(); // Trigger change detection on error
          return of({ Languages: [], Editors: [], Timeline: [] } as SkillsData);
        })
      )
      .subscribe(data => {
        this.skills = data;
        this.updateSeries();
        this.cdr.detectChanges(); // Trigger change detection after data loads
      });
  }

  private setDefaultCharts(): void {
    const skillsElement = document.getElementById('skills');
    const width: number = skillsElement ? skillsElement.clientWidth - 40 : 800;
    const colors = this.getThemeColors();

    // Modern color palette
    const modernPalette = this.isDarkMode
      ? ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']
      : ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#7C2D12', '#0891B2', '#65A30D'];

    Highcharts.setOptions({
      colors: modernPalette,
      lang: {
        loading: 'Loading data...',
        noData: 'No data available'
      },
      accessibility: {
        enabled: false
      }
    });

    const baseOptions = {
      credits: { enabled: false },
      chart: {
        backgroundColor: colors.background,
        style: { fontFamily: 'BandaRegular, sans-serif' },
        borderRadius: 8,
        spacing: [15, 15, 15, 15],
        animation: { duration: 800, easing: 'easeOutQuart' }
      },
      title: { text: null },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
          }
        }
      },
      accessibility: {
        enabled: false
      }
    };

    this.chart = {
      activity: {
        ...baseOptions,
        accessibility: {
          enabled: false
        },
        chart: {
          ...baseOptions.chart,
          type: 'areaspline',
          width: Math.min(width, 675), // Limit maximum width to prevent overflow
          height: 400, // Set a fixed height
          zooming: {
            type: 'x'
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.border,
          borderRadius: 6,
          borderWidth: 1,
          shadow: {
            color: 'rgba(0, 0, 0, 0.3)',
            offsetX: 2,
            offsetY: 2,
            opacity: 0.3,
            width: 3
          },
          style: {
            color: colors.text,
            fontSize: '12px',
            fontFamily: 'BandaRegular, sans-serif'
          },
          pointFormatter() {
            const time = this.y * 3600;
            const hrs = Math.floor(time / 3600);
            const mins = Math.floor((time % 3600) / 60);
            return `<span style="color: ${this.color}">●</span> ` +
              `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : '0m'}`;
          }
        },
        xAxis: {
          type: 'datetime',
          gridLineColor: colors.gridLine,
          lineColor: colors.border,
          tickColor: colors.border,
          labels: {
            style: {
              color: colors.text,
              fontFamily: 'BandaRegular, sans-serif'
            }
          },
          title: {
            text: 'Date',
            style: {
              color: colors.text,
              fontFamily: 'BandaRegular, sans-serif'
            }
          }
        },
        yAxis: {
          gridLineColor: colors.gridLine,
          lineColor: colors.border,
          tickColor: colors.border,
          labels: {
            style: {
              color: colors.text,
              fontFamily: 'BandaRegular, sans-serif'
            }
          },
          title: {
            text: 'Hours',
            style: {
              color: colors.text,
              fontFamily: 'BandaRegular, sans-serif'
            }
          },
          plotLines: [{
            color: colors.plotLine,
            value: 0,
            width: 1,
            zIndex: 4
          }]
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.2,
            marker: {
              enabled: true,
              radius: 4,
              states: {
                hover: { radius: 6, lineWidth: 2 }
              }
            }
          }
        },
        legend: {
          enabled: true,
          itemStyle: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif'
          },
          itemHoverStyle: {
            color: colors.textHover,
            fontFamily: 'BandaRegular, sans-serif'
          }
        },
        series: []
      },

      languages: {
        ...baseOptions,
        accessibility: {
          enabled: false
        },
        chart: {
          ...baseOptions.chart,
          type: 'pie',
          width,
          options3d: {
            enabled: false
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.border,
          borderRadius: 6,
          borderWidth: 1,
          shadow: {
            color: 'rgba(0, 0, 0, 0.3)',
            offsetX: 2,
            offsetY: 2,
            opacity: 0.3,
            width: 3
          },
          style: {
            color: colors.text,
            fontSize: '12px',
            fontFamily: 'BandaRegular, sans-serif'
          },
          pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: 15,
              format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
              style: {
                color: colors.text,
                fontSize: '12px',
                fontWeight: 'normal',
                fontFamily: 'BandaRegular, sans-serif'
              }
            },
            showInLegend: true,
            states: {
              hover: {
                halo: { size: 5, opacity: 0.25 }
              }
            },
            borderWidth: 2,
            borderColor: colors.background,
            size: '75%'
          }
        },
        legend: {
          enabled: false // Disabled for pie charts to use data labels instead
        },
        series: []
      },

      editors: {
        ...baseOptions,
        accessibility: {
          enabled: false
        },
        chart: {
          ...baseOptions.chart,
          type: 'pie',
          width
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.border,
          borderRadius: 6,
          borderWidth: 1,
          shadow: {
            color: 'rgba(0, 0, 0, 0.3)',
            offsetX: 2,
            offsetY: 2,
            opacity: 0.3,
            width: 3
          },
          style: {
            color: colors.text,
            fontSize: '12px',
            fontFamily: 'BandaRegular, sans-serif'
          },
          pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: 15,
              format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
              style: {
                color: colors.text,
                fontSize: '12px',
                fontWeight: 'normal',
                fontFamily: 'BandaRegular, sans-serif'
              }
            },
            showInLegend: true,
            states: {
              hover: {
                halo: { size: 5, opacity: 0.25 }
              }
            },
            borderWidth: 2,
            borderColor: colors.background,
            size: '75%'
          }
        },
        legend: {
          enabled: false
        },
        series: []
      }
    };
  }

  private getThemeColors() {
    const theme = document.documentElement.getAttribute('data-theme');

    // DaisyUI theme-based colors with fallback explicit colors
    switch (theme) {
      case 'dark':
        return {
          background: 'transparent',
          text: '#a6adba', // Explicit fallback for hsl(var(--bc))
          textHover: '#ffffff',
          border: '#2a2e37', // Explicit fallback for hsl(var(--b2))
          gridLine: 'rgba(42, 46, 55, 0.3)',
          plotLine: '#1f2937',
          tooltipBg: '#1f2937' // Explicit dark background
        };
      case 'cyberpunk':
        return {
          background: 'transparent',
          text: '#FFE300',
          textHover: '#FF003C',
          border: '#FF003C',
          gridLine: 'rgba(255, 227, 0, 0.2)',
          plotLine: '#00D8FF',
          tooltipBg: '#1A0B33'
        };
      case 'synthwave':
        return {
          background: 'transparent',
          text: '#E4007C',
          textHover: '#00D9FF',
          border: '#E4007C',
          gridLine: 'rgba(228, 0, 124, 0.2)',
          plotLine: '#00D9FF',
          tooltipBg: '#1A0B2E'
        };
      default: // light theme
        return {
          background: 'transparent',
          text: '#1f2937', // Explicit fallback for hsl(var(--bc))
          textHover: '#374151',
          border: '#e5e7eb', // Explicit fallback for hsl(var(--b3))
          gridLine: 'rgba(229, 231, 235, 0.3)',
          plotLine: '#f3f4f6',
          tooltipBg: '#ffffff' // Explicit white background
        };
    }
  }
}

