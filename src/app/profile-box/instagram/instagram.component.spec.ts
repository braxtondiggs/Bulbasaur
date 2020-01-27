import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { InstagramComponent } from './instagram.component';
import { MatIconModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InstagramComponent', () => {
  let spectator: Spectator<InstagramComponent>;
  const createComponent = createComponentFactory({
    component: InstagramComponent,
    imports: [MatIconModule, MatProgressSpinnerModule, MatTooltipModule, HttpClientTestingModule]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
  });
});
