import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from './google-analytics.service';
import { AnalyticsHelperService } from './analytics-helper.service';

describe('AnalyticsHelperService', () => {
  let spectator: SpectatorService<AnalyticsHelperService>;
  let mockGoogleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  const createService = createServiceFactory({
    service: AnalyticsHelperService,
    mocks: [GoogleAnalyticsService]
  });

  beforeEach(() => {
    spectator = createService();
    mockGoogleAnalyticsService = spectator.inject(GoogleAnalyticsService);
  });

  describe('Service Creation', () => {
    it('should create the service', () => {
      expect(spectator.service).toBeTruthy();
    });
  });

  describe('Project Interaction Tracking', () => {
    it('should track project view with all parameters', () => {
      spectator.service.trackProjectInteraction('view', 'Test Project', 'Web Development');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'project_view',
        category: 'portfolio',
        label: 'Test Project',
        custom_parameters: {
          project_name: 'Test Project',
          project_category: 'Web Development',
          interaction_type: 'view'
        }
      });
    });

    it('should track project click with default category', () => {
      spectator.service.trackProjectInteraction('click', 'Another Project');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'project_click',
        category: 'portfolio',
        label: 'Another Project',
        custom_parameters: {
          project_name: 'Another Project',
          project_category: 'general',
          interaction_type: 'click'
        }
      });
    });

    it('should track demo interaction', () => {
      spectator.service.trackProjectInteraction('demo', 'Demo Project', 'Mobile App');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'project_demo',
        category: 'portfolio',
        label: 'Demo Project',
        custom_parameters: {
          project_name: 'Demo Project',
          project_category: 'Mobile App',
          interaction_type: 'demo'
        }
      });
    });

    it('should track source code interaction', () => {
      spectator.service.trackProjectInteraction('source', 'Source Project');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'project_source',
        category: 'portfolio',
        label: 'Source Project',
        custom_parameters: {
          project_name: 'Source Project',
          project_category: 'general',
          interaction_type: 'source'
        }
      });
    });
  });

  describe('Skill Interaction Tracking', () => {
    it('should track skill view with all parameters', () => {
      spectator.service.trackSkillInteraction('view', 'Angular', 'Frontend');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'skill_view',
        category: 'skills',
        label: 'Angular',
        custom_parameters: {
          skill_name: 'Angular',
          skill_category: 'Frontend',
          interaction_type: 'view'
        }
      });
    });

    it('should track skill filter without skill name', () => {
      spectator.service.trackSkillInteraction('filter');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'skill_filter',
        category: 'skills',
        label: 'general',
        custom_parameters: {
          skill_name: undefined,
          skill_category: undefined,
          interaction_type: 'filter'
        }
      });
    });

    it('should track skill expand', () => {
      spectator.service.trackSkillInteraction('expand', 'React', 'Frontend');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'skill_expand',
        category: 'skills',
        label: 'React',
        custom_parameters: {
          skill_name: 'React',
          skill_category: 'Frontend',
          interaction_type: 'expand'
        }
      });
    });
  });

  describe('Navigation Tracking', () => {
    it('should track navigation with default method', () => {
      spectator.service.trackNavigation('about');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'navigate',
        category: 'navigation',
        label: 'about',
        custom_parameters: {
          navigation_section: 'about',
          navigation_method: 'menu'
        }
      });
    });

    it('should track navigation with scroll method', () => {
      spectator.service.trackNavigation('skills', 'scroll');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'navigate',
        category: 'navigation',
        label: 'skills',
        custom_parameters: {
          navigation_section: 'skills',
          navigation_method: 'scroll'
        }
      });
    });

    it('should track navigation with direct method', () => {
      spectator.service.trackNavigation('contact', 'direct');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'navigate',
        category: 'navigation',
        label: 'contact',
        custom_parameters: {
          navigation_section: 'contact',
          navigation_method: 'direct'
        }
      });
    });
  });

  describe('Contact Form Tracking', () => {
    it('should track form start', () => {
      spectator.service.trackContactForm('start');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'contact_start',
        category: 'contact',
        label: 'form',
        custom_parameters: {
          form_action: 'start',
          form_field: undefined,
          error_message: undefined
        }
      });
    });

    it('should track form submit with field', () => {
      spectator.service.trackContactForm('submit', 'email');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'contact_submit',
        category: 'contact',
        label: 'email',
        custom_parameters: {
          form_action: 'submit',
          form_field: 'email',
          error_message: undefined
        }
      });
    });

    it('should track form error with message', () => {
      spectator.service.trackContactForm('error', 'name', 'Name is required');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'contact_error',
        category: 'contact',
        label: 'name',
        custom_parameters: {
          form_action: 'error',
          form_field: 'name',
          error_message: 'Name is required'
        }
      });
    });

    it('should track form success', () => {
      spectator.service.trackContactForm('success');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'contact_success',
        category: 'contact',
        label: 'form',
        custom_parameters: {
          form_action: 'success',
          form_field: undefined,
          error_message: undefined
        }
      });
    });
  });

  describe('Resume Download Tracking', () => {
    it('should track PDF resume download', () => {
      spectator.service.trackResumeDownload('pdf');

      expect(mockGoogleAnalyticsService.trackDownload).toHaveBeenCalledWith('resume.pdf', 'pdf');
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'download',
        category: 'resume',
        label: 'resume_pdf',
        custom_parameters: {
          download_type: 'resume',
          file_format: 'pdf'
        }
      });
    });

    it('should track DOC resume download', () => {
      spectator.service.trackResumeDownload('doc');

      expect(mockGoogleAnalyticsService.trackDownload).toHaveBeenCalledWith('resume.doc', 'doc');
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'download',
        category: 'resume',
        label: 'resume_doc',
        custom_parameters: {
          download_type: 'resume',
          file_format: 'doc'
        }
      });
    });

    it('should track default PDF resume download', () => {
      spectator.service.trackResumeDownload();

      expect(mockGoogleAnalyticsService.trackDownload).toHaveBeenCalledWith('resume.pdf', 'pdf');
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'download',
        category: 'resume',
        label: 'resume_pdf',
        custom_parameters: {
          download_type: 'resume',
          file_format: 'pdf'
        }
      });
    });
  });

  describe('Social Media Tracking', () => {
    it('should track GitHub click', () => {
      spectator.service.trackSocialClick('github', 'header');

      expect(mockGoogleAnalyticsService.trackSocialInteraction).toHaveBeenCalledWith('click', 'github', 'header');
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://github.com', 'github profile');
    });

    it('should track LinkedIn click without context', () => {
      spectator.service.trackSocialClick('linkedin');

      expect(mockGoogleAnalyticsService.trackSocialInteraction).toHaveBeenCalledWith('click', 'linkedin', undefined);
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://linkedin.com', 'linkedin profile');
    });

    it('should track all social platforms', () => {
      const platforms = ['twitter', 'instagram', 'facebook'] as const;
      
      platforms.forEach(platform => {
        spectator.service.trackSocialClick(platform, 'footer');
        
        expect(mockGoogleAnalyticsService.trackSocialInteraction).toHaveBeenCalledWith('click', platform, 'footer');
        expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(`https://${platform}.com`, `${platform} profile`);
      });
    });
  });

  describe('Theme Change Tracking', () => {
    let mockLocalStorage: jest.Mocked<Storage>;

    beforeEach(() => {
      mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn()
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    });

    it('should track light theme change', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      spectator.service.trackThemeChange('light');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'theme_change',
        category: 'preferences',
        label: 'light',
        custom_parameters: {
          theme_preference: 'light',
          previous_theme: 'dark'
        }
      });

      expect(mockGoogleAnalyticsService.setUserProperties).toHaveBeenCalledWith({
        preferred_theme: 'light'
      });
    });

    it('should track dark theme change', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      spectator.service.trackThemeChange('dark');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'theme_change',
        category: 'preferences',
        label: 'dark',
        custom_parameters: {
          theme_preference: 'dark',
          previous_theme: 'light'
        }
      });

      expect(mockGoogleAnalyticsService.setUserProperties).toHaveBeenCalledWith({
        preferred_theme: 'dark'
      });
    });

    it('should track auto theme change with light preference', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      spectator.service.trackThemeChange('auto');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'theme_change',
        category: 'preferences',
        label: 'auto',
        custom_parameters: {
          theme_preference: 'auto',
          previous_theme: 'auto'
        }
      });

      expect(mockGoogleAnalyticsService.setUserProperties).toHaveBeenCalledWith({
        preferred_theme: 'light'
      });
    });
  });

  describe('Performance Tracking', () => {
    let mockPerformance: any;

    beforeEach(() => {
      mockPerformance = {
        getEntriesByType: jest.fn()
      };
      Object.defineProperty(window, 'performance', { value: mockPerformance });
    });

    it('should track performance metrics when available', () => {
      const mockNavigationEntry = {
        fetchStart: 1000,
        loadEventEnd: 3000,
        domContentLoadedEventEnd: 2500
      };

      const mockPaintEntries = [
        { name: 'first-paint', startTime: 1500 }
      ];

      mockPerformance.getEntriesByType
        .mockReturnValueOnce([mockNavigationEntry])
        .mockReturnValueOnce(mockPaintEntries);

      spectator.service.trackPerformance();

      expect(mockGoogleAnalyticsService.trackTiming).toHaveBeenCalledWith({
        name: 'page_load_time',
        value: 2000,
        category: 'performance'
      });

      expect(mockGoogleAnalyticsService.trackTiming).toHaveBeenCalledWith({
        name: 'dom_content_loaded',
        value: 1500,
        category: 'performance'
      });

      expect(mockGoogleAnalyticsService.trackTiming).toHaveBeenCalledWith({
        name: 'first_paint',
        value: 1500,
        category: 'performance'
      });
    });

    it('should handle missing navigation timing', () => {
      mockPerformance.getEntriesByType.mockReturnValue([]);

      spectator.service.trackPerformance();

      expect(mockGoogleAnalyticsService.trackTiming).not.toHaveBeenCalled();
    });

    it('should handle missing performance API', () => {
      const originalPerformance = window.performance;
      delete (window as any).performance;

      spectator.service.trackPerformance();

      expect(mockGoogleAnalyticsService.trackTiming).not.toHaveBeenCalled();
      
      // Restore original performance object
      (window as any).performance = originalPerformance;
    });
  });

  describe('Engagement Tracking', () => {
    it('should track user engagement duration', () => {
      jest.spyOn(Date, 'now').mockReturnValue(5000);
      
      const startTime = 2000;
      
      spectator.service.trackEngagement(startTime);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'engagement',
        category: 'user_behavior',
        value: 3, // (5000 - 2000) / 1000
        custom_parameters: {
          engagement_duration: 3000,
          page_url: expect.any(String) // Don't test exact pathname since it's hard to mock
        }
      });
    });
  });

  describe('Scroll Depth Tracking', () => {
    it('should track 25% scroll milestone', () => {
      spectator.service.trackScrollDepth(26);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'scroll_depth',
        category: 'engagement',
        label: '25%',
        value: 25,
        custom_parameters: {
          scroll_percentage: 26,
          page_url: expect.any(String) // Don't test exact pathname since it's hard to mock
        }
      });
    });

    it('should track 100% scroll milestone', () => {
      spectator.service.trackScrollDepth(100);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'scroll_depth',
        category: 'engagement',
        label: '100%',
        value: 100,
        custom_parameters: {
          scroll_percentage: 100,
          page_url: expect.any(String) // Don't test exact pathname since it's hard to mock
        }
      });
    });

    it('should not track non-milestone percentages', () => {
      spectator.service.trackScrollDepth(35); // Between 25 and 50, but not within 5% of milestone

      expect(mockGoogleAnalyticsService.trackEvent).not.toHaveBeenCalled();
    });

    it('should track milestone within tolerance', () => {
      spectator.service.trackScrollDepth(52); // Within 5% of 50% milestone

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'scroll_depth',
        category: 'engagement',
        label: '50%',
        value: 50,
        custom_parameters: {
          scroll_percentage: 52,
          page_url: expect.any(String) // Don't test exact pathname since it's hard to mock
        }
      });
    });
  });

  describe('Portfolio Search Tracking', () => {
    it('should track search with results', () => {
      spectator.service.trackPortfolioSearch('angular project', 5);

      expect(mockGoogleAnalyticsService.trackSearch).toHaveBeenCalledWith('angular project', 5);
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'portfolio_search',
        category: 'search',
        label: 'angular project',
        value: 5,
        custom_parameters: {
          search_context: 'portfolio',
          has_results: true
        }
      });
    });

    it('should track search with no results', () => {
      spectator.service.trackPortfolioSearch('nonexistent project', 0);

      expect(mockGoogleAnalyticsService.trackSearch).toHaveBeenCalledWith('nonexistent project', 0);
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'portfolio_search',
        category: 'search',
        label: 'nonexistent project',
        value: 0,
        custom_parameters: {
          search_context: 'portfolio',
          has_results: false
        }
      });
    });
  });

  describe('Application Error Tracking', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Test Browser)',
        configurable: true
      });
    });

    it('should track application error with full details', () => {
      const error = new Error('Test error message');
      error.stack = 'Error stack trace here...';
      const errorInfo = { componentStack: 'Component stack trace' };

      spectator.service.trackApplicationError(error, errorInfo, 'TestComponent');

      expect(mockGoogleAnalyticsService.trackError).toHaveBeenCalledWith('Error: Test error message', true);
      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'application_error',
        category: 'errors',
        label: 'TestComponent',
        custom_parameters: {
          error_name: 'Error',
          error_message: 'Test error message',
          error_stack: 'Error stack trace here...',
          component_name: 'TestComponent',
          user_agent: 'Mozilla/5.0 (Test Browser)'
        }
      });
    });

    it('should handle error without component name', () => {
      const error = new Error('Another test error');
      error.stack = undefined;

      spectator.service.trackApplicationError(error);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'application_error',
        category: 'errors',
        label: 'unknown_component',
        custom_parameters: {
          error_name: 'Error',
          error_message: 'Another test error',
          error_stack: undefined,
          component_name: undefined,
          user_agent: 'Mozilla/5.0 (Test Browser)'
        }
      });
    });

    it('should truncate long stack traces', () => {
      const longStackTrace = 'a'.repeat(600);
      const error = new Error('Test error');
      error.stack = longStackTrace;

      spectator.service.trackApplicationError(error, null, 'TestComponent');

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_parameters: expect.objectContaining({
            error_stack: longStackTrace.substring(0, 500)
          })
        })
      );
    });
  });

  describe('API Call Tracking', () => {
    it('should track successful API call', () => {
      spectator.service.trackApiCall('/api/users', 'GET', 250, true, 200);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'api_success',
        category: 'api',
        label: 'GET /api/users',
        value: 250,
        custom_parameters: {
          api_endpoint: '/api/users',
          api_method: 'GET',
          api_duration: 250,
          api_status_code: 200,
          api_success: true
        }
      });

      expect(mockGoogleAnalyticsService.trackTiming).toHaveBeenCalledWith({
        name: 'api_get__api_users',
        value: 250,
        category: 'api_performance'
      });
    });

    it('should track failed API call', () => {
      spectator.service.trackApiCall('/api/posts', 'POST', 500, false, 400);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'api_error',
        category: 'api',
        label: 'POST /api/posts',
        value: 500,
        custom_parameters: {
          api_endpoint: '/api/posts',
          api_method: 'POST',
          api_duration: 500,
          api_status_code: 400,
          api_success: false
        }
      });

      expect(mockGoogleAnalyticsService.trackTiming).not.toHaveBeenCalled();
    });

    it('should sanitize endpoint names for timing', () => {
      spectator.service.trackApiCall('/api/users/123/posts', 'GET', 300, true, 200);

      expect(mockGoogleAnalyticsService.trackTiming).toHaveBeenCalledWith({
        name: 'api_get__api_users_123_posts',
        value: 300,
        category: 'api_performance'
      });
    });
  });

  describe('Private Methods', () => {
    it('should return correct social media URLs', () => {
      // Test the private method through public method calls
      spectator.service.trackSocialClick('github');
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://github.com', 'github profile');

      spectator.service.trackSocialClick('linkedin');
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://linkedin.com', 'linkedin profile');

      spectator.service.trackSocialClick('twitter');
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://twitter.com', 'twitter profile');

      spectator.service.trackSocialClick('instagram');
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://instagram.com', 'instagram profile');

      spectator.service.trackSocialClick('facebook');
      expect(mockGoogleAnalyticsService.trackExternalLink).toHaveBeenCalledWith('https://facebook.com', 'facebook profile');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values gracefully', () => {
      spectator.service.trackSkillInteraction('view', undefined, undefined);

      expect(mockGoogleAnalyticsService.trackEvent).toHaveBeenCalledWith({
        action: 'skill_view',
        category: 'skills',
        label: 'general',
        custom_parameters: {
          skill_name: undefined,
          skill_category: undefined,
          interaction_type: 'view'
        }
      });
    });

    it('should handle null values in performance tracking', () => {
      const mockPerformance = {
        getEntriesByType: jest.fn().mockReturnValue([null])
      };
      Object.defineProperty(window, 'performance', { value: mockPerformance });

      spectator.service.trackPerformance();

      expect(mockGoogleAnalyticsService.trackTiming).not.toHaveBeenCalled();
    });
  });
});