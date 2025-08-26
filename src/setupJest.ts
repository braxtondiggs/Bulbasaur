import 'jest-preset-angular/setup-jest';

// Global test setup and polyfills
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: (element: Element) => ({
    display: 'block',
    appearance: ['-webkit-appearance'],
    getPropertyValue: jest.fn().mockReturnValue(''),
    visibility: 'visible',
    width: '500px',
    height: '400px'
  })
});

// Mock global functions that might be used in components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) { }
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  disconnect(): void { }
  observe(target: Element): void { }
  unobserve(target: Element): void { }
  takeRecords(): IntersectionObserverEntry[] { return []; }
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) { }
  disconnect(): void { }
  observe(target: Element, options?: ResizeObserverOptions): void { }
  unobserve(target: Element): void { }
};

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Enhanced DOM element mocking for Highcharts
Object.defineProperty(Element.prototype, 'getPropertyValue', {
  writable: true,
  value: jest.fn().mockReturnValue('')
});

// Mock document.createElement for better Highcharts compatibility
const originalCreateElement = document.createElement;
document.createElement = jest.fn().mockImplementation((tagName) => {
  const element = originalCreateElement.call(document, tagName);

  // Add missing properties for Highcharts compatibility
  if (tagName === 'div' || tagName === 'svg') {
    Object.defineProperty(element, 'getPropertyValue', {
      writable: true,
      value: jest.fn().mockReturnValue('')
    });

    Object.defineProperty(element.style, 'getPropertyValue', {
      writable: true,
      value: jest.fn().mockReturnValue('')
    });
  }

  return element;
});

// Suppress console warnings during tests (optional)
// console.warn = jest.fn();

// Global test timeout
jest.setTimeout(30000);

