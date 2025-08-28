import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyBackgroundFadeDirective } from '@shared/directives/lazy-background-fade.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';
import { SocialComponent } from '../../../profile/social/social.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    SocialComponent,
    AnimateOnScrollDirective,
    LazyLoadFadeDirective,
    LazyBackgroundFadeDirective
  ],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  public name: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  public email: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
  ]);
  public subject: UntypedFormControl = new UntypedFormControl();
  public message: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(15),
    Validators.maxLength(2056)
  ]);
  public contactForm: UntypedFormGroup = new UntypedFormGroup({
    email: this.email,
    message: this.message,
    name: this.name,
    subject: this.subject
  });
  public submit = false;

  protected http = inject(HttpClient);
  private ga = inject(GoogleAnalyticsService);
  private analyticsHelper = inject(AnalyticsHelperService);
  private formStarted = false;

  public onFieldFocus(fieldName: string): void {
    if (!this.formStarted) {
      this.formStarted = true;
      this.analyticsHelper.trackContactForm('start', fieldName);
    }
  }

  public getErrorMessage(input: UntypedFormControl, label: string = 'This field'): string {
    if (input.hasError('required')) {
      return `${label} is required.`;
    } else if (input.hasError('pattern')) {
      return 'Invalid email address';
    } else if (input.hasError('minlength')) {
      return `${label} must be atleast ${input.errors?.minlength?.requiredLength || 0} characters`;
    } else if (input.hasError('maxlength')) {
      return `${label} cannot be more than ${input.errors?.maxlength?.requiredLength || 0} characters`;
    }
    return '';
  }
  public onSubmit() {
    if (this.contactForm.valid) {
      this.submit = true;

      // Track form submission attempt
      this.analyticsHelper.trackContactForm('submit', 'contact_form');

      this.http
        .post('https://us-central1-bulbasaur-bfb64.cloudfunctions.net/endpoints/mail', {
          email: this.email.value,
          message: this.message.value,
          name: this.name.value,
          subject: this.subject.value
        })
        .subscribe({
          next: (data: { status: boolean }) => {
            if (data.status) {
              // Track successful form submission
              this.analyticsHelper.trackContactForm('success', 'contact_form');
              this.showToast('Email successfully sent', 'success');
              this.contactForm.reset();
              for (const i of Object.keys(this.contactForm.controls)) {
                this.contactForm.controls[i].setErrors(null);
              }
            }
          },
          error: ({ error }) => {
            // Track form submission error
            this.analyticsHelper.trackContactForm('error', 'contact_form', error?.message || 'Unknown error');
            this.showToast('Something went wrong', error);
          }
        });
    }
  }

  private showToast(message: string, type: 'success' | 'error') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} fixed top-4 right-4 z-50 max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          ${
            type === 'success'
              ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>'
              : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>'
          }
        </svg>
        <span>${message}</span>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }
}
