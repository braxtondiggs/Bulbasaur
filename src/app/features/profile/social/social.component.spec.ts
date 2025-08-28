import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherFacebook, featherGithub, featherInstagram, featherMail } from '@ng-icons/feather-icons';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from '@shared/services';
import { SocialComponent } from './social.component';

describe('SocialComponent', () => {
  let spectator: Spectator<SocialComponent>;
  let mockGA: jest.Mocked<GoogleAnalyticsService>;

  const createComponent = createComponentFactory({
    component: SocialComponent,
    imports: [NgIcon],
    providers: [
      mockProvider(GoogleAnalyticsService, {
        eventEmitter: jest.fn()
      }),
      provideIcons({
        featherFacebook,
        featherGithub,
        featherInstagram,
        featherMail
      })
    ],
    shallow: true,
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent();
    mockGA = spectator.inject(GoogleAnalyticsService) as jest.Mocked<GoogleAnalyticsService>;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have a GoogleAnalyticsService', () => {
    expect(spectator.component.ga).toBeTruthy();
  });

  it('should render social media links', () => {
    const links = spectator.queryAll('a');
    expect(links.length).toBeGreaterThanOrEqual(4); // At minimum Facebook, GitHub, Instagram, Mail
  });

  it('should call Google Analytics when social links are clicked', () => {
    const facebookLink = spectator.query('a[aria-label="Facebook"]');
    const githubLink = spectator.query('a[aria-label="Github"]');

    if (facebookLink) {
      spectator.click(facebookLink);
      expect(mockGA.trackEvent).toHaveBeenCalledWith({
        event_name: 'social_click',
        event_category: 'Social',
        event_label: 'facebook'
      });
    }

    if (githubLink) {
      spectator.click(githubLink);
      expect(mockGA.trackEvent).toHaveBeenCalledWith({
        event_name: 'social_click',
        event_category: 'Social',
        event_label: 'github'
      });
    }
  });

  it('should have proper accessibility attributes', () => {
    const links = spectator.queryAll('a');

    links.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel');
    });
  });

  it('should have DaisyUI button classes', () => {
    const links = spectator.queryAll('a');

    links.forEach(link => {
      expect(link).toHaveClass('btn');
    });
  });

  it('should have icons in social links', () => {
    const icons = spectator.queryAll('ng-icon');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });

  it('should handle analytics errors gracefully', () => {
    mockGA.trackEvent.mockImplementation(() => {
      throw new Error('Analytics error');
    });

    const link = spectator.query('a');
    if (link) {
      expect(() => {
        spectator.click(link);
      }).not.toThrow();
    }
  });
});
