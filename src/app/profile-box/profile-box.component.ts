import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss']
})
export class ProfileBoxComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  showPDF() {
    window.open('assets/resume/braxton-diggs.pdf', '_blank');
  }
}
