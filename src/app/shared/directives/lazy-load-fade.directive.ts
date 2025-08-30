import { Directive, ElementRef, OnDestroy, OnInit, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyLoadFade]',
  standalone: true
})
export class LazyLoadFadeDirective implements OnInit, OnDestroy {
  public readonly src = input.required<string>({ alias: 'appLazyLoadFade' });
  public readonly alt = input<string>('');
  public readonly rootMargin = input<string>('50px');

  private observer!: IntersectionObserver;
  private readonly img!: HTMLImageElement;
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    this.img = this.el.nativeElement;
  }

  public ngOnInit(): void {
    // Set alt attribute
    this.img.alt = this.alt();

    if (!this.isBrowser) {
      // On server, just set the src immediately
      this.img.src = this.src();
      this.img.style.opacity = '1';
      return;
    }

    // Set initial state
    this.img.style.opacity = '0';
    this.img.style.transition = 'opacity 0.6s ease-in-out';

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver support
      this.loadImage();
      return;
    }

    // Create intersection observer
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
            this.observer.unobserve(this.img);
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
    this.observer.observe(this.img);
  }

  private loadImage(): void {
    if (!this.isBrowser) {
      // Server-side: just set the src immediately
      this.img.src = this.src();
      this.img.style.opacity = '1';
      return;
    }

    // Create a new image to preload
    // eslint-disable-next-line no-undef
    const imageLoader = new Image();

    imageLoader.onload = () => {
      // Set the src and fade in
      this.img.src = imageLoader.src;
      setTimeout(() => {
        this.img.style.opacity = '1';
      }, 10); // Small delay to ensure src is set
    };

    imageLoader.onerror = () => {
      console.warn(`Failed to load image: ${this.src()}`);
      this.img.style.opacity = '1'; // Show anyway in case of error
    };

    // Start loading
    imageLoader.src = this.src();
  }

  public ngOnDestroy(): void {
    if (this.isBrowser && this.observer) {
      this.observer.disconnect();
    }
  }
}
