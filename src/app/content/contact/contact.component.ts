import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private name: FormControl = new FormControl('', [Validators.required]);
  private email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  private subject: FormControl;
  private message: FormControl = new FormControl('', [Validators.required]);
  private contactform: FormGroup;

  getErrorMessage(input: FormControl, name: string = 'This field') {
    return input.hasError('required') ? `${name} is required.` :
      input.hasError('email') ? 'Invalid email address' :
        '';
  }
  onSubmit() {
    if (this.contactform.valid) {
    }
  }
}
