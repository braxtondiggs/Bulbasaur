import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'skill'
})
export class SkillPipe implements PipeTransform {
  transform(value: any): number {
    const wildcard: number = _.toNumber(_.toString(value).slice(-1));
    if (value <= 0) {
      return 60 + wildcard;
    } else if (value < 10) {
      return 70 + wildcard;
    } else if (value < 20) {
      return 80 + wildcard;
    } else if (value < 30) {
      return 90 + wildcard;
    } else {
      return 100;
    }
  }
}
