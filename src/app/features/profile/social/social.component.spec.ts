import { NgIcon } from '@ng-icons/core';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from '@shared/services';
import { SocialComponent } from './social.component';

describe('SocialComponent', () => {
  let spectator: Spectator<SocialComponent>;
  const createComponent = createComponentFactory({
    component: SocialComponent,
    imports: [NgIcon],
    providers: [
      mockProvider(GoogleAnalyticsService, {
        eventEmitter: jest.fn()
      })
    ],
    shallow: true
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have a GoogleAnalyticsService', () => {
    expect(spectator.component.ga).toBeTruthy();
  });

  it('should render social media links', () => {
    expect(spectator.queryAll('a')).toHaveLength(5); // Facebook, GitHub, Instagram, Mail, SoundCloud
  });

  it('should call Google Analytics when social links are clicked', () => {
    const facebookLink = spectator.query('a[aria-label="Facebook"]');
    const githubLink = spectator.query('a[aria-label="Github"]');

    expect(facebookLink).toBeTruthy();
    expect(githubLink).toBeTruthy();

    spectator.click(facebookLink!);
    expect(spectator.component.ga.eventEmitter).toHaveBeenCalledWith('social', 'facebook');

    spectator.click(githubLink!);
    expect(spectator.component.ga.eventEmitter).toHaveBeenCalledWith('social', 'github');
  });

  it('should have proper accessibility attributes', () => {
    const links = spectator.queryAll('a');

    links.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
      expect(link).toHaveAttribute('title');
    });
  });

  it('should have DaisyUI button classes', () => {
    const links = spectator.queryAll('a');

    links.forEach(link => {
      expect(link).toHaveClass('btn');
      expect(link).toHaveClass('btn-ghost');
      expect(link).toHaveClass('btn-circle');
    });
  });
});
