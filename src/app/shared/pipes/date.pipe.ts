import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(customParseFormat);

const dayjsConstructor = dayjs;

@Pipe({ name: 'amParse', standalone: true })
export class ParsePipe implements PipeTransform {
  transform(value: string | dayjs.Dayjs, formats?: string | string[]): dayjs.Dayjs {
    return dayjsConstructor(value, formats);
  }
}


@Pipe({ name: 'amDateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: dayjs.Dayjs, format: string): string {
    return value ? dayjsConstructor(value).format(format) : '';
  }
}

@Pipe({ name: 'amDifference', standalone: true })
export class DifferencePipe implements PipeTransform {
  transform(
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
