/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { FirebaseDocument, FirebaseService } from '@shared/services/firebase.service';
import { FirebaseDevUtils } from '@shared/utils/firebase-dev.utils';
import { Observable, of } from 'rxjs';
import { finalize, startWith } from 'rxjs/operators';

export interface InstagramPost extends FirebaseDocument {
  readonly SourceUrl: string;
  readonly Caption: string;
  readonly Url: string;
  readonly CreatedAt: {
    readonly seconds: number;
    readonly nanoseconds: number;
  };
}

@Component({
  selector: 'app-instagram',
  standalone: true,
  imports: [CommonModule, NgIcon, LazyLoadFadeDirective],
  templateUrl: './instagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramComponent implements OnInit {
  // Signals for reactive state management
  public readonly isLoading = signal(false);
  public readonly posts = signal<InstagramPost[]>([]);
  public readonly error = signal<string | null>(null);

  // Computed properties
  public readonly hasError = computed(() => this.error() !== null);
  public readonly hasPosts = computed(() => this.posts().length > 0);
  public readonly isEmpty = computed(() => !this.isLoading() && !this.hasError() && !this.hasPosts());

  // Observable for template compatibility
  public instagram$: Observable<InstagramPost[] | null> = of(null);

  private readonly firebaseService = inject(FirebaseService);
  private readonly firebaseDevUtils = inject(FirebaseDevUtils);
  private readonly cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.loadInstagramPosts();
  }

  /**
   * Load Instagram posts using Context7 Firebase utilities
   */
  private loadInstagramPosts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Analyze query for development insights
    this.firebaseDevUtils.analyzeQuery('instagram', {
      orderByField: 'CreatedAt',
      orderDirection: 'desc',
      limitCount: 6
    });

    // Create observable with performance profiling
    this.instagram$ = this.firebaseDevUtils
      .profileQuery('Instagram Posts Load', () =>
        this.firebaseDevUtils.getCollectionWithDevInsights<InstagramPost>('instagram', {
          orderByField: 'CreatedAt',
          orderDirection: 'desc',
          limitCount: 6
        })
      )
      .pipe(
        startWith(null),
        finalize(() => {
          this.isLoading.set(false);
          this.cdr.markForCheck();
        })
      );

    // Subscribe to update signals
    this.instagram$.subscribe({
      next: posts => {
        if (posts !== null) {
          // Validate data with development utilities
          const isValid = this.firebaseDevUtils.validateFirebaseData(posts, 'instagram', [
            'SourceUrl',
            'Caption',
            'Url',
            'CreatedAt'
          ]);

          if (isValid) {
            this.posts.set(posts);
            this.error.set(null);
          } else {
            this.error.set('Invalid Instagram data received');
          }
        }
      },
      error: error => {
        this.posts.set([]);
        this.error.set('Failed to load Instagram posts');
        console.error('Instagram component error:', error);
      }
    });
  }

  /**
   * Retry loading Instagram posts
   */
  public retryLoadPosts(): void {
    this.loadInstagramPosts();
  }

  /**
   * Get formatted date from Firestore timestamp
   */
  public getFormattedDate(createdAt: { seconds: number; nanoseconds: number }): Date {
    return new Date(createdAt.seconds * 1000);
  }
}
