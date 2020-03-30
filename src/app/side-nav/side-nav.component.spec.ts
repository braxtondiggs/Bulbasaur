import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { SideNavComponent } from './side-nav.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';

describe('SideNavComponent', () => {
  let spectator: Spectator<SideNavComponent>;
  const createComponent = createComponentFactory({
    component: SideNavComponent,
    imports: [AngularFireModule.initializeApp(environment.firebase)],
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();
  });
});
