import { Component } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  public year: string = dayjs().format('YYYY');
}
