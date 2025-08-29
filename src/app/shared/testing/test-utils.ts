import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIconsModule } from '@ng-icons/core';
import {
  featherActivity,
  featherBriefcase,
  featherChevronsUp,
  featherCode,
  featherDownload,
  featherEdit,
  featherExternalLink,
  featherFacebook,
  featherGithub,
  featherHeart,
  featherInstagram,
  featherLinkedin,
  featherMail,
  featherMapPin,
  featherSend,
  featherX
} from '@ng-icons/feather-icons';

/**
 * Common NgIcons configuration for tests
 */
export const testNgIconsModule = NgIconsModule.withIcons({
  featherDownload,
  featherCode,
  featherMail,
  featherInstagram,
  featherLinkedin,
  featherMapPin,
  featherBriefcase,
  featherActivity,
  featherGithub,
  featherFacebook,
  featherHeart,
  featherChevronsUp,
  featherSend,
  featherEdit,
  featherExternalLink,
  featherX
});
/**
 * Mock Google Analytics service for tests
 */
export const mockGoogleAnalyticsService = {
  // Legacy method
  eventEmitter: jest.fn(),

  // New enhanced methods
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
  trackScreenView: jest.fn(),
  trackUserInteraction: jest.fn(),
  trackTiming: jest.fn(),
  trackError: jest.fn(),
  trackSocialInteraction: jest.fn(),
  trackDownload: jest.fn(),
  trackExternalLink: jest.fn(),
  trackFormInteraction: jest.fn(),
  trackSearch: jest.fn(),
  trackVideo: jest.fn(),
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  setAnalyticsEnabled: jest.fn(),
  setAnalyticsConsent: jest.fn(),
  isAnalyticsEnabled: jest.fn().mockReturnValue(true),
  setDebugMode: jest.fn()
};

/**
 * Setup common DOM mocks for component tests
 */
export const setupDomMocks = () => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    },
    writable: true
  });

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true
  });

  // Mock window.pageYOffset
  Object.defineProperty(window, 'pageYOffset', {
    value: 0,
    writable: true
  });
};

/**
 * Mock document.getElementById for tests
 */
export const mockGetElementById = (mockElement?: Partial<HTMLElement>) => {
  const defaultElement = {
    getBoundingClientRect: () => ({
      top: 100,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toJSON: () => {}
    }),
    ...mockElement
  } as HTMLElement;

  jest.spyOn(document, 'getElementById').mockReturnValue(defaultElement);
};

/**
 * Common test data
 */
export const testData = {
  socialLinks: [
    { name: 'Facebook', label: 'Facebook', url: 'https://www.facebook.com/BiggDiggz' },
    { name: 'Github', label: 'Github', url: 'https://github.com/braxtondiggs' },
    { name: 'Instagram', label: 'Instagram', url: 'http://instagram.com/biggdiggz' },
    { name: 'LinkedIn', label: 'LinkedIn', url: 'https://www.linkedin.com/in/braxtondiggs' },
    { name: 'Twitter', label: 'Twitter', url: 'https://twitter.com/braxtondiggs' }
  ],
  navigationSections: ['about', 'experience', 'skills', 'projects', 'contact'],
  themes: ['light', 'dark', 'cyberpunk', 'synthwave']
};

/**
 * Utility functions for testing Angular components
 */
export class TestUtils {
  /**
   * Find element by CSS selector
   */
  static findElement<T>(fixture: ComponentFixture<T>, selector: string): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }

  /**
   * Find all elements by CSS selector
   */
  static findElements<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }

  /**
   * Get element text content
   */
  static getElementText<T>(fixture: ComponentFixture<T>, selector: string): string {
    const element = this.findElement(fixture, selector);
    return element ? element.nativeElement.textContent.trim() : '';
  }

  /**
   * Click element
   */
  static clickElement<T>(fixture: ComponentFixture<T>, selector: string): void {
    const element = this.findElement(fixture, selector);
    if (element) {
      element.nativeElement.click();
      fixture.detectChanges();
    }
  }

  /**
   * Trigger input event
   */
  static setInputValue<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
    const element = this.findElement(fixture, selector);
    if (element) {
      const input = element.nativeElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }
  }

  /**
   * Wait for async operations
   */
  static async waitForAsync(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  /**
   * Create a spy object with methods
   */
  static createSpyObj(baseName: string, methodNames: string[]): any {
    const obj: any = {};
    methodNames.forEach(methodName => {
      obj[methodName] = jest.fn();
    });
    return obj;
  }

  /**
   * Assert element existence
   */
  static expectElementToExist<T>(fixture: ComponentFixture<T>, selector: string): void {
    const element = this.findElement(fixture, selector);
    expect(element).toBeTruthy();
  }

  /**
   * Assert element does not exist
   */
  static expectElementNotToExist<T>(fixture: ComponentFixture<T>, selector: string): void {
    const element = this.findElement(fixture, selector);
    expect(element).toBeFalsy();
  }
}

/**
 * Mock data factory for tests
 */
export class MockDataFactory {
  static createMockSkillData() {
    return {
      Frontend: [
        { name: 'Angular', level: 90 },
        { name: 'React', level: 80 },
        { name: 'TypeScript', level: 85 }
      ],
      Backend: [
        { name: 'Node.js', level: 85 },
        { name: 'Python', level: 75 },
        { name: 'Java', level: 70 }
      ]
    };
  }

  static createMockAnalyticsEvent() {
    return {
      category: 'test_category',
      action: 'test_action',
      label: 'test_label',
      value: 1
    };
  }
}

/**
 * Common test matchers and expectations
 */
export class TestMatchers {
  static toHaveBeenCalledWithAnalyticsEvent(
    spy: jest.SpyInstance,
    category: string,
    action: string,
    label?: string,
    value?: number
  ): void {
    expect(spy).toHaveBeenCalledWith(category, action, label, value);
  }

  static toHaveCorrectAriaAttributes(element: HTMLElement): void {
    expect(element.getAttribute('role')).toBeDefined();
    expect(element.getAttribute('aria-label')).toBeDefined();
  }
}

/**
 * Modern test utilities for DaisyUI and accessibility testing
 */
export class ModernTestUtils {
  /**
   * Assert DaisyUI classes are present on element
   */
  static expectDaisyUIClasses(element: Element | null, classes: string[]): void {
    expect(element).toBeTruthy();
    classes.forEach(className => {
      expect(element).toHaveClass(className);
    });
  }

  /**
   * Assert accessibility attributes are present
   */
  static expectA11yAttributes(element: Element | null, attributes: string[]): void {
    expect(element).toBeTruthy();
    attributes.forEach(attr => {
      expect(element).toHaveAttribute(attr);
    });
  }

  /**
   * Test if component renders without errors
   */
  static shouldCreateComponent<T>(component: T): void {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
  }
}
