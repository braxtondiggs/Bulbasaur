import { Directive, ElementRef, OnInit, OnDestroy, input } from '@angular/core';

@Directive({
  selector: '[appLazyBackgroundFade]',
  standalone: true
})
export class LazyBackgroundFadeDirective implements OnInit, OnDestroy {
  backgroundUrl = input.required<string>({ alias: 'appLazyBackgroundFade' });
  rootMargin = input<string>('50px');
  
  private observer!: IntersectionObserver;
  private element!: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    // Set initial state
    this.element.style.opacity = '0';
    this.element.style.transition = 'opacity 0.6s ease-in-out';
    
    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
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

  private loadBackgroundImage() {
    // Create a new image to preload the background
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

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}