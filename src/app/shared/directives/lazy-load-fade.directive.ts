import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

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

  constructor() {
    this.img = this.el.nativeElement;
  }

  public ngOnInit(): void {
    // Set initial state
    this.img.style.opacity = '0';
    this.img.style.transition = 'opacity 0.6s ease-in-out';
    this.img.alt = this.alt();

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
    // Create a new image to preload
    const imageLoader = new window.Image();

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
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
