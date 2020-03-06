import { Injectable } from '@angular/core';
// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  public gtag = gtag;
  public eventEmitter(
    event_category: string,
    event_action: string,
    event_label: string = null,
    value: number = null) {
    this.gtag('event', event_action, {
      event_category,
      event_label,
      value
    });
  }
}
