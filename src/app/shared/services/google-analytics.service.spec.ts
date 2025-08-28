import { Analytics } from '@angular/fire/analytics';
import { NavigationEnd, Router } from '@angular/router';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Subject } from 'rxjs';
import { AnalyticsEvent, GoogleAnalyticsService } from './google-analytics.service';

// Create mock functions
const mockLogEvent = jest.fn().mockResolvedValue(undefined);
const mockSetUserProperties = jest.fn();
const mockSetUserId = jest.fn();
const mockSetCurrentScreen = jest.fn();
const mockSetAnalyticsCollectionEnabled = jest.fn();

// Mock Firebase Analytics
jest.mock('@angular/fire/analytics', () => ({
  logEvent: (...args: any[]) => mockLogEvent(...args),
  setUserProperties: (...args: any[]) => mockSetUserProperties(...args),
  setUserId: (...args: any[]) => mockSetUserId(...args),
  setCurrentScreen: (...args: any[]) => mockSetCurrentScreen(...args),
  setAnalyticsCollectionEnabled: (...args: any[]) => mockSetAnalyticsCollectionEnabled(...args)
}));

describe('GoogleAnalyticsService', () => {
  let spectator: SpectatorService<GoogleAnalyticsService>;
  let mockRouter: { events: Subject<any> };

  const mockAnalytics = {
    app: {
      name: 'test-app',
      options: {},
      automaticDataCollectionEnabled: true
    },
    measurementId: 'test-measurement-id'
  } as unknown as Analytics;

  const createService = createServiceFactory({
    service: GoogleAnalyticsService,
    providers: [
      { provide: Analytics, useValue: mockAnalytics },
      {
        provide: Router,
        useFactory: () => {
          mockRouter = { events: new Subject() };
          return mockRouter;
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createService();

    // Clear all mocks
    jest.clearAllMocks();

    // Reset mock implementations
    mockLogEvent.mockResolvedValue(undefined);

    // Clear localStorage
    localStorage.clear();

    // Set consent to true for tests
    localStorage.setItem('analytics_consent', 'true');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('trackEvent', () => {
    it('should track event with all parameters', () => {
      const event: AnalyticsEvent = {
        action: 'test_action',
        category: 'test_category',
        label: 'test_label',
        value: 42,
        custom_parameters: {
          custom_param: 'custom_value'
        }
      };

      spectator.service.trackEvent(event);

      expect(mockLogEvent).toHaveBeenCalledWith(mockAnalytics, 'test_action', {
        event_category: 'test_category',
        event_label: 'test_label',
        value: 42,
        custom_param: 'custom_value'
      });
    });

    it('should track event with minimal parameters', () => {
      const event: AnalyticsEvent = {
        action: 'minimal_action',
        category: 'minimal_category'
      };

      spectator.service.trackEvent(event);

      expect(mockLogEvent).toHaveBeenCalledWith(mockAnalytics, 'minimal_action', {
        event_category: 'minimal_category'
      });
    });

    it('should not track when analytics is disabled', () => {
      spectator.service.setAnalyticsEnabled(false);

      const event: AnalyticsEvent = {
        action: 'test_action',
        category: 'test_category'
      };

      spectator.service.trackEvent(event);

      expect(mockLogEvent).not.toHaveBeenCalled();
    });
  });

  describe('legacy eventEmitter method', () => {
    it('should call logEvent with correct parameters', () => {
      spectator.service.eventEmitter('test_category', 'test_action');

      expect(mockLogEvent).toHaveBeenCalledWith(mockAnalytics, 'test_action', {
        event_category: 'test_category'
      });
    });

    it('should call logEvent with optional label and value', () => {
      spectator.service.eventEmitter('test_category', 'test_action', 'test_label', 42);

      expect(mockLogEvent).toHaveBeenCalledWith(mockAnalytics, 'test_action', {
        event_category: 'test_category',
        event_label: 'test_label',
        value: 42
      });
    });

    it('should handle missing optional parameters', () => {
      spectator.service.eventEmitter('category', 'action', null, null);

      expect(mockLogEvent).toHaveBeenCalledWith(mockAnalytics, 'action', {
        event_category: 'category'
      });
    });
  });

  describe('trackPageView', () => {
    it('should track page view with default parameters', () => {
      spectator.service.trackPageView();

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'page_view',
        expect.objectContaining({
          page_title: document.title,
          page_location: window.location.href
        })
      );
    });

    it('should track page view with custom parameters', () => {
      spectator.service.trackPageView({
        page_title: 'Custom Title',
        content_group1: 'Portfolio'
      });

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'page_view',
        expect.objectContaining({
          page_title: 'Custom Title',
          content_group1: 'Portfolio'
        })
      );
    });
  });

  describe('specialized tracking methods', () => {
    it('should track user interaction', () => {
      spectator.service.trackUserInteraction('click', 'button', 1);

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'user_interaction',
        expect.objectContaining({
          event_category: 'engagement',
          event_label: 'click_button',
          value: 1
        })
      );
    });

    it('should track timing events', () => {
      spectator.service.trackTiming({
        name: 'page_load',
        value: 1500,
        category: 'performance'
      });

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'timing_complete',
        expect.objectContaining({
          event_category: 'performance',
          event_label: 'page_load',
          value: 1500
        })
      );
    });

    it('should track errors', () => {
      spectator.service.trackError('API call failed', true);

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'exception',
        expect.objectContaining({
          event_category: 'errors',
          event_label: 'API call failed',
          fatal: true
        })
      );
    });

    it('should track social interactions', () => {
      spectator.service.trackSocialInteraction('share', 'twitter', 'portfolio');

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'social_interaction',
        expect.objectContaining({
          event_category: 'social',
          event_label: 'twitter_share'
        })
      );
    });

    it('should track downloads', () => {
      spectator.service.trackDownload('resume.pdf', 'pdf');

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'file_download',
        expect.objectContaining({
          event_category: 'downloads',
          event_label: 'resume.pdf'
        })
      );
    });

    it('should track external links', () => {
      spectator.service.trackExternalLink('https://github.com', 'GitHub Profile');

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'click',
        expect.objectContaining({
          event_category: 'external_links',
          event_label: 'https://github.com'
        })
      );
    });

    it('should track form interactions', () => {
      spectator.service.trackFormInteraction('contact', 'submit');

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'form_submit',
        expect.objectContaining({
          event_category: 'forms',
          event_label: 'contact'
        })
      );
    });

    it('should track search queries', () => {
      spectator.service.trackSearch('angular tutorials', 5);

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'search',
        expect.objectContaining({
          event_category: 'site_search',
          event_label: 'angular tutorials',
          value: 5
        })
      );
    });

    it('should track video interactions', () => {
      spectator.service.trackVideo('play', 'Demo Video');

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'video_play',
        expect.objectContaining({
          event_category: 'video',
          event_label: 'Demo Video'
        })
      );
    });
  });

  describe('user properties and identification', () => {
    it('should set user properties', () => {
      const properties = {
        user_type: 'returning' as const,
        preferred_theme: 'dark' as const
      };

      spectator.service.setUserProperties(properties);

      expect(mockSetUserProperties).toHaveBeenCalledWith(mockAnalytics, properties);
    });

    it('should set user ID', () => {
      spectator.service.setUserId('user123');

      expect(mockSetUserId).toHaveBeenCalledWith(mockAnalytics, 'user123');
    });
  });

  describe('consent management', () => {
    it('should enable analytics when consent is given', () => {
      spectator.service.setAnalyticsConsent(true);

      expect(localStorage.getItem('analytics_consent')).toBe('true');
      expect(mockSetAnalyticsCollectionEnabled).toHaveBeenCalledWith(mockAnalytics, true);
    });

    it('should disable analytics when consent is revoked', () => {
      spectator.service.setAnalyticsConsent(false);

      expect(localStorage.getItem('analytics_consent')).toBe('false');
      expect(mockSetAnalyticsCollectionEnabled).toHaveBeenCalledWith(mockAnalytics, false);
    });

    it('should return analytics enabled status', () => {
      expect(spectator.service.isAnalyticsEnabled()).toBe(true);

      spectator.service.setAnalyticsEnabled(false);
      expect(spectator.service.isAnalyticsEnabled()).toBe(false);
    });
  });

  describe('automatic page tracking', () => {
    it('should track page views on navigation', () => {
      const navigationEvent = new NavigationEnd(1, '/test', '/test');

      mockRouter.events.next(navigationEvent);

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'page_view',
        expect.objectContaining({
          page_location: window.location.href,
          page_title: document.title
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle logEvent errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLogEvent.mockRejectedValueOnce(new Error('Analytics error'));

      expect(() => {
        spectator.service.trackEvent({
          action: 'error_action',
          category: 'error_category'
        });
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
