import { Pipe, PipeTransform } from '@angular/core';
import { ceil, toNumber, toString } from 'lodash-es';

@Pipe({
  name: 'skill'
})
export class SkillPipe implements PipeTransform {
  public transform(value: any): number {
    const wildcard: number = toNumber(toString(value).slice(-1));
    if (value <= 0) {
      return 60 + wildcard;
    } else if (value <= 30) {
      return 60 + ceil((value + 1) / 10) * 10 + wildcard;
    } else {
      return 100;
    }
  }
}
