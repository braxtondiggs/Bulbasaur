import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(customParseFormat);

const dayjsConstructor = dayjs;

@Pipe({ name: 'amParse', standalone: true })
export class ParsePipe implements PipeTransform {
  public transform(value: string | dayjs.Dayjs, formats?: string | string[]): dayjs.Dayjs {
    return dayjsConstructor(value, formats);
  }
}
