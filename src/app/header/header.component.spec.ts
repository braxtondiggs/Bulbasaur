import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory(HeaderComponent);

  beforeEach(() => spectator = createComponent());

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have name in title', () => {
    expect('.header-title').toHaveText('Braxton Diggs');
  });
});
