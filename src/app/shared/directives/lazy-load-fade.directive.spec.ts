import { Component } from '@angular/core';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator/jest';
import { LazyLoadFadeDirective } from './lazy-load-fade.directive';

describe('LazyLoadFadeDirective', () => {
  let spectator: SpectatorDirective<LazyLoadFadeDirective>;
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
    directive: LazyLoadFadeDirective
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
      <img
        appLazyLoadFade="test-image.jpg"
        alt="Test image description"
        rootMargin="100px"
        class="test-image">
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
      expect(spectator.directive.src()).toBe('test-image.jpg');
      expect(spectator.directive.alt()).toBe('Test image description');
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

    it('should start observing the img element', () => {
      const img = spectator.query('.test-image') as HTMLImageElement;
      expect(mockObserverInstance.observe).toHaveBeenCalledWith(img);
    });

    it('should set alt attribute on img element', () => {
      const img = spectator.query('.test-image') as HTMLImageElement;
      expect(img.alt).toBe('Test image description');
    });
  });

  describe('Intersection Observer Callback', () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;
    let mockEntry: Partial<IntersectionObserverEntry>;

    beforeEach(() => {
      observerCallback = mockIntersectionObserver.mock.calls[0][0];
      mockEntry = {
        isIntersecting: true,
        target: spectator.query('.test-image') as HTMLImageElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      };
    });

    it('should load image when intersecting', () => {
      observerCallback([mockEntry as IntersectionObserverEntry]);

      expect(window.Image).toHaveBeenCalled();
      expect(mockImage.src).toBe('test-image.jpg');
    });

    it('should unobserve img element when intersecting', () => {
      const img = spectator.query('.test-image') as HTMLImageElement;
      
      observerCallback([mockEntry as IntersectionObserverEntry]);

      expect(mockObserverInstance.unobserve).toHaveBeenCalledWith(img);
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

  describe('loadImage', () => {
    let img: HTMLImageElement;

    beforeEach(() => {
      img = spectator.query('.test-image') as HTMLImageElement;
      // Trigger intersection to call loadImage
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      observerCallback([{ 
        isIntersecting: true, 
        target: img,
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

    it('should set image src to lazy load URL', () => {
      expect(mockImage.src).toBe('test-image.jpg');
    });

    describe('on image load success', () => {
      it('should handle image load success', () => {
        mockImage.onload?.();

        // The img src should be set to the mockImage src (which matches the directive src)
        expect(img.src).toContain('test-image.jpg');
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 10);
      });
    });

    describe('on image load error', () => {
      it('should log warning on error', () => {
        jest.spyOn(console, 'warn').mockImplementation();

        mockImage.onerror?.();

        expect(console.warn).toHaveBeenCalledWith('Failed to load image: test-image.jpg');
      });

      it('should not set img src on error', () => {
        const originalSrc = img.src;
        jest.spyOn(console, 'warn').mockImplementation();

        mockImage.onerror?.();

        expect(img.src).toBe(originalSrc);
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
    it('should accept src input', () => {
      expect(spectator.directive.src()).toBe('test-image.jpg');
    });

    it('should accept alt input', () => {
      expect(spectator.directive.alt()).toBe('Test image description');
    });

    it('should accept rootMargin input', () => {
      expect(spectator.directive.rootMargin()).toBe('100px');
    });

    it('should maintain existing img attributes', () => {
      const img = spectator.query('.test-image') as HTMLImageElement;
      
      expect(img.className).toContain('test-image');
      expect(img.alt).toBe('Test image description');
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
        target: spectator.query('.test-image'),
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      } as IntersectionObserverEntry]);

      expect(window.Image).toHaveBeenCalledTimes(1);
    });

    it('should unobserve immediately after intersection', () => {
      const img = spectator.query('.test-image') as HTMLImageElement;
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      observerCallback([{ 
        isIntersecting: true, 
        target: img,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: 0
      } as IntersectionObserverEntry]);

      expect(mockObserverInstance.unobserve).toHaveBeenCalledWith(img);
    });
  });

  describe('Accessibility', () => {
    it('should preserve alt attribute for screen readers', () => {
      const img = spectator.query('.test-image') as HTMLImageElement;
      
      expect(img.alt).toBe('Test image description');
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });
});