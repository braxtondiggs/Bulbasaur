import { Component, ChangeDetectionStrategy } from '@angular/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  public year: string = dayjs().format('YYYY');
}
