import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgIcon } from '@ng-icons/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyBackgroundFadeDirective } from '@shared/directives/lazy-background-fade.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';
import { SocialComponent } from '../../../profile/social/social.component';

interface ContactForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  subject: FormControl<string | null>;
  message: FormControl<string | null>;
}

interface ContactApiResponse {
  status: boolean;
  message?: string;
}

type ToastType = 'success' | 'error';

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
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly ga = inject(GoogleAnalyticsService);
  private readonly analyticsHelper = inject(AnalyticsHelperService);

  public readonly submit = signal(false);
  private readonly formStarted = signal(false);

  public readonly contactForm: FormGroup<ContactForm> = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')
    ]),
    subject: this.fb.control(''),
    message: this.fb.control('', [Validators.required, Validators.minLength(15), Validators.maxLength(2056)])
  });

  public get name(): FormControl<string | null> {
    return this.contactForm.controls.name;
  }

  public get email(): FormControl<string | null> {
    return this.contactForm.controls.email;
  }

  public get subject(): FormControl<string | null> {
    return this.contactForm.controls.subject;
  }

  public get message(): FormControl<string | null> {
    return this.contactForm.controls.message;
  }

  public onFieldFocus(fieldName: string): void {
    if (!this.formStarted()) {
      this.formStarted.set(true);
      this.analyticsHelper.trackContactForm('start', fieldName);
    }
  }

  public getErrorMessage(input: FormControl<string | null>, label = 'This field'): string {
    if (input.hasError('required')) {
      return `${label} is required.`;
    } else if (input.hasError('pattern')) {
      return 'Invalid email address';
    } else if (input.hasError('minlength')) {
      return `${label} must be at least ${input.errors?.minlength?.requiredLength || 0} characters`;
    } else if (input.hasError('maxlength')) {
      return `${label} cannot be more than ${input.errors?.maxlength?.requiredLength || 0} characters`;
    }
    return '';
  }
  public onSubmit(): void {
    if (this.contactForm.valid) {
      this.submit.set(true);

      // Track form submission attempt
      this.analyticsHelper.trackContactForm('submit', 'contact_form');

      const formValue = this.contactForm.getRawValue();

      this.http
        .post<ContactApiResponse>(`${environment.functionsUrl}/mail`, {
          email: formValue.email,
          message: formValue.message,
          name: formValue.name,
          subject: formValue.subject
        })
        .subscribe({
          next: (data: ContactApiResponse) => {
            if (data.status) {
              // Track successful form submission
              this.analyticsHelper.trackContactForm('success', 'contact_form');
              this.showToast('Email successfully sent', 'success');
              this.resetForm();
            }
            this.submit.set(false);
          },
          error: ({ error }) => {
            // Track form submission error
            this.analyticsHelper.trackContactForm('error', 'contact_form', error?.message || 'Unknown error');
            this.showToast('Something went wrong', 'error');
            this.submit.set(false);
          }
        });
    }
  }

  private resetForm(): void {
    this.contactForm.reset();
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.setErrors(null);
    });
  }

  private showToast(message: string, type: ToastType): void {
    const toast = this.createToastElement(message, type);
    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);
  }

  private createToastElement(message: string, type: ToastType): HTMLElement {
    const toast = document.createElement('div');
    toast.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} fixed top-4 right-4 z-50 max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          ${this.getSvgIcon(type)}
        </svg>
        <span>${message}</span>
      </div>
    `;
    return toast;
  }

  private getSvgIcon(type: ToastType): string {
    const successIcon =
      '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>';
    const errorIcon =
      '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>';

    return type === 'success' ? successIcon : errorIcon;
  }

  private removeToast(toast: HTMLElement): void {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }
}
