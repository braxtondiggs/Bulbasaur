import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramComponent implements OnInit {
  public instagram$!: Observable<any>;
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.instagram$ = this.db.collection('instagram', ref => ref.orderBy('CreatedAt', 'desc').limit(6)).valueChanges();
  }
}
