import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { GoogleAnalyticsService } from './shared/services';
import { ITrack } from './shared/model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public scroll: number;
  public track: ITrack;
  public duration = 0;
  constructor(public ga: GoogleAnalyticsService) { }

  @HostListener('window:scroll', ['$event'])
  public onScroll(): void {
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  public initTrackFlow() {
    let x = 0;
    setTimeout(() => {
      this.track = null;
      clearInterval(trackDuration);
      this.duration = 0;
      x = 0;
    }, this.track.duration);
    const trackDuration = setInterval(() => {
      x++;
      this.duration = (x / (this.track.duration / 250)) * 100;
    }, 250);
  }

  public isScroll(): boolean {
    return this.scroll > 75;
  }
}
