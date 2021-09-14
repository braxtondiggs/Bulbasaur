import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor(private analytics: AngularFireAnalytics) { }

  public eventEmitter(
    category: string,
    action: string,
    label: string = null,
    value: number = null) {
    this.analytics.logEvent(action, {
      category,
      label,
      value
    });
  }
}
