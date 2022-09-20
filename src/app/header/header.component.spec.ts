import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory(HeaderComponent);

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have name in title', () => {
    expect(spectator.query('.header-title')).toHaveText('Braxton Diggs');
  });
});
