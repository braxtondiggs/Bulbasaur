import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skill',
  standalone: true
})
export class SkillPipe implements PipeTransform {
  public transform(value: any): number {
    const valueStr = String(value);
    const wildcard: number = Number(valueStr.slice(-1)) || 0;
    const numValue = Number(value);
    
    if (numValue <= 0) {
      return 60 + wildcard;
    } else if (numValue <= 30) {
      return 60 + Math.ceil((numValue + 1) / 10) * 10 + wildcard;
    } else {
      return 100;
    }
  }
}
