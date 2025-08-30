import { Directive, ElementRef, OnDestroy, OnInit, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyBackgroundFade]',
  standalone: true
})
export class LazyBackgroundFadeDirective implements OnInit, OnDestroy {
  public readonly backgroundUrl = input.required<string>({ alias: 'appLazyBackgroundFade' });
  public readonly rootMargin = input<string>('50px');

  private observer!: IntersectionObserver;
  private readonly element!: HTMLElement;
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    this.element = this.el.nativeElement;
  }

  public ngOnInit(): void {
    if (!this.isBrowser) {
      // On server, just set the background image immediately
      this.element.style.backgroundImage = `url(${this.backgroundUrl()})`;
      this.element.style.opacity = '1';
      return;
    }

    // Set initial state
    this.element.style.opacity = '0';
    this.element.style.transition = 'opacity 0.6s ease-in-out';

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver support
      this.loadBackgroundImage();
      return;
    }

    // Create intersection observer
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadBackgroundImage();
            this.observer.unobserve(this.element);
          }
        });
      },
      {
        root: null,
        rootMargin: this.rootMargin(),
        threshold: 0.1
      }
    );

    // Start observing
    this.observer.observe(this.element);
  }

  private loadBackgroundImage(): void {
    if (!this.isBrowser) {
      // Server-side: just set the background immediately
      this.element.style.backgroundImage = `url(${this.backgroundUrl()})`;
      this.element.style.opacity = '1';
      return;
    }

    // Create a new image to preload the background
    // eslint-disable-next-line no-undef
    const imageLoader = new Image();

    imageLoader.onload = () => {
      // Set the background image and fade in
      this.element.style.backgroundImage = `url(${this.backgroundUrl()})`;
      setTimeout(() => {
        this.element.style.opacity = '1';
      }, 10); // Small delay to ensure background is set
    };

    imageLoader.onerror = () => {
      console.warn(`Failed to load background image: ${this.backgroundUrl()}`);
      this.element.style.opacity = '1'; // Show anyway in case of error
    };

    // Start loading
    imageLoader.src = this.backgroundUrl();
  }

  public ngOnDestroy(): void {
    if (this.isBrowser && this.observer) {
      this.observer.disconnect();
    }
  }
}
