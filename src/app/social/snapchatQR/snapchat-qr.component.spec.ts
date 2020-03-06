import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { SnapchatQRComponent } from './snapchat-qr.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('SnapchatQRComponent', () => {
  let spectator: Spectator<SnapchatQRComponent>;
  const createComponent = createComponentFactory({
    component: SnapchatQRComponent,
    imports: [MatDialogModule]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
