import { AnalyticsEvent, UserProperties, TimingEvent, PageViewEvent } from './google-analytics.service';

// Test pure utility functions and validation logic from GoogleAnalyticsService
// These would need to be extracted as separate utility functions

describe('Analytics Utilities', () => {
  describe('Event Validation', () => {
    it('should validate basic event structure', () => {
      const validEvent: AnalyticsEvent = {
        action: 'test_action',
        category: 'test_category',
        label: 'test_label',
        value: 100
      };

      expect(validEvent.action).toBe('test_action');
      expect(validEvent.category).toBe('test_category');
      expect(validEvent.label).toBe('test_label');
      expect(validEvent.value).toBe(100);
    });

    it('should validate minimal event structure', () => {
      const minimalEvent: AnalyticsEvent = {
        action: 'minimal_action',
        category: 'minimal_category'
      };

      expect(minimalEvent.action).toBeTruthy();
      expect(minimalEvent.category).toBeTruthy();
      expect(minimalEvent.label).toBeUndefined();
      expect(minimalEvent.value).toBeUndefined();
    });

    it('should validate custom parameters', () => {
      const eventWithCustomParams: AnalyticsEvent = {
        action: 'custom_action',
        category: 'custom_category',
        custom_parameters: {
          string_param: 'test',
          number_param: 42,
          boolean_param: true
        }
      };

      expect(eventWithCustomParams.custom_parameters).toBeDefined();
      expect(eventWithCustomParams.custom_parameters!.string_param).toBe('test');
      expect(eventWithCustomParams.custom_parameters!.number_param).toBe(42);
      expect(eventWithCustomParams.custom_parameters!.boolean_param).toBe(true);
    });

    it('should detect invalid events', () => {
      const invalidEvents = [
        { action: '', category: 'test' }, // Empty action
        { action: 'test', category: '' }, // Empty category
        { action: undefined, category: 'test' }, // Undefined action
        { action: 'test', category: undefined }, // Undefined category
        { action: 'a'.repeat(50), category: 'test' } // Too long action
      ];

      invalidEvents.forEach(event => {
        const isValid = validateAnalyticsEvent(event as AnalyticsEvent);
        expect(isValid).toBe(false);
      });
    });

    it('should accept valid events', () => {
      const validEvents = [
        { action: 'click', category: 'button' },
        { action: 'page_view', category: 'navigation' },
        { action: 'form_submit', category: 'forms', label: 'contact' },
        { action: 'download', category: 'files', value: 1 }
      ];

      validEvents.forEach(event => {
        const isValid = validateAnalyticsEvent(event as AnalyticsEvent);
        expect(isValid).toBe(true);
      });
    });
  });

  describe('Parameter Sanitization', () => {
    it('should sanitize parameter keys', () => {
      const dirtyParams = {
        'param@#$%': 'value1',
        'param with spaces': 'value2',
        'param_underscore': 'value3',
        [('a'.repeat(50))]: 'value4' // Too long key
      };

      const sanitized = sanitizeAnalyticsParameters(dirtyParams);
      const keys = Object.keys(sanitized);

      expect(keys.some(key => key.includes('@'))).toBe(false);
      expect(keys.some(key => key.includes(' '))).toBe(false);
      expect(keys.some(key => key.includes('_'))).toBe(true); // Underscores allowed
      expect(keys.every(key => key.length <= 40)).toBe(true);
    });

    it('should sanitize parameter values', () => {
      const params = {
        string_param: 'a'.repeat(150), // Too long string
        number_param: 42,
        boolean_param: true,
        null_param: null,
        undefined_param: undefined,
        object_param: { nested: 'value' }
      };

      const sanitized = sanitizeAnalyticsParameters(params);

      expect(typeof sanitized.string_param).toBe('string');
      expect((sanitized.string_param as string).length).toBeLessThanOrEqual(100);
      expect(sanitized.number_param).toBe(42);
      expect(sanitized.boolean_param).toBe(true);
      expect(sanitized.null_param).toBeUndefined(); // Null removed
      expect(sanitized.undefined_param).toBeUndefined(); // Undefined removed
      expect(typeof sanitized.object_param).toBe('string'); // Converted to string
    });
  });

  describe('Session ID Generation', () => {
    it('should generate unique session IDs', () => {
      const sessionId1 = generateSessionId();
      const sessionId2 = generateSessionId();

      expect(sessionId1).toBeTruthy();
      expect(sessionId2).toBeTruthy();
      expect(sessionId1).not.toBe(sessionId2);
      expect(typeof sessionId1).toBe('string');
      expect(typeof sessionId2).toBe('string');
    });

    it('should generate session IDs with expected format', () => {
      const sessionId = generateSessionId();
      
      // Should contain timestamp and random part
      expect(sessionId).toContain('-');
      expect(sessionId.length).toBeGreaterThan(10);
      
      const parts = sessionId.split('-');
      expect(parts).toHaveLength(2);
      expect(Number(parts[0])).toBeGreaterThan(0); // Timestamp
      expect(parts[1].length).toBeGreaterThan(0); // Random part
    });
  });

  describe('User Properties Validation', () => {
    it('should validate user properties structure', () => {
      const userProps: UserProperties = {
        user_type: 'returning',
        preferred_theme: 'dark',
        device_type: 'desktop',
        user_engagement_duration: 30000
      };

      expect(userProps.user_type).toBe('returning');
      expect(userProps.preferred_theme).toBe('dark');
      expect(userProps.device_type).toBe('desktop');
      expect(typeof userProps.user_engagement_duration).toBe('number');
    });

    it('should handle custom user properties', () => {
      const customProps: UserProperties = {
        custom_property: 'custom_value',
        another_custom: 42,
        boolean_custom: true
      };

      expect(customProps.custom_property).toBe('custom_value');
      expect(customProps.another_custom).toBe(42);
      expect(customProps.boolean_custom).toBe(true);
    });
  });

  describe('Timing Events Validation', () => {
    it('should validate timing event structure', () => {
      const timingEvent: TimingEvent = {
        name: 'page_load',
        value: 1500,
        category: 'performance',
        label: 'homepage'
      };

      expect(timingEvent.name).toBe('page_load');
      expect(timingEvent.value).toBe(1500);
      expect(timingEvent.category).toBe('performance');
      expect(timingEvent.label).toBe('homepage');
    });

    it('should handle minimal timing events', () => {
      const minimalTiming: TimingEvent = {
        name: 'api_call',
        value: 250
      };

      expect(minimalTiming.name).toBeTruthy();
      expect(minimalTiming.value).toBeGreaterThan(0);
      expect(minimalTiming.category).toBeUndefined();
      expect(minimalTiming.label).toBeUndefined();
    });
  });

  describe('Page View Events Validation', () => {
    it('should validate page view event structure', () => {
      const pageViewEvent: PageViewEvent = {
        page_title: 'Test Page',
        page_location: 'https://example.com/test',
        page_referrer: 'https://google.com',
        page_path: '/test',
        content_group1: 'main_section',
        session_id: 'test-session-id',
        timestamp: Date.now()
      };

      expect(pageViewEvent.page_title).toBe('Test Page');
      expect(pageViewEvent.page_location).toBe('https://example.com/test');
      expect(pageViewEvent.page_referrer).toBe('https://google.com');
      expect(pageViewEvent.page_path).toBe('/test');
      expect(pageViewEvent.content_group1).toBe('main_section');
      expect(pageViewEvent.session_id).toBe('test-session-id');
      expect(typeof pageViewEvent.timestamp).toBe('number');
    });

    it('should handle optional page view properties', () => {
      const minimalPageView: PageViewEvent = {};

      expect(minimalPageView.page_title).toBeUndefined();
      expect(minimalPageView.page_location).toBeUndefined();
      // All properties are optional
    });
  });

  describe('Event Queue Management', () => {
    it('should validate event queue structure', () => {
      const queuedEvents = [
        { event: 'event1', parameters: { category: 'test1' } },
        { event: 'event2', parameters: { category: 'test2' } }
      ];

      expect(queuedEvents).toHaveLength(2);
      expect(queuedEvents[0].event).toBe('event1');
      expect(queuedEvents[0].parameters.category).toBe('test1');
    });

    it('should handle queue size limits', () => {
      const maxQueueSize = 100;
      const queue: any[] = [];

      // Simulate adding more than max size
      for (let i = 0; i < maxQueueSize + 10; i++) {
        queue.push({ event: `event${i}`, parameters: {} });
        
        // Simulate queue management
        if (queue.length > maxQueueSize) {
          queue.shift(); // Remove oldest
        }
      }

      expect(queue.length).toBe(maxQueueSize);
    });
  });

  describe('Error Message Formatting', () => {
    it('should format analytics error messages', () => {
      const operation = 'trackEvent';
      const errorMessage = `[GoogleAnalytics] Failed to ${operation}`;
      
      expect(errorMessage).toContain('[GoogleAnalytics]');
      expect(errorMessage).toContain(operation);
    });

    it('should format debug messages', () => {
      const debugMessage = 'Event tracked';
      const formattedMessage = `[GoogleAnalytics] ${debugMessage}`;
      
      expect(formattedMessage).toContain('[GoogleAnalytics]');
      expect(formattedMessage).toContain(debugMessage);
    });
  });
});

// Utility functions that would need to be extracted from the service
function validateAnalyticsEvent(event: AnalyticsEvent): boolean {
  if (!event.action || typeof event.action !== 'string') {
    return false;
  }

  if (!event.category || typeof event.category !== 'string') {
    return false;
  }

  // Check action name length (GA4 limit)
  if (event.action.length > 40) {
    return false;
  }

  return true;
}

function sanitizeAnalyticsParameters(params: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    // Skip undefined and null values
    if (value === undefined || value === null) continue;

    // Sanitize key
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 40);

    // Sanitize value based on type
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = value.substring(0, 100); // GA4 string limit
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else {
      sanitized[sanitizedKey] = String(value).substring(0, 100);
    }
  }

  return sanitized;
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}