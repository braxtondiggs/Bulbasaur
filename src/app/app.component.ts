import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { SocketService } from './shared/services/socket.service';
import { ITrack, Event } from './shared/model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public scroll: number;
  public track: ITrack;
  public duration: number = 0;
  constructor(private socketService: SocketService) { }

  @HostListener('window:scroll', ['$event'])
  public onScroll($event: Event): void {
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  public ngOnInit() {
    this.socketService.initSocket();
    this.socketService.onMessage().subscribe((track: ITrack) => {
      this.track = track;
      this.initTrackFlow();
    });
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
