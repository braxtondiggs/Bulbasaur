import { Component } from '@angular/core';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator/jest';
import { LazyBackgroundFadeDirective } from './lazy-background-fade.directive';

describe('LazyBackgroundFadeDirective', () => {
  let spectator: SpectatorDirective<LazyBackgroundFadeDirective>;
  let mockIntersectionObserver: jest.Mock;
  let mockObserverInstance: {
    observe: jest.Mock;
    unobserve: jest.Mock;
    disconnect: jest.Mock;
  };
  let mockImage: {
    onload: (() => void) | null;
    onerror: (() => void) | null;
    src: string;
  };

  const createDirective = createDirectiveFactory({
    directive: LazyBackgroundFadeDirective
  });

  beforeEach(() => {
    // Mock IntersectionObserver
    mockObserverInstance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };

    mockIntersectionObserver = jest.fn().mockImplementation(() => mockObserverInstance);
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: mockIntersectionObserver
    });

    // Mock Image constructor
    mockImage = {
      onload: null,
      onerror: null,
      src: ''
    };

    Object.defineProperty(window, 'Image', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation(() => mockImage)
    });

    // Mock setTimeout
    jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      callback();
      return 0 as any;
    });

    spectator = createDirective(`
      <div
        appLazyBackgroundFade="test-background.jpg"
        rootMargin="100px"
        class="test-element">
        Background Image Test
      </div>
    `);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Directive Creation', () => {
    it('should create the directive', () => {
      expect(spectator.directive).toBeTruthy();
    });

    it('should initialize with correct input values', () => {
      expect(spectator.directive.backgroundUrl()).toBe('test-background.jpg');
      expect(spectator.directive.rootMargin()).toBe('100px');
    });
  });

  describe('ngOnInit', () => {
    it('should initialize directive and set up IntersectionObserver', () => {
      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockObserverInstance.observe).toHaveBeenCalled();
    });

    it('should create IntersectionObserver with correct options', () => {
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1
        }
      );
    });

    it('should start observing the element', () => {
      const element = spectator.query('.test-element') as HTMLElement;
      expect(mockObserverInstance.observe).toHaveBeenCalledWith(element);
    });
  });

  describe('Intersection Observer Callback', () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;
    let mockEntry: Partial<IntersectionObserverEntry>;

    beforeEach(() => {
      observerCallback = mockIntersectionObserver.mock.calls[0][0];
      mockEntry = {
        isIntersecting: true,
        target: spectator.query('.test-element') as HTMLElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      };
    });

    it('should load background image when intersecting', () => {
      observerCallback([mockEntry as IntersectionObserverEntry]);

      expect(window.Image).toHaveBeenCalled();
      expect(mockImage.src).toBe('test-background.jpg');
    });

    it('should unobserve element when intersecting', () => {
      const element = spectator.query('.test-element') as HTMLElement;
      
      observerCallback([mockEntry as IntersectionObserverEntry]);

      expect(mockObserverInstance.unobserve).toHaveBeenCalledWith(element);
    });

    it('should not load image when not intersecting', () => {
      const notIntersectingEntry = { ...mockEntry, isIntersecting: false };
      
      observerCallback([notIntersectingEntry as IntersectionObserverEntry]);

      expect(window.Image).not.toHaveBeenCalled();
      expect(mockObserverInstance.unobserve).not.toHaveBeenCalled();
    });

    it('should handle multiple entries', () => {
      const entry1 = { ...mockEntry, isIntersecting: false };
      const entry2 = { ...mockEntry, isIntersecting: true };

      observerCallback([entry1, entry2] as IntersectionObserverEntry[]);

      expect(window.Image).toHaveBeenCalledTimes(1);
      expect(mockObserverInstance.unobserve).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadBackgroundImage', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = spectator.query('.test-element') as HTMLElement;
      // Trigger intersection to call loadBackgroundImage
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      observerCallback([{ 
        isIntersecting: true, 
        target: element,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      } as IntersectionObserverEntry]);
    });

    it('should create new Image instance', () => {
      expect(window.Image).toHaveBeenCalled();
    });

    it('should set image src to background URL', () => {
      expect(mockImage.src).toBe('test-background.jpg');
    });

    describe('on image load success', () => {
      it('should handle image load success', () => {
        mockImage.onload?.();
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 10);
      });
    });

    describe('on image load error', () => {
      it('should log warning on error', () => {
        jest.spyOn(console, 'warn').mockImplementation();

        mockImage.onerror?.();

        expect(console.warn).toHaveBeenCalledWith('Failed to load background image: test-background.jpg');
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should disconnect observer when observer exists', () => {
      spectator.directive.ngOnDestroy();

      expect(mockObserverInstance.disconnect).toHaveBeenCalled();
    });

    it('should handle missing observer gracefully', () => {
      (spectator.directive as any).observer = undefined;

      expect(() => {
        spectator.directive.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Input Properties', () => {
    it('should accept backgroundUrl input', () => {
      expect(spectator.directive.backgroundUrl()).toBe('test-background.jpg');
    });

    it('should accept rootMargin input', () => {
      expect(spectator.directive.rootMargin()).toBe('100px');
    });

    it('should maintain existing element classes and attributes', () => {
      const element = spectator.query('.test-element') as HTMLElement;
      
      expect(element.className).toContain('test-element');
      expect(element.textContent?.trim()).toBe('Background Image Test');
    });
  });

  describe('Performance Considerations', () => {
    it('should only create one observer per directive', () => {
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    });

    it('should only create one Image instance per load', () => {
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      observerCallback([{ 
        isIntersecting: true, 
        target: spectator.query('.test-element'),
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      } as IntersectionObserverEntry]);

      expect(window.Image).toHaveBeenCalledTimes(1);
    });

    it('should unobserve immediately after intersection', () => {
      const element = spectator.query('.test-element') as HTMLElement;
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      observerCallback([{ 
        isIntersecting: true, 
        target: element,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      } as IntersectionObserverEntry]);

      expect(mockObserverInstance.unobserve).toHaveBeenCalledWith(element);
    });
  });
});