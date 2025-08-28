import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { Firestore, collection, collectionData, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { tap, catchError, startWith } from 'rxjs/operators';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';

interface InstagramPost {
  SourceUrl: string;
  Caption: string;
  Url: string;
  CreatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

@Component({
  selector: 'app-instagram',
  standalone: true,
  imports: [
    CommonModule,
    NgIconsModule,
    LazyLoadFadeDirective
  ],
  templateUrl: './instagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramComponent implements OnInit {
  public instagram$!: Observable<InstagramPost[]>;
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    try {
      // Create collection reference
      const instagramCollection = collection(this.firestore, 'instagram');

      // Create query with ordering and limit
      const instagramQuery = query(
        instagramCollection,
        orderBy('CreatedAt', 'desc'),
        limit(6)
      );

      // Get observable data stream with error handling and timeout
      this.instagram$ = (collectionData(instagramQuery) as Observable<InstagramPost[]>).pipe(
        startWith(null), // Start with null to handle initial loading state
        tap((data) => {
          console.log('Instagram data loaded:', data);
          // Ensure change detection runs when data arrives with OnPush strategy
          this.cdr.markForCheck();
        }),
        catchError((error) => {
          console.error('Instagram Firestore error:', error);
          console.log('Falling back to empty state due to error');
          // Return empty array on error to show empty state instead of loading
          return of([]);
        })
      );
    } catch (error) {
      console.error('Instagram component initialization error:', error);
      // Fallback to empty observable if initialization fails
      this.instagram$ = of([]);
      this.cdr.markForCheck();
    }
  }
}
