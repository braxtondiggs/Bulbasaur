/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { GoogleAnalyticsService } from '@shared/services';

@Directive({
  selector: '[AnalyticsTrack]',
  standalone: true
})
export class AnalyticsTrackDirective {
  @Input() public analyticsTrack!: string; // Event action
  @Input() public analyticsCategory = 'user_interaction'; // Event category
  @Input() public analyticsLabel?: string; // Event label
  @Input() public analyticsValue?: number; // Event value
  @Input() public analyticsCustomParams?: Record<string, string | number | boolean>; // Custom parameters

  private readonly ga = inject(GoogleAnalyticsService);
  private readonly elementRef = inject(ElementRef);

  @HostListener('click', ['$event'])
  // eslint-disable-next-line no-unused-vars
  public onClick(_event: Event): void {
    this.trackInteraction('click');
  }

  @HostListener('focus', ['$event'])
  // eslint-disable-next-line no-unused-vars
  public onFocus(_event: Event): void {
    this.trackInteraction('focus');
  }

  @HostListener('submit', ['$event'])
  // eslint-disable-next-line no-unused-vars
  public onSubmit(_event: Event): void {
    this.trackInteraction('submit');
  }

  private trackInteraction(interactionType: string): void {
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
