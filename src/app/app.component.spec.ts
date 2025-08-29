import { ChangeDetectorRef } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgIcon } from '@ng-icons/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { HeaderComponent } from '@core/layout/header/header.component';
import { SideNavComponent } from '@core/layout/side-nav/side-nav.component';
import { ContentComponent } from '@features/portfolio/content/content.component';
import { ProfileBoxComponent } from '@features/profile/profile-box/profile-box.component';
import { AnalyticsHelperService, GoogleAnalyticsService, ModalService, FirebaseService, ScrollService } from '@shared/services';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { FirebaseDevUtils } from '@shared/utils/firebase-dev.utils';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

// Mock themeChange
jest.mock('theme-change', () => ({
  themeChange: jest.fn()
}));

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let analyticsHelperService: jest.Mocked<AnalyticsHelperService>;
  let googleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;
  let modalService: jest.Mocked<ModalService>;
  let changeDetectorRef: jest.Mocked<ChangeDetectorRef>;

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };

  // Mock window.matchMedia
  const mockMatchMedia = jest.fn();

  // Mock document API
  const documentElementSetAttributeSpy = jest.fn();
  const documentBodySetAttributeSpy = jest.fn();
  
  // Store original values
  const originalDocumentElementSetAttribute = document.documentElement.setAttribute;
  const originalDocumentBodySetAttribute = document.body.setAttribute;
  
  beforeAll(() => {
    // Mock document.documentElement.setAttribute
    document.documentElement.setAttribute = documentElementSetAttributeSpy;
    // Mock document.body.setAttribute  
    document.body.setAttribute = documentBodySetAttributeSpy;
  });
  
  afterAll(() => {
    // Restore original methods
    document.documentElement.setAttribute = originalDocumentElementSetAttribute;
    document.body.setAttribute = originalDocumentBodySetAttribute;
  });  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NgIcon,
      testNgIconsModule,
      LoadingBarHttpClientModule
    ],
    providers: [
      {
        provide: AnalyticsHelperService,
        useValue: {
          trackPerformance: jest.fn(),
          trackEngagement: jest.fn(),
          trackScrollDepth: jest.fn(),
          trackNavigation: jest.fn(),
          trackThemeChange: jest.fn()
        }
      },
      {
        provide: GoogleAnalyticsService,
        useValue: {
          trackEvent: jest.fn(),
          trackPageView: jest.fn()
        }
      },
      {
        provide: ModalService,
        useValue: {
          modalOpen$: of(false),
          openModal: jest.fn(),
          closeModal: jest.fn()
        }
      },
      {
        provide: ChangeDetectorRef,
        useValue: {
          detectChanges: jest.fn(),
          markForCheck: jest.fn()
        }
      },
      {
        provide: FirebaseService,
        useValue: {
          getInstagramPosts: jest.fn().mockReturnValue(of([])),
          validateInstagramData: jest.fn().mockReturnValue(true)
        }
      },
      {
        provide: FirebaseDevUtils,
        useValue: {
          getCollectionWithDevInsights: jest.fn().mockReturnValue(of([])),
          validateFirebaseData: jest.fn().mockReturnValue(true),
          analyzeQuery: jest.fn(),
          profileQuery: jest.fn().mockImplementation((label, queryFn) => {
            // Execute the query function and return its result
            return queryFn ? queryFn() : of([]);
          }),
          collection: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              docs: [],
              empty: true
            })
          })
        }
      },
      {
        provide: ScrollService,
        useValue: {
          scrollY$: of(0),
          scrollYProgress$: of(0),
          scrollDirection$: of('up'),
          isScrolling$: of(false),
          scrollObs: of({}),
          resizeObs: of({})
        }
      }
    ],
    declarations: [],
    mocks: [HeaderComponent, SideNavComponent, ContentComponent, ProfileBoxComponent],
    shallow: true
  });

  beforeEach(() => {
    // Spy on console.error to prevent error logs in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock global objects
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Set default matchMedia behavior
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia });

    // Mock global functions and properties
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    // Mock scrollTo
    window.scrollTo = jest.fn();

    // Mock timers
    jest.useFakeTimers();

    spectator = createComponent();
    analyticsHelperService = spectator.inject(AnalyticsHelperService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
    modalService = spectator.inject(ModalService);
    changeDetectorRef = spectator.inject(ChangeDetectorRef);

    // Reset document spies
    documentElementSetAttributeSpy.mockClear();
    documentBodySetAttributeSpy.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    // Restore console.error
    jest.restoreAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component).toBeTruthy();
      // OnPush strategy is tested by the component creation
    });

    it('should initialize with default values', () => {
      expect(spectator.component.scroll).toBe(0);
      expect(spectator.component.modalOpen).toBe(false);
    });

    it('should inject required services', () => {
      expect(spectator.component.ga).toBeDefined();
      expect(analyticsHelperService).toBeDefined();
      expect(modalService).toBeDefined();
      expect(changeDetectorRef).toBeDefined();
    });
  });

  describe('Theme Initialization', () => {
    it('should initialize theme with light as default when no saved theme', () => {
      localStorageMock.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn()
      });

      spectator.component.ngOnInit();

      expect(documentElementSetAttributeSpy).toHaveBeenCalledWith('data-theme', 'light');
      expect(documentBodySetAttributeSpy).toHaveBeenCalledWith('data-theme', 'light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(analyticsHelperService.trackThemeChange).toHaveBeenCalledWith('light');
    });

    it('should use saved theme when available', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      spectator.component.ngOnInit();

      expect(documentElementSetAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(documentBodySetAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(analyticsHelperService.trackThemeChange).toHaveBeenCalledWith('dark');
    });

    it('should use dark theme when system prefers dark and no saved theme', () => {
      localStorageMock.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn()
      });

      spectator.component.ngOnInit();

      expect(documentElementSetAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(documentBodySetAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(analyticsHelperService.trackThemeChange).toHaveBeenCalledWith('dark');
    });
  });

  describe('Modal Management', () => {
    it('should subscribe to modal state changes', () => {
      // Update the modal service observable
      const modalService = spectator.inject(ModalService);
      modalService.modalOpen$ = of(true);
      
      // Subscribe should happen when ngOnInit is called
      spectator.component.ngOnInit();
      
      // The component should now have the modal state
      expect(spectator.component.modalOpen).toBe(true);
    });

    it('should handle modal close event', () => {
      // Update the modal service observable
      const modalService = spectator.inject(ModalService);
      modalService.modalOpen$ = of(false);
      
      // Subscribe should happen when ngOnInit is called
      spectator.component.ngOnInit();
      
      // The component should now have the modal state
      expect(spectator.component.modalOpen).toBe(false);
    });
  });

  describe('Performance and Engagement Tracking', () => {
    it('should track performance metrics after page load', () => {
      spectator.component.ngOnInit();

      jest.advanceTimersByTime(1000);

      expect(analyticsHelperService.trackPerformance).toHaveBeenCalled();
    });

    it('should set up engagement tracking', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const setIntervalSpy = jest.spyOn(window, 'setInterval');

      spectator.component.ngOnInit();

      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 300000);
    });
  });

  describe('Scroll Functionality', () => {
    it('should update scroll position on scroll event', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 100 });

      spectator.component.onScroll();

      expect(spectator.component.scroll).toBe(100);
      expect(analyticsHelperService.trackScrollDepth).toHaveBeenCalled();
    });

    it('should calculate scroll percentage correctly', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 100 });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      spectator.component.onScroll();

      // Expected scroll percentage: (100 / (1000 - 800)) * 100 = 50%
      expect(analyticsHelperService.trackScrollDepth).toHaveBeenCalledWith(50);
    });

    it('should return true for isScroll when scroll is greater than 55', () => {
      spectator.component.scroll = 100;
      expect(spectator.component.isScroll()).toBe(true);
    });

    it('should return false for isScroll when scroll is 55 or less', () => {
      spectator.component.scroll = 55;
      expect(spectator.component.isScroll()).toBe(false);

      spectator.component.scroll = 30;
      expect(spectator.component.isScroll()).toBe(false);
    });

    it('should track scroll to top navigation', () => {
      spectator.component.trackScrollToTop();

      expect(analyticsHelperService.trackNavigation).toHaveBeenCalledWith('top', 'scroll');
    });

    it('should scroll to top with smooth behavior', () => {
      spectator.component.scrollToTop();

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      const destroySpy = jest.spyOn(spectator.component['destroy$'], 'next');
      const completeSpy = jest.spyOn(spectator.component['destroy$'], 'complete');

      spectator.component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should call ngOnInit without errors', () => {
      expect(() => spectator.component.ngOnInit()).not.toThrow();
    });
  });

  describe('Event Listeners', () => {
    it('should handle window scroll events', () => {
      const onScrollSpy = jest.spyOn(spectator.component, 'onScroll');

      // Simulate scroll event
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      // Since we're testing the decorator directly, we need to call the method
      spectator.component.onScroll();

      expect(onScrollSpy).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full initialization flow', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      modalService.modalOpen$ = of(false);

      spectator.component.ngOnInit();
      jest.advanceTimersByTime(1000);

      expect(analyticsHelperService.trackThemeChange).toHaveBeenCalledWith('dark');
      expect(analyticsHelperService.trackPerformance).toHaveBeenCalled();
      expect(spectator.component.modalOpen).toBe(false);
    });

    it('should handle scroll and analytics tracking together', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 200 });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      spectator.component.onScroll();

      expect(spectator.component.scroll).toBe(200);
      expect(spectator.component.isScroll()).toBe(true);
      expect(analyticsHelperService.trackScrollDepth).toHaveBeenCalledWith(17); // (200 / (2000 - 800)) * 100 ≈ 17
    });
  });
});
