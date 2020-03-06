import { Component, HostListener, ViewEncapsulation, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { GoogleAnalyticsService } from './shared/services';
import { skip } from 'rxjs/operators';
import { ITrack } from './shared/model';
import 'firebase/firestore';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public scroll: number;
  public track: ITrack;
  public trackLink: SafeResourceUrl;
  public duration: number;
  constructor(private afs: AngularFirestore, public ga: GoogleAnalyticsService, private sanitizer: DomSanitizer) { }

  @HostListener('window:scroll', ['$event'])
  public onScroll(): void {
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  ngOnInit() {
    this.afs.collection('tracks', ref => ref.limit(1)).snapshotChanges(['added']).pipe(skip(1)).subscribe((snapshot) => {
      this.track = snapshot[0].payload.doc.data() as any;
      this.trackLink =
        this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${this.track.id}`);
      this.initTrackFlow();
    });
  }

  public isScroll(): boolean {
    return this.scroll > 75;
  }

  private initTrackFlow() {
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
}
