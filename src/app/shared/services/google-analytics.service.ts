import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private analytics = inject(Analytics);

  public eventEmitter(
    category: string,
    action: string,
    label: string = null,
    value: number = null
  ): void {
    logEvent(this.analytics, action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}
