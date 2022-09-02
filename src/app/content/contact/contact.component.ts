import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  styleUrls: ['./contact.component.scss'],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  public name: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  public email: UntypedFormControl = new UntypedFormControl('', [Validators.required,
  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
  ]);
  public subject: UntypedFormControl = new UntypedFormControl();
  public message: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(15),
    Validators.maxLength(2056)
  ]);
  public contactform: UntypedFormGroup = new UntypedFormGroup({
    email: this.email,
    message: this.message,
    name: this.name,
    subject: this.subject
  });
  public submit = false;

  constructor(protected http: HttpClient, protected snackBar: MatSnackBar) { }

  public getErrorMessage(input: UntypedFormControl, label: string = 'This field') {
    if (input.hasError('required')) {
      return `${label} is required.`;
    } else if (input.hasError('pattern')) {
      return 'Invalid email address';
    } else if (input.hasError('minlength')) {
      return `${label} must be atleast ${input.errors.minlength.requiredLength} characters`;
    } else if (input.hasError('maxlength')) {
      return `${label} cannot be more than ${input.errors.maxlength.requiredLength} characters`;
    }
  }
  public onSubmit() {
    if (this.contactform.valid) {
      this.submit = true;
      this.http.post('https://meowth1.herokuapp.com/api/mail/inquire', {}, {
        headers: new HttpHeaders({
          email: this.email.value,
          message: this.message.value,
          name: this.name.value,
          subject: this.subject.value
        })
      }).subscribe((data: any) => {
        if (data.status) {
          this.snackBar.open('Email successfully sent');
          this.contactform.reset();
          for (const i of Object.keys(this.contactform.controls)) {
            this.contactform.controls[i].setErrors(null);
          }
        }
      }, () => {
        this.snackBar.open('Something went wrong', 'Close', { duration: 0 });
      });
    }
  }
}
