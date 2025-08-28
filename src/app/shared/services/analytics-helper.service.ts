import { Injectable, inject } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsHelperService {
  private ga = inject(GoogleAnalyticsService);

  /**
   * Track portfolio project interactions
   */
  public trackProjectInteraction(
    action: 'view' | 'click' | 'demo' | 'source',
    projectName: string,
    projectCategory?: string
  ): void {
    this.ga.trackEvent({
      action: `project_${action}`,
      category: 'portfolio',
      label: projectName,
      custom_parameters: {
        project_name: projectName,
        project_category: projectCategory || 'general',
        interaction_type: action
      }
    });
  }

  /**
   * Track skill-related interactions
   */
  public trackSkillInteraction(action: 'view' | 'filter' | 'expand', skillName?: string, skillCategory?: string): void {
    this.ga.trackEvent({
      action: `skill_${action}`,
      category: 'skills',
      label: skillName || 'general',
      custom_parameters: {
        skill_name: skillName,
        skill_category: skillCategory,
        interaction_type: action
      }
    });
  }

  /**
   * Track navigation events
   */
  public trackNavigation(section: string, method: 'menu' | 'scroll' | 'direct' = 'menu'): void {
    this.ga.trackEvent({
      action: 'navigate',
      category: 'navigation',
      label: section,
      custom_parameters: {
        navigation_section: section,
        navigation_method: method
      }
    });
  }

  /**
   * Track contact form interactions
   */
  public trackContactForm(
    action: 'start' | 'submit' | 'error' | 'success',
    formField?: string,
    errorMessage?: string
  ): void {
    this.ga.trackEvent({
      action: `contact_${action}`,
      category: 'contact',
      label: formField || 'form',
      custom_parameters: {
        form_action: action,
        form_field: formField,
        error_message: errorMessage
      }
    });
  }

  /**
   * Track resume/CV downloads
   */
  public trackResumeDownload(format: 'pdf' | 'doc' = 'pdf'): void {
    this.ga.trackDownload(`resume.${format}`, format);
    this.ga.trackEvent({
      action: 'download',
      category: 'resume',
      label: `resume_${format}`,
      custom_parameters: {
        download_type: 'resume',
        file_format: format
      }
    });
  }

  /**
   * Track social media interactions
   */
  public trackSocialClick(
    platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'facebook',
    context?: string
  ): void {
    this.ga.trackSocialInteraction('click', platform, context);
    this.ga.trackExternalLink(this.getSocialUrl(platform), `${platform} profile`);
  }

  /**
   * Track theme changes
   */
  public trackThemeChange(theme: 'light' | 'dark' | 'auto'): void {
    this.ga.trackEvent({
      action: 'theme_change',
      category: 'preferences',
      label: theme,
      custom_parameters: {
        theme_preference: theme,
        previous_theme: localStorage.getItem('theme') || 'auto'
      }
    });

    // Update user properties
    this.ga.setUserProperties({
      preferred_theme: theme === 'auto' ? 'light' : theme
    });
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        // Track page load time
        this.ga.trackTiming({
          name: 'page_load_time',
          value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          category: 'performance'
        });

        // Track DOM content loaded time
        this.ga.trackTiming({
          name: 'dom_content_loaded',
          value: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          category: 'performance'
        });

        // Track first paint if available
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        if (firstPaint) {
          this.ga.trackTiming({
            name: 'first_paint',
            value: Math.round(firstPaint.startTime),
            category: 'performance'
          });
        }
      }
    }
  }

  /**
   * Track user engagement duration
   */
  public trackEngagement(startTime: number): void {
    const engagementTime = Date.now() - startTime;

    this.ga.trackEvent({
      action: 'engagement',
      category: 'user_behavior',
      value: Math.round(engagementTime / 1000), // Convert to seconds
      custom_parameters: {
        engagement_duration: engagementTime,
        page_url: window.location.pathname
      }
    });
  }

  /**
   * Track scroll depth
   */
  public trackScrollDepth(percentage: number): void {
    // Only track meaningful milestones
    const milestones = [25, 50, 75, 90, 100];
    const milestone = milestones.find(m => percentage >= m && percentage < m + 5);

    if (milestone) {
      this.ga.trackEvent({
        action: 'scroll_depth',
        category: 'engagement',
        label: `${milestone}%`,
        value: milestone,
        custom_parameters: {
          scroll_percentage: percentage,
          page_url: window.location.pathname
        }
      });
    }
  }

  /**
   * Track search within portfolio
   */
  public trackPortfolioSearch(query: string, results: number): void {
    this.ga.trackSearch(query, results);
    this.ga.trackEvent({
      action: 'portfolio_search',
      category: 'search',
      label: query,
      value: results,
      custom_parameters: {
        search_context: 'portfolio',
        has_results: results > 0
      }
    });
  }

  /**
   * Track error boundaries and exceptions
   */
  public trackApplicationError(error: Error, errorInfo?: any, component?: string): void {
    this.ga.trackError(`${error.name}: ${error.message}`, true);

    this.ga.trackEvent({
      action: 'application_error',
      category: 'errors',
      label: component || 'unknown_component',
      custom_parameters: {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack?.substring(0, 500), // Limit stack trace length
        component_name: component,
        user_agent: navigator.userAgent
      }
    });
  }

  /**
   * Track API call performance and errors
   */
  public trackApiCall(endpoint: string, method: string, duration: number, success: boolean, statusCode?: number): void {
    this.ga.trackEvent({
      action: success ? 'api_success' : 'api_error',
      category: 'api',
      label: `${method} ${endpoint}`,
      value: Math.round(duration),
      custom_parameters: {
        api_endpoint: endpoint,
        api_method: method,
        api_duration: duration,
        api_status_code: statusCode,
        api_success: success
      }
    });

    // Track timing for successful requests
    if (success) {
      this.ga.trackTiming({
        name: `api_${method.toLowerCase()}_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`,
        value: Math.round(duration),
        category: 'api_performance'
      });
    }
  }

  /**
   * Helper method to get social media URLs
   */
  private getSocialUrl(platform: string): string {
    const urls = {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com'
    };
    return urls[platform as keyof typeof urls] || '#';
  }
}
