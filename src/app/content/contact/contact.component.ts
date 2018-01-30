import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private name: FormControl = new FormControl('', [Validators.required]);
  private email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  private subject: FormControl = new FormControl();
  private message: FormControl = new FormControl('', [Validators.required, Validators.minLength(15), Validators.maxLength(2056)]);
  private contactform: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    subject: this.subject,
    message: this.message
  });
  private submit = false;

  constructor(protected http: HttpClient, protected snackBar: MatSnackBar) { }

  getErrorMessage(input: FormControl, label: string = 'This field') {
    return input.hasError('required') ? `${label} is required.` :
      input.hasError('email') ? 'Invalid email address' :
        input.hasError('minlength') ? `${label} must be atleast ${input.errors.minlength.requiredLength} characters` :
          input.hasError('maxlength') ? `${label} cannot be more than ${input.errors.maxlength.requiredLength} characters` :
            '';
  }
  onSubmit() {
    if (this.contactform.valid) {
      this.submit = true;
      this.http.post('https://meowth1.herokuapp.com/mail', {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
      }).subscribe((data: any) => {
        if (data.status) { this.snackBar.open('Email successfully sent'); }
      }, () => {
        this.snackBar.open('Something went wrong', 'Close', { duration: 0 });
      });
    }
  }
}
