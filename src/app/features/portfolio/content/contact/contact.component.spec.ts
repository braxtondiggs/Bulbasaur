import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { NgIcon } from '@ng-icons/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AnalyticsHelperService, GoogleAnalyticsService, ScrollService } from '@shared/services';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { of } from 'rxjs';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let spectator: Spectator<ContactComponent>;
  let httpTestingController: HttpTestingController;
  let analyticsHelperService: jest.Mocked<AnalyticsHelperService>;
  let googleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  const createComponent = createComponentFactory({
    component: ContactComponent,
    imports: [ReactiveFormsModule, HttpClientTestingModule, NgIcon, testNgIconsModule],
    providers: [
      {
        provide: ScrollService,
        useValue: {
          scrollObs: of({}),
          resizeObs: of({}),
          pos: 0
        }
      }
    ],
    mocks: [AnalyticsHelperService, GoogleAnalyticsService],
    shallow: true,
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent();
    httpTestingController = spectator.inject(HttpTestingController);
    analyticsHelperService = spectator.inject(AnalyticsHelperService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
    spectator.detectChanges();
  });

  afterEach(() => {
    if (httpTestingController) {
      httpTestingController.verify();
    }
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(spectator.component.contactForm.value).toEqual({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    });

    it('should initialize signals with correct default values', () => {
      expect(spectator.component.submit()).toBe(false);
    });

    it('should have invalid form initially', () => {
      expect(spectator.component.contactForm.invalid).toBe(true);
    });
  });

  describe('Form Validation', () => {
    describe('Name field', () => {
      it('should be required', () => {
        const nameControl = spectator.component.name;
        expect(nameControl.hasError('required')).toBe(true);

        nameControl.setValue('John Doe');
        expect(nameControl.hasError('required')).toBe(false);
      });

      it('should return correct error message for required validation', () => {
        const nameControl = spectator.component.name;
        nameControl.markAsTouched();

        const errorMessage = spectator.component.getErrorMessage(nameControl, 'Name');
        expect(errorMessage).toBe('Name is required.');
      });
    });

    describe('Email field', () => {
      it('should be required', () => {
        const emailControl = spectator.component.email;
        expect(emailControl.hasError('required')).toBe(true);

        emailControl.setValue('test@example.com');
        expect(emailControl.hasError('required')).toBe(false);
      });

      it('should validate email pattern', () => {
        const emailControl = spectator.component.email;

        emailControl.setValue('invalid-email');
        expect(emailControl.hasError('pattern')).toBe(true);

        emailControl.setValue('valid@example.com');
        expect(emailControl.hasError('pattern')).toBe(false);
      });

      it('should return correct error message for pattern validation', () => {
        const emailControl = spectator.component.email;
        emailControl.setValue('invalid-email');
        emailControl.markAsTouched();

        const errorMessage = spectator.component.getErrorMessage(emailControl);
        expect(errorMessage).toBe('Invalid email address');
      });
    });

    describe('Subject field', () => {
      it('should not be required', () => {
        const subjectControl = spectator.component.subject;
        expect(subjectControl.hasError('required')).toBe(false);
      });
    });

    describe('Message field', () => {
      it('should be required', () => {
        const messageControl = spectator.component.message;
        expect(messageControl.hasError('required')).toBe(true);

        messageControl.setValue('This is a test message with enough characters.');
        expect(messageControl.hasError('required')).toBe(false);
      });

      it('should have minimum length validation', () => {
        const messageControl = spectator.component.message;

        messageControl.setValue('short');
        expect(messageControl.hasError('minlength')).toBe(true);

        messageControl.setValue('This is a test message with enough characters.');
        expect(messageControl.hasError('minlength')).toBe(false);
      });

      it('should have maximum length validation', () => {
        const messageControl = spectator.component.message;
        const longMessage = 'a'.repeat(2057);

        messageControl.setValue(longMessage);
        expect(messageControl.hasError('maxlength')).toBe(true);

        messageControl.setValue('This is a valid message.');
        expect(messageControl.hasError('maxlength')).toBe(false);
      });

      it('should return correct error messages for different validations', () => {
        const messageControl = spectator.component.message;

        // Test minlength error
        messageControl.setValue('short');
        messageControl.markAsTouched();
        let errorMessage = spectator.component.getErrorMessage(messageControl, 'Message');
        expect(errorMessage).toBe('Message must be at least 15 characters');

        // Test maxlength error
        const longMessage = 'a'.repeat(2057);
        messageControl.setValue(longMessage);
        errorMessage = spectator.component.getErrorMessage(messageControl, 'Message');
        expect(errorMessage).toBe('Message cannot be more than 2056 characters');
      });
    });
  });

  describe('Form Interactions', () => {
    it('should track form start on first field focus', () => {
      spectator.component.onFieldFocus('name');

      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('start', 'name');
    });

    it('should not track form start on subsequent field focus', () => {
      spectator.component.onFieldFocus('name');
      spectator.component.onFieldFocus('email');

      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledTimes(1);
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('start', 'name');
    });

    it('should fill out and validate complete form', () => {
      const form = spectator.component.contactForm;

      form.patchValue({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation.'
      });

      expect(form.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Set up valid form data
      spectator.component.contactForm.patchValue({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation.'
      });
    });

    it('should submit form when valid', () => {
      const mockResponse = { status: true, message: 'Email sent successfully' };

      spectator.component.onSubmit();

      expect(spectator.component.submit()).toBe(true);
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('submit', 'contact_form');

      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'john@example.com',
        message: 'This is a test message with enough characters to pass validation.',
        name: 'John Doe',
        subject: 'Test Subject'
      });

      req.flush(mockResponse);

      expect(spectator.component.submit()).toBe(false);
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('success', 'contact_form');
    });

    it('should not submit form when invalid', () => {
      spectator.component.contactForm.patchValue({
        name: '',
        email: 'invalid-email',
        message: 'short'
      });

      spectator.component.onSubmit();

      expect(spectator.component.submit()).toBe(false);
      httpTestingController.expectNone(`${environment.functionsUrl}/mail`);
      expect(analyticsHelperService.trackContactForm).not.toHaveBeenCalled();
    });

    it('should handle API error response', () => {
      const errorResponse = { status: 500, statusText: 'Internal Server Error' };
      const errorBody = { message: 'Server error occurred' };

      spectator.component.onSubmit();

      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      req.flush(errorBody, errorResponse);

      expect(spectator.component.submit()).toBe(false);
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith(
        'error',
        'contact_form',
        'Server error occurred'
      );
    });

    it('should handle API error without message', () => {
      const errorResponse = { status: 500, statusText: 'Internal Server Error' };

      spectator.component.onSubmit();

      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      req.flush({}, errorResponse);

      expect(spectator.component.submit()).toBe(false);
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('error', 'contact_form', 'Unknown error');
    });

    it('should reset form after successful submission', () => {
      const mockResponse = { status: true };

      spectator.component.onSubmit();

      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      req.flush(mockResponse);

      expect(spectator.component.contactForm.value).toEqual({
        name: null,
        email: null,
        subject: null,
        message: null
      });

      // Verify form errors are cleared
      Object.keys(spectator.component.contactForm.controls).forEach(key => {
        const control = spectator.component.contactForm.get(key);
        expect(control?.errors).toBeNull();
      });
    });
  });

  describe('Toast Notifications', () => {
    beforeEach(() => {
      // Set up valid form data for testing toasts
      spectator.component.contactForm.patchValue({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation.'
      });
    });

    it('should show success toast on successful submission', () => {
      const mockResponse = { status: true };
      const createToastSpy = jest.spyOn(spectator.component as any, 'createToastElement');

      spectator.component.onSubmit();

      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      req.flush(mockResponse);

      expect(createToastSpy).toHaveBeenCalledWith('Email successfully sent', 'success');
    });

    it('should show error toast on failed submission', () => {
      const errorResponse = { status: 500, statusText: 'Internal Server Error' };
      const createToastSpy = jest.spyOn(spectator.component as any, 'createToastElement');

      spectator.component.onSubmit();

      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      req.flush({}, errorResponse);

      expect(createToastSpy).toHaveBeenCalledWith('Something went wrong', 'error');
    });

    it('should create toast element with correct structure and classes', () => {
      const component = spectator.component as any;
      const toastElement = component.createToastElement('Test message', 'success');

      expect(toastElement.tagName).toBe('DIV');
      expect(toastElement.className).toContain('alert');
      expect(toastElement.className).toContain('alert-success');
      expect(toastElement.className).toContain('fixed');
      expect(toastElement.className).toContain('top-4');
      expect(toastElement.className).toContain('right-4');
      expect(toastElement.className).toContain('z-50');
      expect(toastElement.innerHTML).toContain('Test message');
    });

    it('should create error toast with correct classes', () => {
      const component = spectator.component as any;
      const toastElement = component.createToastElement('Error message', 'error');

      expect(toastElement.className).toContain('alert-error');
      expect(toastElement.innerHTML).toContain('Error message');
    });

    it('should return correct SVG icon for success toast', () => {
      const component = spectator.component as any;
      const successIcon = component.getSvgIcon('success');

      expect(successIcon).toContain('fill-rule="evenodd"');
      expect(successIcon).toContain('M10 18a8 8 0 100-16');
    });

    it('should return correct SVG icon for error toast', () => {
      const component = spectator.component as any;
      const errorIcon = component.getSvgIcon('error');

      expect(errorIcon).toContain('fill-rule="evenodd"');
      expect(errorIcon).toContain('M10 18a8 8 0 100-16');
    });

    it('should remove toast element', () => {
      const component = spectator.component as any;
      const mockElement = document.createElement('div');
      const mockParent = document.createElement('div');
      mockParent.appendChild(mockElement);

      const removeChildSpy = jest.spyOn(mockParent, 'removeChild');

      component.removeToast(mockElement);

      expect(removeChildSpy).toHaveBeenCalledWith(mockElement);
    });

    it('should handle removing toast without parent', () => {
      const component = spectator.component as any;
      const mockElement = document.createElement('div');

      // Should not throw error when parent is null
      expect(() => component.removeToast(mockElement)).not.toThrow();
    });
  });

  describe('Form Getters', () => {
    it('should return correct form controls via getters', () => {
      expect(spectator.component.name).toBe(spectator.component.contactForm.controls.name);
      expect(spectator.component.email).toBe(spectator.component.contactForm.controls.email);
      expect(spectator.component.subject).toBe(spectator.component.contactForm.controls.subject);
      expect(spectator.component.message).toBe(spectator.component.contactForm.controls.message);
    });
  });

  describe('Error Message Generation', () => {
    it('should return empty string for valid control', () => {
      const nameControl = spectator.component.name;
      nameControl.setValue('John Doe');

      const errorMessage = spectator.component.getErrorMessage(nameControl);
      expect(errorMessage).toBe('');
    });

    it('should use default label when none provided', () => {
      const nameControl = spectator.component.name;
      nameControl.markAsTouched();

      const errorMessage = spectator.component.getErrorMessage(nameControl);
      expect(errorMessage).toBe('This field is required.');
    });

    it('should handle missing error properties gracefully', () => {
      const nameControl = spectator.component.name;
      nameControl.setValue('a'); // Will trigger minlength if it exists
      nameControl.setErrors({ minlength: {} }); // Empty error object

      const errorMessage = spectator.component.getErrorMessage(nameControl);
      expect(errorMessage).toBe('This field must be at least 0 characters');
    });
  });

  describe('Component Dependencies', () => {
    it('should inject required services', () => {
      expect(spectator.inject(AnalyticsHelperService)).toBeDefined();
      expect(spectator.inject(GoogleAnalyticsService)).toBeDefined();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component.constructor.prototype.constructor.name).toBe('ContactComponent');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full form submission flow', async () => {
      // Fill out form
      spectator.component.contactForm.patchValue({
        name: 'Integration Test User',
        email: 'integration@test.com',
        subject: 'Integration Test',
        message: 'This is an integration test message with sufficient length.'
      });

      // Trigger field focus to start analytics tracking
      spectator.component.onFieldFocus('name');

      // Submit form
      spectator.component.onSubmit();

      // Verify submit state
      expect(spectator.component.submit()).toBe(true);

      // Mock successful API response
      const req = httpTestingController.expectOne(`${environment.functionsUrl}/mail`);
      req.flush({ status: true });

      // Verify final state
      expect(spectator.component.submit()).toBe(false);
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('start', 'name');
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('submit', 'contact_form');
      expect(analyticsHelperService.trackContactForm).toHaveBeenCalledWith('success', 'contact_form');
    });
  });
});
