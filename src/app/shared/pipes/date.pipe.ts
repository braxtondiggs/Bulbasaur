import { Pipe, PipeTransform } from '@angular/core';
import * as customParseFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
dayjs.extend(customParseFormat);

const dayjsConstructor = dayjs;

@Pipe({ name: 'amParse' })
export class ParsePipe implements PipeTransform {
  transform(value: string | dayjs.Dayjs, formats?: string | string[]): dayjs.Dayjs {
    return dayjsConstructor(value, formats);
  }
}


@Pipe({ name: 'amDateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: dayjs.Dayjs, format: string): string {
    return value ? dayjsConstructor(value).format(format) : '';
  }
}

@Pipe({ name: 'amDifference' })
export class DifferencePipe implements PipeTransform {
  transform(
    value: dayjs.Dayjs,
    otherValue: dayjs.Dayjs,
    unit?: dayjs.QUnitType,
    precision?: boolean
  ): number {
    const date = dayjsConstructor(value);
    const date2 = otherValue !== null ? dayjsConstructor(otherValue) : dayjsConstructor();

    return date.diff(date2, unit, precision);
  }
}
