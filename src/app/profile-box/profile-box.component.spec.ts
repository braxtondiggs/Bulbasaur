import { MatCardModule, MatDialogModule, MatIconModule } from '@angular/material';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SocialComponent } from '../social';
import { ProfileBoxComponent } from './profile-box.component';

describe('ProfileBoxComponent', () => {
  let spectator: Spectator<ProfileBoxComponent>;
  const createComponent = createComponentFactory({
    component: ProfileBoxComponent,
    declarations: [SocialComponent],
    imports: [MatCardModule, MatIconModule, MatDialogModule]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have avatar element', async () => {
    expect('.avatar').toExist();
  });
});
