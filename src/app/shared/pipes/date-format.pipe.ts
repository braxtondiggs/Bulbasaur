import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

const dayjsConstructor = dayjs;

@Pipe({ name: 'amDateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  public transform(value: dayjs.Dayjs, format: string): string {
    return value ? dayjsConstructor(value).format(format) : '';
  }
}
