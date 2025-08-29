import { Component } from '@angular/core';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from '@shared/services';
import { AnalyticsTrackDirective } from './analytics-track.directive';

describe('AnalyticsTrackDirective', () => {
  let spectator: SpectatorDirective<AnalyticsTrackDirective>;
  let mockGoogleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  const createDirective = createDirectiveFactory({
    directive: AnalyticsTrackDirective,
    mocks: [GoogleAnalyticsService]
  });

  beforeEach(() => {
    mockGoogleAnalyticsService = {
      trackEvent: jest.fn()
    } as any;
  });

  describe('Component Creation', () => {
    it('should create the directive', () => {
      spectator = createDirective(`<button analyticsTrack="test">Test</button>`);
      expect(spectator.directive).toBeTruthy();
    });
  });

  describe('Click Tracking', () => {
    it('should track click events with all parameters', () => {
      spectator = createDirective(`
        <button 
          id="test-button" 
          class="btn btn-primary"
          analyticsTrack="button_click"
          analyticsCategory="test_category"
          analyticsLabel="test_label"
          [analyticsValue]="42">
          Test Button
        </button>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const buttonElement = spectator.query('#test-button') as HTMLButtonElement;
      spectator.click(buttonElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'button_click',
        category: 'test_category',
        label: 'test_label',
        value: 42,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'button',
          element_id: 'test-button',
          element_class: 'btn btn-primary'
        }
      });
    });

    it('should track click events with default values when inputs are not provided', () => {
      spectator = createDirective(`<div analyticsTrack="div_click">Default values test</div>`);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const divElement = spectator.query('div') as HTMLDivElement;
      spectator.click(divElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'div_click',
        category: 'user_interaction',
        label: 'click_div_unknown',
        value: undefined,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'div',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });

    it('should generate fallback action when analyticsTrack is empty string', () => {
      spectator = createDirective(`<span analyticsTrack="">Empty track attribute</span>`);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const spanElement = spectator.query('span') as HTMLSpanElement;
      spectator.click(spanElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'click_span',
        category: 'user_interaction',
        label: 'click_span_unknown',
        value: undefined,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'span',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });
  });

  describe('Focus Tracking', () => {
    it('should track focus events', () => {
      spectator = createDirective(`<input id="test-input" analyticsTrack="input_focus" type="text">`);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const inputElement = spectator.query('#test-input') as HTMLInputElement;
      spectator.focus(inputElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'input_focus',
        category: 'user_interaction',
        label: 'focus_input_test-input',
        value: undefined,
        custom_parameters: {
          interaction_type: 'focus',
          element_type: 'input',
          element_id: 'test-input',
          element_class: ''
        }
      });
    });

    it('should track focus events with custom label', () => {
      spectator = createDirective(`
        <input 
          analyticsTrack="custom_focus" 
          analyticsLabel="custom_focus_label"
          id="custom-input">
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const inputElement = spectator.query('#custom-input') as HTMLInputElement;
      spectator.focus(inputElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'custom_focus',
        category: 'user_interaction',
        label: 'custom_focus_label',
        value: undefined,
        custom_parameters: {
          interaction_type: 'focus',
          element_type: 'input',
          element_id: 'custom-input',
          element_class: ''
        }
      });
    });
  });

  describe('Submit Tracking', () => {
    it('should track submit events', () => {
      spectator = createDirective(`
        <form id="test-form" analyticsTrack="form_submit">
          <button type="submit">Submit</button>
        </form>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const formElement = spectator.query('#test-form') as HTMLFormElement;
      spectator.dispatchFakeEvent(formElement, 'submit');
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'form_submit',
        category: 'user_interaction',
        label: 'submit_form_test-form',
        value: undefined,
        custom_parameters: {
          interaction_type: 'submit',
          element_type: 'form',
          element_id: 'test-form',
          element_class: ''
        }
      });
    });
  });

  describe('Element Property Extraction', () => {
    it('should handle elements without ID', () => {
      spectator = createDirective(`<button analyticsTrack="no_id_button">No ID</button>`);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const buttonElement = spectator.query('button') as HTMLButtonElement;
      spectator.click(buttonElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'no_id_button',
        category: 'user_interaction',
        label: 'click_button_unknown',
        value: undefined,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'button',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });

    it('should handle elements with multiple classes', () => {
      spectator = createDirective(`
        <div 
          id="multi-class"
          class="class1 class2 class3"
          analyticsTrack="multi_class_test">
          Multiple Classes
        </div>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const divElement = spectator.query('#multi-class') as HTMLDivElement;
      spectator.click(divElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'multi_class_test',
        category: 'user_interaction',
        label: 'click_div_multi-class',
        value: undefined,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'div',
          element_id: 'multi-class',
          element_class: 'class1 class2 class3'
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero as a valid analytics value', () => {
      spectator = createDirective(`
        <button 
          analyticsTrack="zero_value"
          [analyticsValue]="0">
          Zero Value
        </button>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const buttonElement = spectator.query('button') as HTMLButtonElement;
      spectator.click(buttonElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'zero_value',
        category: 'user_interaction',
        label: 'click_button_unknown',
        value: 0,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'button',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });

    it('should handle negative analytics value', () => {
      spectator = createDirective(`
        <button 
          analyticsTrack="negative_value"
          [analyticsValue]="-10">
          Negative Value
        </button>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const buttonElement = spectator.query('button') as HTMLButtonElement;
      spectator.click(buttonElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'negative_value',
        category: 'user_interaction',
        label: 'click_button_unknown',
        value: -10,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'button',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });
  });

  describe('Service Integration', () => {
    it('should call GoogleAnalyticsService trackEvent method exactly once per interaction', () => {
      spectator = createDirective(`<button id="test-button" analyticsTrack="test">Test</button>`);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const buttonElement = spectator.query('#test-button') as HTMLButtonElement;
      
      spectator.click(buttonElement);
      spectator.click(buttonElement);
      spectator.click(buttonElement);
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledTimes(3);
    });

    it('should work with different element types', () => {
      spectator = createDirective(`
        <div>
          <button analyticsTrack="button_test">Button</button>
          <input analyticsTrack="input_test" type="text">
          <a analyticsTrack="link_test" href="#">Link</a>
        </div>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      spectator.click(spectator.query('button'));
      spectator.focus(spectator.query('input'));
      spectator.click(spectator.query('a'));
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledTimes(3);
    });
  });

  describe('Input Properties', () => {
    it('should use custom category when provided', () => {
      spectator = createDirective(`
        <button 
          analyticsTrack="custom_action"
          analyticsCategory="custom_category">
          Custom Category
        </button>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      spectator.click(spectator.query('button'));
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'custom_action',
        category: 'custom_category',
        label: 'click_button_unknown',
        value: undefined,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'button',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });

    it('should use custom label when provided', () => {
      spectator = createDirective(`
        <button 
          analyticsTrack="custom_action"
          analyticsLabel="custom_label">
          Custom Label
        </button>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      spectator.click(spectator.query('button'));
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'custom_action',
        category: 'user_interaction',
        label: 'custom_label',
        value: undefined,
        custom_parameters: {
          interaction_type: 'click',
          element_type: 'button',
          element_id: 'unknown',
          element_class: ''
        }
      });
    });
  });

  describe('Event Listener Coverage', () => {
    it('should handle click, focus, and submit events on the same element', () => {
      spectator = createDirective(`
        <button 
          id="multi-event"
          analyticsTrack="multi_event_test"
          type="submit">
          Multi Event
        </button>
      `);
      mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
      
      const button = spectator.query('#multi-event') as HTMLButtonElement;
      
      spectator.click(button);
      spectator.focus(button);
      spectator.dispatchFakeEvent(button, 'submit');
      
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledTimes(3);
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining({
        custom_parameters: expect.objectContaining({
          interaction_type: 'click'
        })
      }));
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenNthCalledWith(2, expect.objectContaining({
        custom_parameters: expect.objectContaining({
          interaction_type: 'focus'
        })
      }));
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenNthCalledWith(3, expect.objectContaining({
        custom_parameters: expect.objectContaining({
          interaction_type: 'submit'
        })
      }));
    });
  });
});