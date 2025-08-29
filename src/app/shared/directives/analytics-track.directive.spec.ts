import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@shared/services';
import { AnalyticsTrackDirective } from './analytics-track.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      analyticsTrack="button_click"
      analyticsCategory="navigation"
      analyticsLabel="test_button"
      [analyticsValue]="10"
      id="test-button"
      class="btn primary"
    >
      Test Button
    </button>

    <form analyticsTrack="form_submit" analyticsCategory="forms" analyticsLabel="test_form">
      <input type="text" />
      <button type="submit">Submit</button>
    </form>

    <input analyticsTrack="input_focus" analyticsCategory="forms" type="text" id="test-input" />
  `,
  standalone: true,
  imports: [AnalyticsTrackDirective]
})
class TestComponent {}

describe('AnalyticsTrackDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockGoogleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  beforeEach(async () => {
    const mockGA = {
      trackEvent: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: GoogleAnalyticsService, useValue: mockGA }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    mockGoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService) as jest.Mocked<GoogleAnalyticsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track click events', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));

    buttonElement.triggerEventHandler('click', new Event('click'));

    expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
      action: 'button_click',
      category: 'navigation',
      label: 'test_button',
      value: 10,
      custom_parameters: {
        interaction_type: 'click',
        element_type: 'button',
        element_id: 'test-button',
        element_class: 'btn primary'
      }
    });
  });

  it('should track form submit events', () => {
    const formElement = fixture.debugElement.query(By.css('form'));

    formElement.triggerEventHandler('submit', new Event('submit'));

    expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
      action: 'form_submit',
      category: 'forms',
      label: 'test_form',
      value: undefined,
      custom_parameters: {
        interaction_type: 'submit',
        element_type: 'form',
        element_id: '',
        element_class: ''
      }
    });
  });

  it('should track focus events', () => {
    const inputElement = fixture.debugElement.query(By.css('input[type="text"]'));

    inputElement.triggerEventHandler('focus', new Event('focus'));

    expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
      action: 'input_focus',
      category: 'forms',
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

  it('should generate default labels when not provided', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    // Remove the analyticsLabel attribute for this test
    buttonElement.nativeElement.removeAttribute('analyticsLabel');

    buttonElement.triggerEventHandler('click', new Event('click'));

    expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'click_button_test-button'
      })
    );
  });
});
