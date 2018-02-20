import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contact',
  styleUrls: ['./contact.component.scss'],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  public name: FormControl = new FormControl('', [Validators.required]);
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public subject: FormControl = new FormControl();
  public message: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(15),
    Validators.maxLength(2056)
  ]);
  public contactform: FormGroup = new FormGroup({
    email: this.email,
    message: this.message,
    name: this.name,
    subject: this.subject
  });
  public submit = false;

  constructor(protected http: HttpClient, protected snackBar: MatSnackBar) { }

  public getErrorMessage(input: FormControl, label: string = 'This field') {
    if (input.hasError('required')) {
      return `${label} is required.`;
    } else if (input.hasError('email')) {
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
        }
      }, () => {
        this.snackBar.open('Something went wrong', 'Close', { duration: 0 });
      });
    }
  }
}
