import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { GoogleAnalyticsService } from '@shared/services';

@Directive({
  selector: '[analyticsTrack]',
  standalone: true
})
export class AnalyticsTrackDirective {
  @Input() analyticsTrack!: string; // Event action
  @Input() analyticsCategory = 'user_interaction'; // Event category
  @Input() analyticsLabel?: string; // Event label
  @Input() analyticsValue?: number; // Event value
  @Input() analyticsCustomParams?: Record<string, string | number | boolean>; // Custom parameters

  private ga = inject(GoogleAnalyticsService);
  private elementRef = inject(ElementRef);

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    this.trackInteraction('click', event);
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    this.trackInteraction('focus', event);
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: Event): void {
    this.trackInteraction('submit', event);
  }

  private trackInteraction(interactionType: string, event: Event): void {
    const element = this.elementRef.nativeElement;
    const elementType = element.tagName.toLowerCase();
    const elementId = element.id || 'unknown';
    const elementClass = element.className || '';

    const label = this.analyticsLabel || `${interactionType}_${elementType}_${elementId}`;

    this.ga.trackEvent({
      action: this.analyticsTrack || `${interactionType}_${elementType}`,
      category: this.analyticsCategory,
      label,
      value: this.analyticsValue,
      custom_parameters: {
        interaction_type: interactionType,
        element_type: elementType,
        element_id: elementId,
        element_class: elementClass,
        ...this.analyticsCustomParams
      }
    });
  }
}
