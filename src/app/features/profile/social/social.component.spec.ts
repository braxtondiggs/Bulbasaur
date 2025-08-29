import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgIcon } from '@ng-icons/core';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { SocialComponent } from './social.component';

describe('SocialComponent', () => {
  let spectator: Spectator<SocialComponent>;
  let analyticsHelperService: jest.Mocked<AnalyticsHelperService>;
  let googleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  const createComponent = createComponentFactory({
    component: SocialComponent,
    imports: [NgIcon, testNgIconsModule],
    providers: [
      {
        provide: AnalyticsHelperService,
        useValue: {
          trackSocialClick: jest.fn()
        }
      },
      {
        provide: GoogleAnalyticsService,
        useValue: {
          trackEvent: jest.fn(),
          trackExternalLink: jest.fn()
        }
      }
    ],
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
    analyticsHelperService = spectator.inject(AnalyticsHelperService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component.constructor.name).toBe('SocialComponent');
    });
  });

  describe('Social Platform Tracking', () => {
    it('should track GitHub click', () => {
      spectator.component.trackSocialClick('github');

      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith('github', 'profile');
    });

    it('should track LinkedIn click', () => {
      spectator.component.trackSocialClick('linkedin');

      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith('linkedin', 'profile');
    });

    it('should track Twitter click', () => {
      spectator.component.trackSocialClick('twitter');

      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith('twitter', 'profile');
    });

    it('should track Instagram click', () => {
      spectator.component.trackSocialClick('instagram');

      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith('instagram', 'profile');
    });

    it('should track Facebook click', () => {
      spectator.component.trackSocialClick('facebook');

      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith('facebook', 'profile');
    });
  });

  describe('Email Tracking', () => {
    it('should track email click with correct parameters', () => {
      spectator.component.trackEmailClick();

      expect(googleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'click',
        category: 'contact',
        label: 'email_link',
        custom_parameters: {
          contact_method: 'email',
          context: 'profile'
        }
      });
    });
  });

  describe('External Link Tracking', () => {
    it('should track external link with platform and URL', () => {
      const platform = 'github';
      const url = 'https://github.com/user';

      spectator.component.trackExternalLink(platform, url);

      expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(url, platform);
    });

    it('should handle different platforms and URLs', () => {
      const testCases = [
        { platform: 'linkedin', url: 'https://linkedin.com/in/user' },
        { platform: 'twitter', url: 'https://twitter.com/user' },
        { platform: 'instagram', url: 'https://instagram.com/user' }
      ];

      testCases.forEach(({ platform, url }) => {
        spectator.component.trackExternalLink(platform, url);
        expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(url, platform);
      });

      expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledTimes(testCases.length);
    });
  });

  describe('Service Injection', () => {
    it('should inject AnalyticsHelperService', () => {
      expect(analyticsHelperService).toBeDefined();
    });

    it('should inject GoogleAnalyticsService', () => {
      expect(googleAnalyticsService).toBeDefined();
    });

    it('should have public access to GoogleAnalyticsService', () => {
      expect(spectator.component.ga).toBeDefined();
      expect(spectator.component.ga).toBe(googleAnalyticsService);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full social interaction tracking', () => {
      // Test multiple social platform clicks
      const platforms: Array<'github' | 'linkedin' | 'twitter' | 'instagram' | 'facebook'> = [
        'github', 'linkedin', 'twitter', 'instagram', 'facebook'
      ];

      platforms.forEach(platform => {
        spectator.component.trackSocialClick(platform);
      });

      // Test email click
      spectator.component.trackEmailClick();

      // Test external link tracking
      spectator.component.trackExternalLink('github', 'https://github.com/user');

      // Verify all tracking calls
      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledTimes(platforms.length);
      expect(googleAnalyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledTimes(1);

      // Verify specific calls
      platforms.forEach(platform => {
        expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith(platform, 'profile');
      });
    });

    it('should handle rapid successive clicks', () => {
      // Simulate rapid clicking
      for (let i = 0; i < 5; i++) {
        spectator.component.trackSocialClick('github');
      }

      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledTimes(5);
      expect(analyticsHelperService.trackSocialClick).toHaveBeenCalledWith('github', 'profile');
    });
  });

  describe('Type Safety', () => {
    it('should only accept valid platform types for trackSocialClick', () => {
      // These should compile without TypeScript errors
      const validPlatforms: Array<'github' | 'linkedin' | 'twitter' | 'instagram' | 'facebook'> = [
        'github', 'linkedin', 'twitter', 'instagram', 'facebook'
      ];

      validPlatforms.forEach(platform => {
        expect(() => spectator.component.trackSocialClick(platform)).not.toThrow();
      });
    });

    it('should accept any string for trackExternalLink platform parameter', () => {
      const customPlatforms = ['custom-platform', 'another-site', 'blog'];

      customPlatforms.forEach(platform => {
        expect(() => spectator.component.trackExternalLink(platform, 'https://example.com')).not.toThrow();
      });
    });
  });
});
