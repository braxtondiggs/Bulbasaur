import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Analytics } from '@angular/fire/analytics';
import { BehaviorSubject } from 'rxjs';
import {
  AnalyticsEvent,
  GoogleAnalyticsService,
  PageViewEvent,
  TimingEvent,
  UserProperties
} from './google-analytics.service';

// Mock angular/fire/analytics module completely
jest.mock('@angular/fire/analytics', () => ({
  Analytics: jest.fn().mockImplementation(() => ({})),
  isSupported: jest.fn(() => Promise.resolve(true)),
  logEvent: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  setCurrentScreen: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn()
}));

// Mock Angular's isDevMode
jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  isDevMode: jest.fn(() => false)
}));

// Mock isPlatformBrowser
jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(() => true)
}));

describe('GoogleAnalyticsService - Basic Tests', () => {
  let service: GoogleAnalyticsService;
  let mockAnalytics: any;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(() => 'true'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create mock Analytics instance
    mockAnalytics = {};

    TestBed.configureTestingModule({
      providers: [
        GoogleAnalyticsService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Analytics, useValue: mockAnalytics },
        {
          provide: Router,
          useValue: {
            events: new BehaviorSubject<any>({ url: '/test' })
          }
        }
      ]
    });

    service = TestBed.inject(GoogleAnalyticsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Service Creation', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should have core methods available', () => {
      expect(typeof service.trackEvent).toBe('function');
      expect(typeof service.trackPageView).toBe('function');
      expect(typeof service.setAnalyticsEnabled).toBe('function');
      expect(typeof service.isAnalyticsEnabled).toBe('function');
      expect(typeof service.setUserId).toBe('function');
      expect(typeof service.setUserProperties).toBe('function');
    });
  });

  describe('Basic Method Calls', () => {
    it('should handle trackEvent without throwing', () => {
      const event: AnalyticsEvent = {
        action: 'test_action',
        category: 'test_category'
      };

      expect(() => {
        service.trackEvent(event);
      }).not.toThrow();
    });

    it('should handle setAnalyticsEnabled', () => {
      expect(() => {
        service.setAnalyticsEnabled(true);
        service.setAnalyticsEnabled(false);
      }).not.toThrow();

      expect(typeof service.isAnalyticsEnabled()).toBe('boolean');
    });

    it('should handle user management methods', () => {
      expect(() => {
        service.setUserId('test123');
        service.setUserProperties({ user_type: 'new' });
      }).not.toThrow();
    });

    it('should handle all tracking methods without throwing', () => {
      expect(() => {
        service.trackPageView({ page_title: 'Test' });
        service.trackUserInteraction('click', 'button');
        service.trackTiming({ name: 'test', value: 100 });
        service.trackError('test error');
        service.trackSocialInteraction('share', 'facebook');
        service.trackDownload('file.pdf');
        service.trackExternalLink('https://example.com');
        service.trackSearch('query');
        service.trackEngagement('scroll', 'page');
        service.trackPerformance('metric', 100);
        service.eventEmitter('category', 'action');
      }).not.toThrow();
    });
  });

  describe('Interface Types', () => {
    it('should validate AnalyticsEvent interface', () => {
      const event: AnalyticsEvent = {
        action: 'click',
        category: 'button',
        label: 'submit',
        value: 1,
        custom_parameters: {
          test: 'value'
        }
      };

      expect(event.action).toBe('click');
      expect(event.category).toBe('button');
      expect(event.custom_parameters?.test).toBe('value');
    });

    it('should validate PageViewEvent interface', () => {
      const pageView: PageViewEvent = {
        page_title: 'Home',
        page_location: 'https://example.com',
        page_path: '/',
        session_id: '123',
        timestamp: Date.now()
      };

      expect(pageView.page_title).toBe('Home');
      expect(typeof pageView.timestamp).toBe('number');
    });

    it('should validate TimingEvent interface', () => {
      const timing: TimingEvent = {
        name: 'load_time',
        value: 1000,
        category: 'performance',
        label: 'initial'
      };

      expect(timing.name).toBe('load_time');
      expect(timing.value).toBe(1000);
    });

    it('should validate UserProperties interface', () => {
      const props: UserProperties = {
        user_type: 'returning',
        device_type: 'desktop',
        preferred_theme: 'dark',
        user_engagement_duration: 5000
      };

      expect(props.user_type).toBe('returning');
      expect(props.device_type).toBe('desktop');
    });
  });

  describe('Consent Management', () => {
    it('should handle setAnalyticsConsent', () => {
      expect(() => {
        service.setAnalyticsConsent(true);
        service.setAnalyticsConsent(false);
      }).not.toThrow();

      expect(localStorage.setItem).toHaveBeenCalledWith('analytics_consent', 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith('analytics_consent', 'false');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty or invalid inputs gracefully', () => {
      expect(() => {
        service.trackEvent({ action: '', category: '' });
        service.setUserId('');
        service.trackPageView({});
        service.trackTiming({ name: '', value: 0 });
      }).not.toThrow();
    });

    it('should handle disabled analytics', () => {
      service.setAnalyticsEnabled(false);
      
      expect(() => {
        service.trackEvent({ action: 'test', category: 'test' });
        service.trackPageView();
      }).not.toThrow();
    });
  });
});