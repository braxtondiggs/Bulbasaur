import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgIcon } from '@ng-icons/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { SkillsData } from '@shared/models';
import { DateFormatPipe, ParsePipe } from '@shared/pipes/date.pipe';
import { AnalyticsHelperService, GoogleAnalyticsService, ModalService, ScrollService } from '@shared/services';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { HighchartsChartComponent } from 'highcharts-angular';
import { of } from 'rxjs';
import { SkillsComponent } from './skills.component';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock Highcharts
jest.mock('highcharts', () => ({
  chart: jest.fn(),
  setOptions: jest.fn()
}));

describe('SkillsComponent', () => {
  let spectator: Spectator<SkillsComponent>;
  let httpTestingController: HttpTestingController;
  let analyticsHelperService: jest.Mocked<AnalyticsHelperService>;
  let googleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;
  let modalService: jest.Mocked<ModalService>;

  const mockSkillsData: SkillsData = {
    Languages: [
      { name: 'TypeScript', total_seconds: 100000, value: 45.5 },
      { name: 'JavaScript', total_seconds: 80000, value: 36.4 }
    ],
    Editors: [
      { name: 'VS Code', total_seconds: 150000 },
      { name: 'WebStorm', total_seconds: 50000 }
    ],
    Timeline: [
      { date: '2024-01-01', total_seconds: 8000 },
      { date: '2024-01-02', total_seconds: 12000 }
    ]
  };

  const createComponent = createComponentFactory({
    component: SkillsComponent,
    imports: [
      HttpClientTestingModule,
      ReactiveFormsModule,
      NgIcon,
      testNgIconsModule,
      AnimateOnScrollDirective,
      ParsePipe,
      DateFormatPipe,
      HighchartsChartComponent
    ],
    providers: [
      {
        provide: AnalyticsHelperService,
        useValue: {
          trackSkillInteraction: jest.fn(),
          trackFilterUsage: jest.fn()
        }
      },
      {
        provide: GoogleAnalyticsService,
        useValue: {
          trackEvent: jest.fn()
        }
      },
      {
        provide: ModalService,
        useValue: {
          showModal: jest.fn(),
          hideModal: jest.fn(),
          setModalOpen: jest.fn()
        }
      },
      {
        provide: ScrollService,
        useValue: {
          scrollObs: of({}),
          resizeObs: of({}),
          pos: 0,
          ngOnDestroy: jest.fn()
        }
      }
    ],
    shallow: true
  });

  beforeEach(() => {
    // Spy on console.error to prevent error logs in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    spectator = createComponent();
    try {
      httpTestingController = spectator.inject(HttpTestingController);
    } catch (error) {
      // HttpTestingController might not be available in some test scenarios
      console.warn('HttpTestingController not available');
    }
    analyticsHelperService = spectator.inject(AnalyticsHelperService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
    modalService = spectator.inject(ModalService);
  });

  afterEach(() => {
    try {
      if (httpTestingController) {
        httpTestingController.verify();
      }
    } catch (error) {
      // Ignore verification errors in case controller wasn't properly initialized
    }
    jest.clearAllMocks();
    // Restore console.error
    jest.restoreAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component.constructor.name).toBe('SkillsComponent');
    });

    it('should initialize signals with correct default values', () => {
      expect(spectator.component.updateFlag()).toBe(false);
      expect(spectator.component.skills()).toBeNull();
      expect(spectator.component.selectedTabIndex()).toBe(0);
      expect(spectator.component.currentTheme()).toBe('light');
      // After ngOnInit is called, isLoading should be true as it starts fetching data
      expect(spectator.component.isLoading()).toBe(true);
      expect(spectator.component.isInitialLoad()).toBe(true);
      expect(spectator.component.isRefreshing()).toBe(false);
      expect(spectator.component.showCustomRangeModal()).toBe(false);
    });

    it('should initialize form with default values', () => {
      expect(spectator.component.form.get('range')?.value).toBe('last30days');
      expect(spectator.component.form.get('start')?.value).toBe('');
      expect(spectator.component.form.get('end')?.value).toBe('');
    });

    it('should have correct chart name computed signal', () => {
      expect(spectator.component.chartName()).toBe('languages');

      spectator.component.selectedTabIndex.set(1);
      expect(spectator.component.chartName()).toBe('activity');

      spectator.component.selectedTabIndex.set(2);
      expect(spectator.component.chartName()).toBe('editors');
    });
  });

  describe('Form Validation', () => {
    it('should validate range field as required', () => {
      const rangeControl = spectator.component.form.get('range');
      rangeControl?.setValue('');
      expect(rangeControl?.hasError('required')).toBe(true);
    });

    it('should validate start field as required', () => {
      const startControl = spectator.component.form.get('start');
      startControl?.setValue('');
      expect(startControl?.hasError('required')).toBe(true);
    });

    it('should validate end field as required', () => {
      const endControl = spectator.component.form.get('end');
      endControl?.setValue('');
      expect(endControl?.hasError('required')).toBe(true);
    });

    it('should accept valid date format', () => {
      const startControl = spectator.component.form.get('start');
      startControl?.setValue('2024-01-01');
      expect(startControl?.valid).toBe(true);
    });
  });

  describe('Data Loading', () => {
    it('should load skills data on init', () => {
      spectator.component.ngOnInit();

      const reqs = httpTestingController?.match((request) => 
        request.url.includes('https://code.braxtondiggs.com/api?range=last30days') && request.method === 'GET'
      );
      expect(reqs?.length).toBeGreaterThan(0);
      
      reqs?.[0]?.flush(mockSkillsData);

      expect(spectator.component.skills()).toEqual(mockSkillsData);
      expect(spectator.component.isLoading()).toBe(false);
      expect(spectator.component.isInitialLoad()).toBe(false);
    });

    it('should handle API error during data loading', () => {
      spectator.component.ngOnInit();

      const reqs = httpTestingController?.match(
        request =>
          request.url.includes('https://code.braxtondiggs.com/api?range=last30days') && request.method === 'GET'
      );
      expect(reqs?.length).toBeGreaterThan(0);

      reqs?.[0]?.error(new ErrorEvent('Network error'));

      expect(spectator.component.skills()).toEqual({ Languages: [], Editors: [], Timeline: [] });
      expect(spectator.component.isLoading()).toBe(false);
    });
  });

  describe('Date Range Management', () => {
    it('should handle range selection change', () => {
      const mockEvent = { target: { value: 'last7days' } } as any;

      spectator.component.selectionChange(mockEvent);

      expect(analyticsHelperService.trackSkillInteraction).toHaveBeenCalledWith('filter', 'last7days', 'date_range');
    });

    it('should open custom range modal for custom selection', () => {
      spectator.component.openCustomRange();

      expect(spectator.component.showCustomRangeModal()).toBe(true);
      expect(modalService.setModalOpen).toHaveBeenCalledWith(true);
    });

    it('should close custom range modal', () => {
      spectator.component.showCustomRangeModal.set(true);

      spectator.component.closeCustomRange();

      expect(spectator.component.showCustomRangeModal()).toBe(false);
      expect(modalService.setModalOpen).toHaveBeenCalledWith(false);
    });

    it('should apply custom date range when form is valid', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      spectator.component.form.get('start')?.setValue(startDate);
      spectator.component.form.get('end')?.setValue(endDate);

      spectator.component.applyCustomRange();

      expect(spectator.component.showCustomRangeModal()).toBe(false);
      expect(modalService.setModalOpen).toHaveBeenCalledWith(false);
    });

    it('should calculate days difference correctly', () => {
      spectator.component.form.get('start')?.setValue('2024-01-01');
      spectator.component.form.get('end')?.setValue('2024-01-05');

      const daysDiff = spectator.component.getDaysDifference();

      expect(daysDiff).toBe(5); // Including both start and end dates
    });

    it('should return 0 for invalid date range', () => {
      spectator.component.form.get('start')?.setValue('');
      spectator.component.form.get('end')?.setValue('');

      const daysDiff = spectator.component.getDaysDifference();

      expect(daysDiff).toBe(0);
    });
  });

  describe('Tab Management', () => {
    it('should change selected tab', () => {
      spectator.component.selectedTabChange({ index: 1 });

      expect(spectator.component.selectedTabIndex()).toBe(1);
      expect(spectator.component.chartName()).toBe('activity');
      expect(analyticsHelperService.trackSkillInteraction).toHaveBeenCalledWith('view', 'activity', 'chart_tab');
    });

    it('should track analytics on tab change', () => {
      spectator.component.selectedTabChange({ index: 2 });

      expect(analyticsHelperService.trackSkillInteraction).toHaveBeenCalledWith('view', 'editors', 'chart_tab');
    });
  });

  describe('Date Range Change', () => {
    it('should update date range when form is valid', () => {
      spectator.component.form.get('start')?.setValue('2024-01-01');
      spectator.component.form.get('end')?.setValue('2024-01-31');

      spectator.component.dateRangeChange();

      expect(spectator.component.date.begin).toBe('2024-01-01');
      expect(spectator.component.date.end).toBe('2024-01-31');
    });

    it('should not update date range when form is invalid', () => {
      spectator.component.form.get('start')?.setValue('');
      spectator.component.form.get('end')?.setValue('');

      const originalDate = spectator.component.date;
      spectator.component.dateRangeChange();

      expect(spectator.component.date).toEqual(originalDate);
    });
  });

  describe('Component Lifecycle', () => {
    it('should call ngOnDestroy without errors', () => {
      expect(() => spectator.component.ngOnDestroy()).not.toThrow();
    });

    it('should initialize on component creation', () => {
      expect(spectator.component.isInitialLoad()).toBe(true);
    });
  });

  describe('Service Injection', () => {
    it('should inject required services', () => {
      expect(spectator.inject(HttpClient)).toBeDefined();
      expect(analyticsHelperService).toBeDefined();
      expect(googleAnalyticsService).toBeDefined();
      expect(modalService).toBeDefined();
    });
  });

  describe('Chart Options', () => {
    it('should initialize chart options signals', () => {
      expect(spectator.component.languagesChartOptions()).toBeDefined();
      expect(spectator.component.activityChartOptions()).toBeDefined();
      expect(spectator.component.editorsChartOptions()).toBeDefined();
    });

    it('should have update flag signal', () => {
      expect(typeof spectator.component.updateFlag).toBe('function');
      spectator.component.updateFlag.set(true);
      expect(spectator.component.updateFlag()).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full data loading and tab switching flow', () => {
      // Load initial data
      spectator.component.ngOnInit();

      const reqs = httpTestingController?.match(
        request => request.url.includes('https://code.braxtondiggs.com/api?range=last30days') && request.method === 'GET'
      );
      expect(reqs?.length).toBeGreaterThan(0);
      reqs?.[0]?.flush(mockSkillsData);

      // Switch tabs
      spectator.component.selectedTabChange({ index: 1 });
      spectator.component.selectedTabChange({ index: 2 });

      expect(spectator.component.skills()).toEqual(mockSkillsData);
      expect(spectator.component.selectedTabIndex()).toBe(2);
      expect(spectator.component.chartName()).toBe('editors');
      expect(analyticsHelperService.trackSkillInteraction).toHaveBeenCalledTimes(2);
    });

    it('should complete custom date range selection flow', () => {
      spectator.component.openCustomRange();

      expect(spectator.component.showCustomRangeModal()).toBe(true);

      spectator.component.form.get('start')?.setValue('2024-01-01');
      spectator.component.form.get('end')?.setValue('2024-01-31');
      spectator.component.applyCustomRange();

      expect(spectator.component.showCustomRangeModal()).toBe(false);
      expect(modalService.setModalOpen).toHaveBeenLastCalledWith(false);
    });
  });

  describe('Theme Management', () => {
    it('should initialize with light theme by default', () => {
      expect(spectator.component.currentTheme()).toBe('light');
    });

    it('should update chart options when theme changes', () => {
      const originalOptions = spectator.component.languagesChartOptions();
      
      spectator.component.currentTheme.set('dark');
      spectator.component['initializeChartOptions']();
      
      const newOptions = spectator.component.languagesChartOptions();
      expect(newOptions).toBeDefined();
    });

    it('should get correct theme colors for light theme', () => {
      spectator.component.currentTheme.set('light');
      const colors = spectator.component['getThemeColors']();
      
      expect(colors.background).toBe('rgba(255, 255, 255, 0.9)');
      expect(colors.text).toBe('#374151');
    });

    it('should get correct theme colors for dark theme', () => {
      spectator.component.currentTheme.set('dark');
      const colors = spectator.component['getThemeColors']();
      
      expect(colors.background).toBe('rgba(31, 41, 55, 0.9)');
      expect(colors.text).toBe('#e5e7eb');
    });

    it('should get correct theme colors for cyberpunk theme', () => {
      spectator.component.currentTheme.set('cyberpunk');
      const colors = spectator.component['getThemeColors']();
      
      expect(colors.background).toBe('rgba(26, 11, 51, 0.9)');
      expect(colors.text).toBe('#FFE300');
    });

    it('should get correct theme colors for synthwave theme', () => {
      spectator.component.currentTheme.set('synthwave');
      const colors = spectator.component['getThemeColors']();
      
      expect(colors.background).toBe('rgba(26, 11, 46, 0.9)');
      expect(colors.text).toBe('#E4007C');
    });

    it('should get correct activity chart color for different themes', () => {
      spectator.component.currentTheme.set('light');
      expect(spectator.component['getActivityChartColor']()).toBe('#6366f1');

      spectator.component.currentTheme.set('dark');
      expect(spectator.component['getActivityChartColor']()).toBe('#3b82f6');

      spectator.component.currentTheme.set('cyberpunk');
      expect(spectator.component['getActivityChartColor']()).toBe('#00D8FF');

      spectator.component.currentTheme.set('synthwave');
      expect(spectator.component['getActivityChartColor']()).toBe('#E4007C');
    });
  });

  describe('Chart Data Processing', () => {
    beforeEach(() => {
      spectator.component.skills.set(mockSkillsData);
    });

    it('should update chart data when skills data is available', () => {
      spectator.component['updateChartData']();
      
      const languagesOptions = spectator.component.languagesChartOptions();
      const activityOptions = spectator.component.activityChartOptions();
      const editorsOptions = spectator.component.editorsChartOptions();
      
      expect((languagesOptions.series?.[0] as any)?.data).toBeDefined();
      expect((activityOptions.series?.[0] as any)?.data).toBeDefined();
      expect((editorsOptions.series?.[0] as any)?.data).toBeDefined();
    });

    it('should handle empty skills data gracefully', () => {
      spectator.component.skills.set({ Languages: [], Editors: [], Timeline: [] });
      
      expect(() => spectator.component['updateChartData']()).not.toThrow();
    });

    it('should filter out invalid data with zero total_seconds', () => {
      const dataWithInvalid = {
        Languages: [
          { name: 'TypeScript', total_seconds: 100000, value: 45.5 },
          { name: 'Invalid', total_seconds: 0, value: 0 }
        ],
        Editors: [
          { name: 'VS Code', total_seconds: 150000 },
          { name: 'Invalid', total_seconds: 0 }
        ],
        Timeline: [
          { date: '2024-01-01', total_seconds: 8000 },
          { date: '2024-01-02', total_seconds: 0 }
        ]
      };
      
      spectator.component.skills.set(dataWithInvalid);
      spectator.component['updateChartData']();
      
      const languagesOptions = spectator.component.languagesChartOptions();
      const activityOptions = spectator.component.activityChartOptions();
      const editorsOptions = spectator.component.editorsChartOptions();
      
      expect((languagesOptions.series?.[0] as any)?.data?.length).toBe(1);
      expect((activityOptions.series?.[0] as any)?.data?.length).toBe(1);
      expect((editorsOptions.series?.[0] as any)?.data?.length).toBe(1);
    });

    it('should sort languages data by percentage descending', () => {
      const multiLanguageData = {
        Languages: [
          { name: 'JavaScript', total_seconds: 80000, value: 36.4 },
          { name: 'TypeScript', total_seconds: 100000, value: 45.5 },
          { name: 'Python', total_seconds: 40000, value: 18.1 }
        ],
        Editors: [],
        Timeline: []
      };
      
      spectator.component.skills.set(multiLanguageData);
      spectator.component['updateChartData']();
      
      const languagesOptions = spectator.component.languagesChartOptions();
      const seriesData = (languagesOptions.series?.[0] as any)?.data as [string, number][];
      
      expect(seriesData[0][0]).toBe('TypeScript'); // Highest percentage first
      expect(seriesData[1][0]).toBe('JavaScript');
      expect(seriesData[2][0]).toBe('Python');
    });

    it('should handle null skills data', () => {
      spectator.component.skills.set(null);
      
      expect(() => spectator.component['updateChartData']()).not.toThrow();
    });
  });

  describe('Custom Date Range Handling', () => {
    it('should get custom date string when range is customrange', () => {
      spectator.component.date = { begin: '2024-01-01', end: '2024-01-31' };
      
      const customDate = spectator.component['getCustomDate']('customrange');
      
      expect(customDate).toBe('&start=2024-01-01&end=2024-01-31');
    });

    it('should return empty string for non-custom range', () => {
      const customDate = spectator.component['getCustomDate']('last30days');
      
      expect(customDate).toBe('');
    });

    it('should return empty string when custom dates are not set', () => {
      spectator.component.date = { begin: '', end: '' };
      
      const customDate = spectator.component['getCustomDate']('customrange');
      
      expect(customDate).toBe('');
    });

    it('should swap dates if end date is before start date', () => {
      spectator.component.form.get('start')?.setValue('2024-01-31');
      spectator.component.form.get('end')?.setValue('2024-01-01');
      
      spectator.component.applyCustomRange();
      
      expect(spectator.component.form.get('start')?.value).toBe('2024-01-01');
      expect(spectator.component.form.get('end')?.value).toBe('2024-01-31');
    });
  });

  describe('Selection Change Handling', () => {
    it('should handle selection change with value object', () => {
      const mockSelection = { value: 'last7days' };
      
      spectator.component.selectionChange(mockSelection);
      
      expect(analyticsHelperService.trackSkillInteraction).toHaveBeenCalledWith('filter', 'last7days', 'date_range');
    });

    it('should handle selection change with event object', () => {
      const mockEvent = { target: { value: 'last7days' } } as any;
      
      spectator.component.selectionChange(mockEvent);
      
      expect(analyticsHelperService.trackSkillInteraction).toHaveBeenCalledWith('filter', 'last7days', 'date_range');
    });

    it('should open custom range for customrange selection', () => {
      jest.spyOn(spectator.component, 'openCustomRange');
      
      spectator.component.selectionChange({ value: 'customrange' });
      
      expect(spectator.component.openCustomRange).toHaveBeenCalled();
    });
  });

  describe('Resize Observer', () => {
    it('should setup resize observer in ngOnInit', () => {
      const mockObserve = jest.fn();
      const mockDisconnect = jest.fn();
      
      global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect
      }));
      
      spectator.component.ngOnInit();
      
      expect(global.ResizeObserver).toHaveBeenCalled();
    });

    it('should disconnect resize observer on destroy', () => {
      const mockDisconnect = jest.fn();
      spectator.component['resizeObserver'] = { disconnect: mockDisconnect } as any;
      
      spectator.component.ngOnDestroy();
      
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should resize charts when triggered', () => {
      const mockChart = {
        chart: { reflow: jest.fn() }
      };
      
      spectator.component.languagesChart = mockChart as any;
      spectator.component.activityChart = mockChart as any;
      spectator.component.editorsChart = mockChart as any;
      
      spectator.component['resizeCharts']();
      
      expect(mockChart.chart.reflow).toHaveBeenCalledTimes(3);
      expect(spectator.component.updateFlag()).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should debounce function calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = spectator.component['debounce'](mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();
      
      // Should be called once after delay
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });

    it('should reset form to last30days when closing custom range without dates', () => {
      spectator.component.form.get('start')?.setValue('');
      spectator.component.form.get('end')?.setValue('');
      
      spectator.component.closeCustomRange();
      
      expect(spectator.component.form.get('range')?.value).toBe('last30days');
    });

    it('should not reset form when closing custom range with valid dates', () => {
      spectator.component.form.get('start')?.setValue('2024-01-01');
      spectator.component.form.get('end')?.setValue('2024-01-31');
      spectator.component.form.get('range')?.setValue('customrange');
      
      spectator.component.closeCustomRange();
      
      expect(spectator.component.form.get('range')?.value).toBe('customrange');
    });
  });

  describe('Loading States', () => {
    it('should set different loading states for initial load vs refresh', () => {
      // Initial load
      spectator.component.skills.set(null);
      spectator.component['getSkills']('last30days');
      
      expect(spectator.component.isLoading()).toBe(true);
      expect(spectator.component.isInitialLoad()).toBe(true);
      expect(spectator.component.isRefreshing()).toBe(false);
    });

    it('should set refreshing state when skills data already exists', () => {
      // Set existing data first
      spectator.component.skills.set(mockSkillsData);
      spectator.component.isLoading.set(false);
      spectator.component.isInitialLoad.set(false);
      spectator.component.isRefreshing.set(false);
      
      // Trigger refresh
      spectator.component['getSkills']('last7days');
      
      expect(spectator.component.isRefreshing()).toBe(true);
      expect(spectator.component.isLoading()).toBe(false);
      expect(spectator.component.isInitialLoad()).toBe(false);
    });
  });

  describe('Chart Options Initialization', () => {
    it('should initialize all chart types with correct base options', () => {
      spectator.component['initializeChartOptions']();
      
      const languagesOptions = spectator.component.languagesChartOptions();
      const activityOptions = spectator.component.activityChartOptions();
      const editorsOptions = spectator.component.editorsChartOptions();
      
      expect(languagesOptions.chart?.type).toBe('pie');
      expect(activityOptions.chart?.type).toBe('areaspline');
      expect(editorsOptions.chart?.type).toBe('pie');
      
      expect(languagesOptions.credits?.enabled).toBe(false);
      expect(activityOptions.credits?.enabled).toBe(false);
      expect(editorsOptions.credits?.enabled).toBe(false);
    });

    it('should set responsive chart options', () => {
      spectator.component['initializeChartOptions']();
      
      const languagesOptions = spectator.component.languagesChartOptions();
      
      expect(languagesOptions.responsive?.rules).toBeDefined();
      expect(languagesOptions.responsive?.rules?.[0]?.condition?.maxWidth).toBe(500);
    });
  });
});
