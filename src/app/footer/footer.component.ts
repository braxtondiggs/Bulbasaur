import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  private year: string = moment().format('YYYY');
  constructor() { }
}
