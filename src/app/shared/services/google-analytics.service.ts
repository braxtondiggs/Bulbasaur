import { Injectable } from '@angular/core';
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  public eventEmitter(
    event_category: string,
    event_action: string,
    event_label: string = null,
    value: number = null) {
    gtag('event', event_action, {
      event_category,
      event_label,
      value
    });
  }
}
