import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-instagram',
  styleUrls: ['./instagram.component.scss'],
  templateUrl: './instagram.component.html'
})
export class InstagramComponent implements OnInit {
  public instagram$: Observable<any>;
  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.instagram$ = this.db.collection('instagram', ref => ref.orderBy('CreatedAt', 'desc').limit(6)).valueChanges();
  }
}
