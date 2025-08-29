import { TestBed } from '@angular/core/testing';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;
  let mockWindow: any;
  
  beforeEach(() => {
    // Mock window object
    mockWindow = {
      pageYOffset: 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };
    
    // Mock global window
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true
    });
    
    TestBed.configureTestingModule({
      providers: [ScrollService]
    });
    
    service = TestBed.inject(ScrollService);
  });

  afterEach(() => {
    service?.ngOnDestroy();
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should create', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with scroll position 0', () => {
      expect(service.pos).toBe(0);
    });

    it('should create scroll observable', () => {
      expect(service.scrollObs).toBeDefined();
      expect(service.scrollObs.subscribe).toBeDefined();
    });

    it('should create resize observable', () => {
      expect(service.resizeObs).toBeDefined();
      expect(service.resizeObs.subscribe).toBeDefined();
    });
  });

  describe('Scroll Position Management', () => {
    it('should update position when window scrolls', () => {
      // Simulate scroll
      Object.defineProperty(window, 'pageYOffset', {
        value: 100,
        writable: true
      });

      // Trigger scroll event
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      // Service should update position
      expect(service.pos).toBe(100);
    });

    it('should handle multiple scroll events', () => {
      const positions = [50, 100, 200, 300];
      
      positions.forEach(position => {
        Object.defineProperty(window, 'pageYOffset', {
          value: position,
          writable: true
        });
        
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
        
        expect(service.pos).toBe(position);
      });
    });

    it('should update position on window resize', () => {
      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true
      });

      // Trigger resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      expect(service.pos).toBe(150);
    });
  });

  describe('Observable Subscriptions', () => {
    it('should emit scroll events through scrollObs', (done) => {
      service.scrollObs.subscribe(() => {
        expect(true).toBe(true); // Event was emitted
        done();
      });

      // Trigger scroll event
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);
    });

    it('should emit resize events through resizeObs', (done) => {
      service.resizeObs.subscribe(() => {
        expect(true).toBe(true); // Event was emitted
        done();
      });

      // Trigger resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    });

    it('should handle multiple subscribers to scroll observable', () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      service.scrollObs.subscribe(subscriber1);
      service.scrollObs.subscribe(subscriber2);

      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      expect(subscriber1).toHaveBeenCalled();
      expect(subscriber2).toHaveBeenCalled();
    });
  });

  describe('Memory Management', () => {
    it('should clean up subscriptions on destroy', () => {
      const ngUnsubscribeSpy = jest.spyOn(service['ngUnsubscribe'], 'next');
      const completeSpy = jest.spyOn(service['ngUnsubscribe'], 'complete');

      service.ngOnDestroy();

      expect(ngUnsubscribeSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should stop updating position after destroy', () => {
      service.ngOnDestroy();
      
      const initialPos = service.pos;
      
      Object.defineProperty(window, 'pageYOffset', {
        value: 999,
        writable: true
      });

      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      // Position should not update after destroy
      expect(service.pos).toBe(initialPos);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative scroll positions', () => {
      Object.defineProperty(window, 'pageYOffset', {
        value: -10,
        writable: true
      });

      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      expect(service.pos).toBe(-10);
    });

    it('should handle very large scroll positions', () => {
      const largePosition = 999999;
      Object.defineProperty(window, 'pageYOffset', {
        value: largePosition,
        writable: true
      });

      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);

      expect(service.pos).toBe(largePosition);
    });

    it('should handle rapid scroll events', () => {
      const positions = [10, 20, 30, 40, 50];
      
      positions.forEach((position, index) => {
        Object.defineProperty(window, 'pageYOffset', {
          value: position,
          writable: true
        });
        
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
      });

      expect(service.pos).toBe(50); // Should have the last position
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly with real scroll simulation', (done) => {
      let eventCount = 0;
      
      service.scrollObs.subscribe(() => {
        eventCount++;
        if (eventCount === 3) {
          expect(service.pos).toBe(300);
          done();
        }
      });

      // Simulate multiple scroll events
      [100, 200, 300].forEach(position => {
        Object.defineProperty(window, 'pageYOffset', {
          value: position,
          writable: true
        });
        
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
      });
    });

    it('should handle combined scroll and resize events', () => {
      const events: string[] = [];
      
      service.scrollObs.subscribe(() => events.push('scroll'));
      service.resizeObs.subscribe(() => events.push('resize'));

      // Trigger both events
      const scrollEvent = new Event('scroll');
      const resizeEvent = new Event('resize');
      
      window.dispatchEvent(scrollEvent);
      window.dispatchEvent(resizeEvent);

      expect(events).toContain('scroll');
      expect(events).toContain('resize');
      expect(events.length).toBe(2);
    });
  });
});
