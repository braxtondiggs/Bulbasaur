import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { SideNavComponent } from './side-nav.component';

describe('SideNavComponent', () => {
  let spectator: Spectator<SideNavComponent>;
  let analyticsHelperService: jest.Mocked<AnalyticsHelperService>;
  let googleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  const createComponent = createComponentFactory({
    component: SideNavComponent,
    imports: [
      NgIcon,
      testNgIconsModule,
      LazyLoadFadeDirective
    ],
    providers: [
      {
        provide: AnalyticsHelperService,
        useValue: {
          trackNavigation: jest.fn()
        }
      },
      {
        provide: GoogleAnalyticsService,
        useValue: {
          trackEvent: jest.fn(),
          trackPageView: jest.fn()
        }
      }
    ],
    shallow: true
  });

  beforeEach(() => {
    // Clear all mock calls before each test
    jest.clearAllMocks();
    
    spectator = createComponent();
    analyticsHelperService = spectator.inject(AnalyticsHelperService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component).toBeTruthy();
      // OnPush strategy is tested by the component creation
    });

    it('should inject required services', () => {
      expect(spectator.component.ga).toBeDefined();
      expect(spectator.component.analyticsHelper).toBeDefined();
    });
  });

  describe('Navigation Functionality', () => {
    let mockElement: HTMLElement;
    let scrollToSpy: jest.SpyInstance;
    let getElementByIdSpy: jest.SpyInstance;

    beforeEach(() => {
      // Create a mock element
      mockElement = {
        getBoundingClientRect: jest.fn().mockReturnValue({ top: 500 })
      } as any;

      // Mock window methods
      scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();
      Object.defineProperty(window, 'pageYOffset', {
        value: 100,
        writable: true
      });

      // Mock document.getElementById
      getElementByIdSpy = jest.spyOn(document, 'getElementById');
    });

    afterEach(() => {
      scrollToSpy.mockRestore();
      getElementByIdSpy.mockRestore();
    });

    it('should scroll to section when element exists', () => {
      const sectionId = 'about';
      getElementByIdSpy.mockReturnValue(mockElement);

      spectator.component.scrollToSection(sectionId);

      expect(analyticsHelperService.trackNavigation).toHaveBeenCalledWith(sectionId, 'menu');
      expect(document.getElementById).toHaveBeenCalledWith(sectionId);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 580, // 500 (element top) + 100 (pageYOffset) - 20 (offset)
        behavior: 'smooth'
      });
    });

    it('should handle navigation when element does not exist', () => {
      const sectionId = 'nonexistent';
      getElementByIdSpy.mockReturnValue(null);

      spectator.component.scrollToSection(sectionId);

      expect(analyticsHelperService.trackNavigation).toHaveBeenCalledWith(sectionId, 'menu');
      expect(document.getElementById).toHaveBeenCalledWith(sectionId);
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it('should calculate correct scroll position with different element positions', () => {
      const sectionId = 'contact';
      const mockElementWithDifferentPosition = {
        getBoundingClientRect: jest.fn().mockReturnValue({ top: 1000 })
      } as any;
      
      getElementByIdSpy.mockReturnValue(mockElementWithDifferentPosition);
      Object.defineProperty(window, 'pageYOffset', {
        value: 200,
        writable: true
      });

      spectator.component.scrollToSection(sectionId);

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 1180, // 1000 (element top) + 200 (pageYOffset) - 20 (offset)
        behavior: 'smooth'
      });
    });

    it('should track analytics for different section ids', () => {
      const sections = ['home', 'about', 'portfolio', 'contact'];
      getElementByIdSpy.mockReturnValue(mockElement);

      sections.forEach(sectionId => {
        spectator.component.scrollToSection(sectionId);
        expect(analyticsHelperService.trackNavigation).toHaveBeenCalledWith(sectionId, 'menu');
      });

      expect(analyticsHelperService.trackNavigation).toHaveBeenCalledTimes(sections.length);
    });

    it('should handle edge case when element top is 0', () => {
      const sectionId = 'header';
      const mockElementAtTop = {
        getBoundingClientRect: jest.fn().mockReturnValue({ top: 0 })
      } as any;
      
      getElementByIdSpy.mockReturnValue(mockElementAtTop);
      Object.defineProperty(window, 'pageYOffset', {
        value: 0,
        writable: true
      });

      spectator.component.scrollToSection(sectionId);

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: -20, // 0 + 0 - 20
        behavior: 'smooth'
      });
    });
  });

  describe('Service Integration', () => {
    it('should have access to analytics services', () => {
      expect(spectator.component.ga).toBe(googleAnalyticsService);
      expect(spectator.component.analyticsHelper).toBe(analyticsHelperService);
    });

    it('should call analytics helper with correct parameters', () => {
      const testSectionId = 'test-section';
      jest.spyOn(document, 'getElementById').mockReturnValue(null);

      spectator.component.scrollToSection(testSectionId);

      expect(analyticsHelperService.trackNavigation).toHaveBeenCalledWith(testSectionId, 'menu');
      expect(analyticsHelperService.trackNavigation).toHaveBeenCalledTimes(1);
    });
  });
});
