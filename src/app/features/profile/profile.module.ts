import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// Profile Components
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { InstagramComponent } from './profile-box/instagram/instagram.component';
import { SocialComponent } from './social/social.component';

// Firebase for Instagram component
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';

const PROFILE_COMPONENTS = [
  ProfileBoxComponent,
  InstagramComponent,
  SocialComponent
];

@NgModule({
  declarations: [
    ...PROFILE_COMPONENTS
  ],
  imports: [
    SharedModule,
    AngularFirestoreModule,
    AngularFireAnalyticsModule
  ],
  exports: [
    ...PROFILE_COMPONENTS
  ]
})
export class ProfileModule { }