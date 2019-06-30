import { Injectable } from '@angular/core';

declare let ga: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  public eventEmitter(
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {

    ga('send', 'event', {
      eventAction,
      eventCategory,
      eventLabel,
      eventValue
    });
  }
}
