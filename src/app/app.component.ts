import { Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private scroll: number;

  @HostListener('window:scroll', ['$event'])
  public onScroll($event: Event): void {
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  public isScroll(): boolean {
    return this.scroll > 75;
  }
}
