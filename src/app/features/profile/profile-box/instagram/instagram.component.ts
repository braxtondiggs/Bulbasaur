import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, limit, orderBy, query } from '@angular/fire/firestore';
import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';

interface InstagramPost {
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
  public readonly instagram$: Observable<InstagramPost[] | null> = of(null);
  private readonly firestore = inject(Firestore);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeInstagramFeed();
  }

  private initializeInstagramFeed(): void {
    try {
      const instagramCollection = collection(this.firestore, 'instagram');
      const instagramQuery = query(
        instagramCollection, 
        orderBy('CreatedAt', 'desc'), 
        limit(6)
      );

      (this.instagram$ as any) = (collectionData(instagramQuery) as Observable<InstagramPost[]>).pipe(
        startWith(null),
        catchError((error: unknown) => {
          // Log error for monitoring in development but not detailed info in production
          if (error instanceof Error) {
            console.error('Failed to load Instagram data:', error.name);
          } else {
            console.error('Failed to load Instagram data: Unknown error');
          }
          return of([]);
        })
      );
      
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Instagram component initialization failed');
      (this.instagram$ as any) = of([]);
      this.cdr.markForCheck();
    }
  }
}
