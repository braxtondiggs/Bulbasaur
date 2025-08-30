import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { EMPTY, fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ScrollService implements OnDestroy {
  public scrollObs: Observable<any>;
  public resizeObs: Observable<any>;
  public pos = 0;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      // set initial value
      this.manageScrollPos();

      // create observable that we can subscribe to from component or directive
      this.scrollObs = fromEvent(window, 'scroll');

      // initiate subscription to update values
      this.scrollObs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.manageScrollPos());

      // create observable for changes in screen size
      this.resizeObs = fromEvent(window, 'resize');

      // initiate subscription to update values
      this.resizeObs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.manageScrollPos());
    } else {
      // Server-side: provide empty observables
      this.scrollObs = EMPTY;
      this.resizeObs = EMPTY;
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private manageScrollPos(): void {
    // update service property only in browser
    if (this.isBrowser) {
      this.pos = window.pageYOffset;
    }
  }
}
