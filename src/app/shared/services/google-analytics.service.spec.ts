import { TestBed } from '@angular/core/testing';
import { GoogleAnalyticsService } from './google-analytics.service';
import { Analytics } from '@angular/fire/analytics';

// Mock the logEvent function globally
jest.mock('@angular/fire/analytics', () => ({
  logEvent: jest.fn().mockImplementation(() => {
    // Mock implementation that doesn't throw
    return Promise.resolve();
  })
}));

// Import the mocked logEvent
import { logEvent } from '@angular/fire/analytics';

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;
  let mockAnalytics: any;

  beforeEach(() => {
    // Create a proper mock Analytics object
    mockAnalytics = {
      app: {},
      measurementId: 'test-measurement-id'
    };
    
    TestBed.configureTestingModule({
      providers: [
        GoogleAnalyticsService,
        { provide: Analytics, useValue: mockAnalytics }
      ]
    });
    
    service = TestBed.inject(GoogleAnalyticsService);
    (logEvent as jest.Mock).mockClear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should send a gtag event', () => {
    service.eventEmitter('event_category', 'event_action');
    
    expect(logEvent).toHaveBeenCalledWith(
      mockAnalytics,
      'event_action',
      {
        event_category: 'event_category',
        event_label: null,
        value: null
      }
    );
  });
});
