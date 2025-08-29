import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

const dayjsConstructor = dayjs;

@Pipe({ name: 'amDifference', standalone: true })
export class DifferencePipe implements PipeTransform {
  public transform(
    value: dayjs.Dayjs | string,
    otherValue: dayjs.Dayjs | string,
    unit?: dayjs.QUnitType,
    precision?: boolean
  ): number {
    const date = dayjsConstructor(value);
    const date2 = otherValue !== null ? dayjsConstructor(otherValue) : dayjsConstructor();

    return date.diff(date2, unit, precision);
  }
}
