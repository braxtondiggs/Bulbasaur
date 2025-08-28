import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { CustomDateRange, SkillsData } from '@shared/models';
import { DateFormatPipe, ParsePipe } from '@shared/pipes/date.pipe';
import { AnalyticsHelperService, GoogleAnalyticsService, ModalService } from '@shared/services';
import dayjs from 'dayjs';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon, AnimateOnScrollDirective, ParsePipe, DateFormatPipe, HighchartsChartComponent],
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent implements OnInit, OnDestroy {
  // Highcharts reference for the template
  public readonly Highcharts: typeof Highcharts = Highcharts;

  // Signals for reactive state management
  public updateFlag = signal(false);
  public skills = signal<SkillsData | null>(null);
  public selectedTabIndex = signal(0);
  public currentTheme = signal<string>('light');
  public isLoading = signal(false);
  public isInitialLoad = signal(true);
  public isRefreshing = signal(false);
  public showCustomRangeModal = signal(false);
  public today = dayjs().format('YYYY-MM-DD');

  // Computed values
  public chartName = computed(() => {
    const tabLabels: Array<'languages' | 'activity' | 'editors'> = ['languages', 'activity', 'editors'];
    return tabLabels[this.selectedTabIndex()];
  });

  // Chart options as signals
  public languagesChartOptions = signal<Highcharts.Options>({});
  public activityChartOptions = signal<Highcharts.Options>({});
  public editorsChartOptions = signal<Highcharts.Options>({});

  // Constants
  public readonly minDate = dayjs('2016-06-22', 'YYYY-MM-DD').format();
  public readonly maxDate = dayjs().subtract(1, 'days').format();

  // Form state
  public date: CustomDateRange = { begin: '', end: '' };
  public form = new FormGroup({
    range: new FormControl<string>('last30days', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    start: new FormControl<string>('', { validators: [Validators.required] }),
    end: new FormControl<string>('', { validators: [Validators.required] })
  });

  private readonly destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  @ViewChild('selector') selector!: any;
  @ViewChild('picker') datePicker!: any;
  @ViewChild('languagesChart') languagesChart?: HighchartsChartComponent;
  @ViewChild('activityChart') activityChart?: HighchartsChartComponent;
  @ViewChild('editorsChart') editorsChart?: HighchartsChartComponent;

  private readonly http = inject(HttpClient);
  private readonly ga = inject(GoogleAnalyticsService);
  private readonly analyticsHelper = inject(AnalyticsHelperService);
  private readonly modalService = inject(ModalService);

  constructor() {
    // Effect to handle theme changes and update charts
    effect(() => {
      this.currentTheme();
      this.initializeChartOptions();
      this.updateChartData();
    });

    // Effect to trigger chart updates when data changes
    effect(() => {
      const skillsData = this.skills();
      if (skillsData) {
        this.updateChartData();
      }
    });
  }

  public ngOnInit(): void {
    this.setupThemeDetection();
    this.initializeChartOptions();
    this.setupResizeObserver();
    this.getSkills();
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(
        debounce(() => {
          this.resizeCharts();
        }, 250)
      );

      // Observe the component element if available
      setTimeout(() => {
        const element = document.querySelector('#skills');
        if (element) {
          this.resizeObserver?.observe(element);
        }
      });
    }
  }

  private resizeCharts(): void {
    this.updateFlag.set(true);

    // Manually trigger chart reflow
    [this.languagesChart, this.activityChart, this.editorsChart].forEach(chart => {
      if (chart && (chart as any).chart) {
        (chart as any).chart.reflow();
      }
    });

    setTimeout(() => {
      this.updateFlag.set(false);
    }, 100);
  }

  private setupThemeDetection(): void {
    const htmlElement = document.documentElement;
    const theme = htmlElement.getAttribute('data-theme') || 'light';
    this.currentTheme.set(theme);

    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = htmlElement.getAttribute('data-theme') || 'light';
          this.currentTheme.set(newTheme);
        }
      });
    });

    observer.observe(htmlElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver?.disconnect();
  }

  public selectionChange(selection: Event | { value: string }): void {
    let value: string;
    if ('value' in selection) {
      value = selection.value;
    } else {
      const target = selection.target as HTMLSelectElement;
      value = target.value;
    }
    if (value === 'customrange') {
      this.openCustomRange();
    } else {
      this.getSkills(value);
      // Use enhanced analytics tracking
      this.analyticsHelper.trackSkillInteraction('filter', value, 'date_range');
    }
  }

  public selectedTabChange(selection: { index: number }): void {
    this.selectedTabIndex.set(selection.index);
    // Use enhanced analytics tracking
    this.analyticsHelper.trackSkillInteraction('view', this.chartName(), 'chart_tab');
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
    this.showCustomRangeModal.set(true);
    this.modalService.setModalOpen(true);
  }

  public closeCustomRange() {
    this.showCustomRangeModal.set(false);
    this.modalService.setModalOpen(false);
    // Reset selection to last30days if no valid dates are set
    if (!this.form.value.start || !this.form.value.end) {
      this.form.patchValue({ range: 'last30days' });
    }
  }

  public applyCustomRange() {
    const start = this.form.value.start;
    const end = this.form.value.end;

    if (start && end) {
      // Validate that end date is after start date
      if (dayjs(end).isBefore(dayjs(start))) {
        // Show error or swap dates
        this.form.patchValue({
          start: end,
          end: start
        });
      }

      this.showCustomRangeModal.set(false);
      this.modalService.setModalOpen(false);
      this.dateRangeChange();
    }
  }

  public getDaysDifference(): number {
    const start = this.form.value.start;
    const end = this.form.value.end;

    if (start && end) {
      return dayjs(end).diff(dayjs(start), 'day') + 1; // +1 to include both start and end days
    }
    return 0;
  }

  private initializeChartOptions(): void {
    const colors = this.getThemeColors();
    const baseOptions: Partial<Highcharts.Options> = {
      credits: { enabled: false },
      chart: {
        backgroundColor: 'transparent',
        style: { fontFamily: 'BandaRegular, sans-serif' },
        borderRadius: 8,
        spacing: [10, 10, 10, 10],
        animation: {
          duration: 750
        } as Highcharts.AnimationOptionsObject
      },
      title: { text: undefined },
      accessibility: { enabled: false },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              chart: {
                spacing: [5, 5, 5, 5]
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: false
                  },
                  showInLegend: true
                }
              }
            }
          }
        ]
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            theme: {
              fill: colors.background,
              stroke: colors.border,
              r: 3
            } as any,
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadSVG']
          }
        }
      }
    };

    // Languages Chart (Pie)
    this.languagesChartOptions.set({
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'pie',
        height: 350
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.border,
        borderRadius: 6,
        shadow: true,
        style: {
          color: colors.text,
          fontSize: '12px',
          fontFamily: 'BandaRegular, sans-serif',
          padding: '8px'
        },
        pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: '85%',
          innerSize: '35%', // Donut chart
          dataLabels: {
            enabled: true,
            distance: 20,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: {
              color: colors.text,
              fontSize: '11px',
              fontFamily: 'BandaRegular, sans-serif',
              textOutline: 'none'
            }
          },
          showInLegend: false,
          borderWidth: 0,
          states: {
            hover: {
              halo: {
                size: 5,
                opacity: 0.25
              }
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Languages',
          colorByPoint: true,
          data: []
        } as Highcharts.SeriesPieOptions
      ]
    });

    // Activity Chart (Area Spline)
    this.activityChartOptions.set({
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'areaspline',
        height: 400,
        zooming: { type: 'x' }
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.border,
        borderRadius: 6,
        shadow: true,
        style: {
          color: colors.text,
          fontSize: '12px',
          fontFamily: 'BandaRegular, sans-serif',
          padding: '8px'
        },
        formatter: function () {
          const hours = this.y || 0;
          const hrs = Math.floor(hours);
          const mins = Math.floor((hours % 1) * 60);
          const date = Highcharts.dateFormat('%b %d, %Y', this.x as number);
          return (
            `<span style="color: ${this.color}">●</span> ` +
            `<b>${date}</b><br/>` +
            `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : '0m'}`
          );
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
            fontFamily: 'BandaRegular, sans-serif',
            fontSize: '11px'
          },
          rotation: -45,
          format: '{value:%b %d}'
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
        min: 0,
        labels: {
          style: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif'
          },
          formatter: function () {
            return `${this.value}h`;
          }
        },
        title: {
          text: 'Hours Coded',
          style: {
            color: colors.text,
            fontFamily: 'BandaRegular, sans-serif'
          }
        }
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.3,
          lineWidth: 3,
          marker: {
            enabled: true,
            radius: 4,
            lineWidth: 2,
            lineColor: '#ffffff',
            states: {
              hover: {
                radius: 6,
                lineWidth: 2,
                fillColor: colors.text
              }
            }
          },
          states: {
            hover: {
              lineWidthPlus: 1
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      series: []
    });

    // Editors Chart (Pie)
    this.editorsChartOptions.set({
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'pie',
        height: 350
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.border,
        borderRadius: 6,
        shadow: true,
        style: {
          color: colors.text,
          fontSize: '12px',
          fontFamily: 'BandaRegular, sans-serif',
          padding: '8px'
        },
        pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: '85%',
          innerSize: '35%', // Donut chart
          dataLabels: {
            enabled: true,
            distance: 20,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: {
              color: colors.text,
              fontSize: '11px',
              fontFamily: 'BandaRegular, sans-serif',
              textOutline: 'none'
            }
          },
          showInLegend: false,
          borderWidth: 0,
          states: {
            hover: {
              halo: {
                size: 5,
                opacity: 0.25
              }
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Editors',
          colorByPoint: true,
          data: []
        } as Highcharts.SeriesPieOptions
      ]
    });
  }

  private updateChartData(): void {
    const skillsData = this.skills();
    if (!skillsData?.Languages || !skillsData?.Editors || !skillsData?.Timeline) {
      return;
    }

    // Filter out invalid data
    const validLanguages = skillsData.Languages.filter(lang => lang.total_seconds > 0);
    const validEditors = skillsData.Editors.filter(editor => editor.total_seconds > 0);
    const validTimeline = skillsData.Timeline.filter(item => item.total_seconds > 0);

    if (validLanguages.length === 0 && validEditors.length === 0 && validTimeline.length === 0) {
      return;
    }

    const totalLanguageTime = validLanguages.reduce((sum, lang) => sum + lang.total_seconds, 0);
    const totalEditorTime = validEditors.reduce((sum, editor) => sum + editor.total_seconds, 0);

    // Update Languages Chart
    const languagesData: Array<[string, number]> = validLanguages
      .map(
        language =>
          [language.name, Math.round((language.total_seconds / totalLanguageTime) * 100 * 100) / 100] as [
            string,
            number
          ]
      )
      .sort((a, b) => b[1] - a[1]);

    this.languagesChartOptions.update(options => ({
      ...options,
      series: [
        {
          ...options.series?.[0],
          type: 'pie',
          name: 'Languages',
          data: languagesData
        } as Highcharts.SeriesPieOptions
      ]
    }));

    // Update Activity Chart
    const activityData: Array<[number, number]> = validTimeline
      .map(
        item =>
          [dayjs(item.date).valueOf(), Math.round((item.total_seconds / 3600) * 100) / 100] as [number, number]
      )
      .sort((a, b) => a[0] - b[0]); // Sort by timestamp

    this.activityChartOptions.update(options => ({
      ...options,
      series: [
        {
          type: 'areaspline',
          name: 'Daily Activity',
          data: activityData,
          color: this.getActivityChartColor(),
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, `${this.getActivityChartColor()}80`], // 50% opacity
              [1, `${this.getActivityChartColor()}20`] // 12% opacity
            ]
          }
        } as Highcharts.SeriesAreasplineOptions
      ]
    }));

    // Update Editors Chart
    const editorsData: Array<[string, number]> = validEditors
      .map(
        editor =>
          [editor.name, Math.round((editor.total_seconds / totalEditorTime) * 100 * 100) / 100] as [string, number]
      )
      .sort((a, b) => b[1] - a[1]);

    this.editorsChartOptions.update(options => ({
      ...options,
      series: [
        {
          ...options.series?.[0],
          type: 'pie',
          name: 'Editors',
          data: editorsData
        } as Highcharts.SeriesPieOptions
      ]
    }));

    this.updateFlag.set(true);

    setTimeout(() => {
      this.updateFlag.set(false);
    }, 100);
  }

  private getCustomDate(range: string): string {
    return range === 'customrange' && this.date.begin && this.date.end
      ? `&start=${this.date.begin}&end=${this.date.end}`
      : '';
  }

  private getSkills(range: string = 'last30days'): void {
    // Set different loading states based on whether we have existing data
    if (this.skills() === null) {
      this.isLoading.set(true);
      this.isInitialLoad.set(true);
    } else {
      this.isRefreshing.set(true);
    }

    this.http
      .get<SkillsData>(`https://code.braxtondiggs.com/api?range=${range}${this.getCustomDate(range)}`)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        catchError(error => {
          console.error('Error loading skills data:', error);
          this.isLoading.set(false);
          this.isInitialLoad.set(false);
          this.isRefreshing.set(false);
          return of({ Languages: [], Editors: [], Timeline: [] } as SkillsData);
        })
      )
      .subscribe(data => {
        this.skills.set(data);
        this.isLoading.set(false);
        this.isInitialLoad.set(false);
        this.isRefreshing.set(false);
      });
  }

  private getThemeColors() {
    const theme = this.currentTheme();

    // Enhanced DaisyUI theme-based colors
    switch (theme) {
      case 'dark':
        return {
          background: 'rgba(31, 41, 55, 0.9)',
          text: '#e5e7eb',
          textHover: '#ffffff',
          border: '#374151',
          gridLine: 'rgba(75, 85, 99, 0.3)',
          plotLine: '#6b7280',
          tooltipBg: 'rgba(17, 24, 39, 0.95)'
        };
      case 'cyberpunk':
        return {
          background: 'rgba(26, 11, 51, 0.9)',
          text: '#FFE300',
          textHover: '#FF003C',
          border: '#FF003C',
          gridLine: 'rgba(255, 227, 0, 0.2)',
          plotLine: '#00D8FF',
          tooltipBg: 'rgba(26, 11, 51, 0.95)'
        };
      case 'synthwave':
        return {
          background: 'rgba(26, 11, 46, 0.9)',
          text: '#E4007C',
          textHover: '#00D9FF',
          border: '#E4007C',
          gridLine: 'rgba(228, 0, 124, 0.2)',
          plotLine: '#00D9FF',
          tooltipBg: 'rgba(26, 11, 46, 0.95)'
        };
      default: // light theme
        return {
          background: 'rgba(255, 255, 255, 0.9)',
          text: '#374151',
          textHover: '#1f2937',
          border: '#d1d5db',
          gridLine: 'rgba(209, 213, 219, 0.5)',
          plotLine: '#e5e7eb',
          tooltipBg: 'rgba(255, 255, 255, 0.95)'
        };
    }
  }

  private getActivityChartColor(): string {
    const theme = this.currentTheme();
    switch (theme) {
      case 'dark':
        return '#3b82f6';
      case 'cyberpunk':
        return '#00D8FF';
      case 'synthwave':
        return '#E4007C';
      default:
        return '#6366f1';
    }
  }
}

// Utility function for debouncing
function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
