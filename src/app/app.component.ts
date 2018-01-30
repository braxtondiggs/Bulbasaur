import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private scroll: number;

  @HostListener('window:scroll', ['$event'])
  onScroll($event: Event): void {
    this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  isScroll(): boolean {
    return this.scroll > 75;
  }

}
