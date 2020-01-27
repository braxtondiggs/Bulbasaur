import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { SideNavComponent } from './side-nav.component';
import { MatIconModule } from '@angular/material/icon';

describe('SideNavComponent', () => {
  let spectator: Spectator<SideNavComponent>;
  const createComponent = createComponentFactory({
    component: SideNavComponent,
    imports: [MatIconModule]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();
  });
});
