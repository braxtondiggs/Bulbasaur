import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { InstagramComponent } from './instagram.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

describe('InstagramComponent', () => {
  let spectator: Spectator<InstagramComponent>;
  const createComponent = createComponentFactory({
    component: InstagramComponent,
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      LazyLoadImageModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatTooltipModule
    ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
  });
});
