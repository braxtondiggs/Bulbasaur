import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ScrollService implements OnDestroy {
  public scrollObs: Observable<any>;
  public resizeObs: Observable<any>;
  public pos: number;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
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
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private manageScrollPos(): void {
    // update service property
    this.pos = window.pageYOffset;
  }
}
