import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { SocialComponent } from './social.component';
import { MatIconModule, MatDialogModule, MatDialog } from '@angular/material';

describe('SocialComponent', () => {
  let spectator: Spectator<SocialComponent>;
  const createComponent = createComponentFactory({
    component: SocialComponent,
    imports: [MatIconModule, MatDialogModule],
    providers: [
      mockProvider(MatDialog, {
        open: () => 'do something'
      })
    ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should open a dialog', async () => {
    // spyOn(spectator.component.dis, 'open')
    spectator.component.openSnapQR();
  });
});
