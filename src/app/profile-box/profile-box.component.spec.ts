import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SocialComponent } from '../social';
import { ProfileBoxComponent } from './profile-box.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';

describe('ProfileBoxComponent', () => {
  let spectator: Spectator<ProfileBoxComponent>;
  const createComponent = createComponentFactory({
    component: ProfileBoxComponent,
    declarations: [SocialComponent],
    imports: [AngularFireModule.initializeApp(environment.firebase), MatCardModule, MatIconModule, MatDialogModule]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have avatar element', () => {
    expect('.avatar').toExist();
  });
});
