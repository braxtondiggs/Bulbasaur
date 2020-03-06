import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { SocialComponent } from './social.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';

describe('SocialComponent', () => {
  let spectator: Spectator<SocialComponent>;
  const createComponent = createComponentFactory({
    component: SocialComponent,
    imports: [AngularFireModule.initializeApp(environment.firebase), MatIconModule, MatDialogModule],
    providers: [
      mockProvider(MatDialog, {
        open: () => jest.fn()
      })
    ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should open a dialog', () => {
    const spy = spyOn(spectator.inject(MatDialog), 'open').and.callThrough();
    spectator.component.openSnapQR();
    expect(spy).toHaveBeenCalled();
  });
});
