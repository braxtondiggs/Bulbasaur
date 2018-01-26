import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'side-nav',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
