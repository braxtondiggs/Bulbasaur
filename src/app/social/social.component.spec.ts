import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { SocialComponent } from './social.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';

describe('SocialComponent', () => {
  let spectator: Spectator<SocialComponent>;
  const createComponent = createComponentFactory({
    component: SocialComponent,
    imports: [AngularFireModule.initializeApp(environment.firebase), MatDialogModule],
    providers: [
      mockProvider(MatDialog, {
        open: () => jest.fn()
      })
    ],
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
