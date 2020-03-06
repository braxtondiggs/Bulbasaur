import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { InstagramComponent } from './instagram.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

describe('InstagramComponent', () => {
  let spectator: Spectator<InstagramComponent>;
  const createComponent = createComponentFactory({
    component: InstagramComponent,
    imports: [MatIconModule, MatProgressSpinnerModule, MatTooltipModule, HttpClientTestingModule]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
  });
});
