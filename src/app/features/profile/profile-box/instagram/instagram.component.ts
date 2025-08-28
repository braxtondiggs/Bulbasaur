import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { Firestore, collection, collectionData, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    // Create collection reference
    const instagramCollection = collection(this.firestore, 'instagram');

    // Create query with ordering and limit
    const instagramQuery = query(
      instagramCollection,
      orderBy('CreatedAt', 'desc'),
      limit(6)
    );

    // Get observable data stream
    this.instagram$ = (collectionData(instagramQuery) as Observable<InstagramPost[]>).pipe(
      tap(() => {
        // Ensure change detection runs when data arrives with OnPush strategy
        this.cdr.markForCheck();
      })
    );

    this.instagram$.subscribe(console.log);
  }
}
