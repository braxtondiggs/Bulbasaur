import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  @HostListener('window:scroll', ['$event'])
  onScrollEvent($event) {
    console.log($event);
    console.log('scrolling');
  }

  scrollToTop() {
    console.log('hi');
  }

}
