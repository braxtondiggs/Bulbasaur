import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, isDevMode, OnDestroy, PLATFORM_ID } from '@angular/core';
import {
  Analytics,
  isSupported,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties
} from '@angular/fire/analytics';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// Types and interfaces for better type safety
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

export interface PageViewEvent {
  page_title?: string;
  page_location?: string;
  page_referrer?: string;
  page_path?: string;
  content_group1?: string;
  content_group2?: string;
  session_id?: string;
  timestamp?: number;
}

export interface UserProperties {
  user_type?: 'new' | 'returning';
  user_engagement_duration?: number;
  preferred_theme?: 'light' | 'dark';
  device_type?: 'mobile' | 'tablet' | 'desktop';
  [key: string]: string | number | boolean | undefined;
}

export interface TimingEvent {
  name: string;
  value: number;
  category?: string;
  label?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService implements OnDestroy {
  private readonly analytics = inject(Analytics);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();

  private readonly isEnabled$ = new BehaviorSubject<boolean>(true);
  private readonly isSupported$ = new BehaviorSubject<boolean>(false);
  private readonly debugMode = isDevMode();
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Enhanced tracking state
  private readonly sessionId: string;
  private userId?: string;
  private eventQueue: { event: string; parameters: Record<string, unknown> }[] = [];
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeService().catch(error => {
      this.logError('Failed to initialize service', error);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async initializeService(): Promise<void> {
    if (!this.isBrowser) {
      this.log('Analytics disabled: Not running in browser');
      return;
    }

    try {
      const supported = await isSupported();
      this.isSupported$.next(supported);

      if (supported) {
        this.setupConsentManagement();
        this.initializePageTracking();
        this.processEventQueue();
        this.isInitialized = true;
        this.log('Analytics service initialized successfully');
      } else {
        this.log('Analytics not supported in this browser');
      }
    } catch (error) {
      this.logError('Failed to initialize analytics service', error);
      this.isSupported$.next(false);
    }
  }

  /**
   * Initialize automatic page view tracking with enhanced metadata
   */
  private initializePageTracking(): void {
    if (!this.isBrowser) {
      return;
    }

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // Add delay to ensure DOM is updated
        setTimeout(() => {
          this.trackPageView({
            page_location: window.location.href,
            page_title: document.title,
            page_referrer: document.referrer,
            page_path: event.urlAfterRedirects,
            session_id: this.sessionId,
            timestamp: Date.now()
          });
        }, 100);
      });
  }

  /**
   * Setup consent management
   */
  private setupConsentManagement(): void {
    // Check for consent from localStorage or cookie
    const hasConsent = this.getAnalyticsConsent();
    this.setAnalyticsEnabled(hasConsent);
  }

  /**
   * Enhanced event tracking with validation and queuing
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isBrowser || !this.isSupported$.value) {
      this.log('Analytics not supported - event queued:', event);
      this.queueEvent(event.action, { event_category: event.category, ...event.custom_parameters });
      return;
    }

    if (!this.isEnabled$.value) {
      this.log('Analytics disabled - event not tracked:', event);
      return;
    }

    // Validate event parameters
    if (!this.validateEvent(event)) {
      this.logError('Invalid event parameters', event);
      return;
    }

    try {
      const eventParams: Record<string, unknown> = {
        event_category: event.category,
        session_id: this.sessionId,
        timestamp: Date.now(),
        ...(event.label && { event_label: event.label }),
        ...(event.value !== undefined && { value: event.value }),
        ...(event.custom_parameters && this.sanitizeParameters(event.custom_parameters))
      };

      if (this.isInitialized) {
        logEvent(this.analytics, event.action, eventParams);
        this.log('Event tracked:', { event: event.action, params: eventParams });
      } else {
        this.queueEvent(event.action, eventParams);
      }
    } catch (error) {
      this.logError('Error tracking event:', error);
      // Fallback: queue the event for retry
      this.queueEvent(event.action, { event_category: event.category });
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  public eventEmitter(
    category: string,
    action: string,
    label: string | null = null,
    value: number | null = null
  ): void {
    this.trackEvent({
      action,
      category,
      label: label || undefined,
      value: value || undefined
    });
  }

  /**
   * Track page views with enhanced parameters
   */
  public trackPageView(params: PageViewEvent = {}): void {
    if (!this.isEnabled$.value) {
      this.log('Analytics disabled - page view not tracked');
      return;
    }

    try {
      const pageParams = {
        page_title: document.title,
        page_location: window.location.href,
        page_referrer: document.referrer,
        ...params
      };

      logEvent(this.analytics, 'page_view', pageParams);
      this.log('Page view tracked:', pageParams);
    } catch (error) {
      this.logError('Error tracking page view:', error);
    }
  }

  /**
   * Track user interactions
   */
  public trackUserInteraction(action: string, element: string, value?: number): void {
    this.trackEvent({
      action: 'user_interaction',
      category: 'engagement',
      label: `${action}_${element}`,
      value,
      custom_parameters: {
        interaction_type: action,
        element_name: element
      }
    });
  }

  /**
   * Track timing events (performance monitoring)
   */
  public trackTiming(timing: TimingEvent): void {
    this.trackEvent({
      action: 'timing_complete',
      category: timing.category || 'performance',
      label: timing.name,
      value: timing.value,
      custom_parameters: {
        timing_name: timing.name,
        timing_value: timing.value
      }
    });
  }

  /**
   * Track errors and exceptions
   */
  public trackError(description: string, fatal = false): void {
    this.trackEvent({
      action: 'exception',
      category: 'errors',
      label: description,
      custom_parameters: {
        fatal,
        error_description: description
      }
    });
  }

  /**
   * Track social interactions
   */
  public trackSocialInteraction(action: string, network: string, target?: string): void {
    this.trackEvent({
      action: 'social_interaction',
      category: 'social',
      label: `${network}_${action}`,
      custom_parameters: {
        social_network: network,
        social_action: action,
        social_target: target
      }
    });
  }

  /**
   * Track file downloads
   */
  public trackDownload(fileName: string, fileType?: string): void {
    this.trackEvent({
      action: 'file_download',
      category: 'downloads',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        file_type: fileType
      }
    });
  }

  /**
   * Track external link clicks
   */
  public trackExternalLink(url: string, linkText?: string): void {
    this.trackEvent({
      action: 'click',
      category: 'external_links',
      label: url,
      custom_parameters: {
        link_url: url,
        link_text: linkText
      }
    });
  }

  /**
   * Track search queries
   */
  public trackSearch(searchTerm: string, results?: number): void {
    this.trackEvent({
      action: 'search',
      category: 'site_search',
      label: searchTerm,
      value: results,
      custom_parameters: {
        search_term: searchTerm,
        search_results: results
      }
    });
  }

  /**
   * Set user properties with validation
   */
  public setUserProperties(properties: UserProperties): void {
    if (!this.isBrowser || !this.isSupported$.value || !this.isEnabled$.value) {
      this.log('Cannot set user properties - analytics not available');
      return;
    }

    try {
      const sanitizedProperties = this.sanitizeParameters(properties);
      setUserProperties(this.analytics, sanitizedProperties);
      this.log('User properties set:', sanitizedProperties);
    } catch (error) {
      this.logError('Error setting user properties:', error);
    }
  }

  /**
   * Set user ID for cross-device tracking with validation
   */
  public setUserId(userId: string): void {
    if (!this.isBrowser || !this.isSupported$.value || !this.isEnabled$.value) {
      this.log('Cannot set user ID - analytics not available');
      return;
    }

    if (!userId || typeof userId !== 'string' || userId.length > 256) {
      this.logError('Invalid user ID provided', userId);
      return;
    }

    try {
      this.userId = userId;
      setUserId(this.analytics, userId);
      this.log('User ID set:', userId);
    } catch (error) {
      this.logError('Error setting user ID:', error);
    }
  }

  /**
   * Enable or disable analytics collection
   */
  public setAnalyticsEnabled(enabled: boolean): void {
    this.isEnabled$.next(enabled);

    if (!this.isBrowser || !this.isSupported$.value) {
      return;
    }

    try {
      setAnalyticsCollectionEnabled(this.analytics, enabled);
      this.log('Analytics collection enabled:', enabled);
    } catch (error) {
      this.logError('Error setting analytics collection state:', error);
    }
  }

  /**
   * Check analytics consent
   */
  private getAnalyticsConsent(): boolean {
    // Check localStorage for consent
    const consent = localStorage.getItem('analytics_consent');
    return consent === 'true';
  }

  /**
   * Set analytics consent
   */
  public setAnalyticsConsent(hasConsent: boolean): void {
    localStorage.setItem('analytics_consent', hasConsent.toString());
    this.setAnalyticsEnabled(hasConsent);
  }

  /**
   * Get analytics status
   */
  public isAnalyticsEnabled(): boolean {
    return this.isEnabled$.value;
  }

  /**
   * Track engagement event
   */
  public trackEngagement(action: string, target: string, duration?: number): void {
    this.trackEvent({
      action: 'engagement',
      category: 'user_engagement',
      label: `${action}_${target}`,
      value: duration,
      custom_parameters: {
        engagement_action: action,
        engagement_target: target,
        engagement_duration: duration
      }
    });
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(metric: string, value: number, category = 'performance'): void {
    this.trackEvent({
      action: 'performance_metric',
      category,
      label: metric,
      value,
      custom_parameters: {
        metric_name: metric,
        metric_value: value
      }
    });
  }

  /**
   * Utility method for consistent logging
   */
  private log(message: string, data?: unknown): void {
    if (this.debugMode) {
      // eslint-disable-next-line no-console
      console.log(`[GoogleAnalytics] ${message}`, data || '');
    }
  }

  /**
   * Utility method for error logging
   */
  private logError(message: string, error: unknown): void {
    if (this.debugMode) {
      console.error(`[GoogleAnalytics] ${message}`, error);
    }
  }

  // Helper methods for enhanced functionality
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateEvent(event: AnalyticsEvent): boolean {
    if (!event.action || typeof event.action !== 'string') {
      return false;
    }

    if (!event.category || typeof event.category !== 'string') {
      return false;
    }

    // Check action name length (GA4 limit)
    if (event.action.length > 40) {
      this.logError('Event action name too long (max 40 characters)', event.action);
      return false;
    }

    return true;
  }

  private sanitizeParameters(params: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params)) {
      // Skip undefined values
      if (value === undefined) continue;

      // Sanitize key
      const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 40);

      // Sanitize value based on type
      if (typeof value === 'string') {
        sanitized[sanitizedKey] = value.substring(0, 100); // GA4 string limit
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[sanitizedKey] = value;
      } else {
        sanitized[sanitizedKey] = String(value).substring(0, 100);
      }
    }

    return sanitized;
  }

  private queueEvent(eventName: string, parameters: Record<string, unknown>): void {
    this.eventQueue.push({ event: eventName, parameters });

    // Limit queue size
    if (this.eventQueue.length > 100) {
      this.eventQueue.shift(); // Remove oldest event
    }
  }

  private processEventQueue(): void {
    if (!this.isInitialized || this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    for (const { event, parameters } of events) {
      try {
        logEvent(this.analytics, event, parameters);
        this.log('Queued event processed:', { event, parameters });
      } catch (error) {
        this.logError('Error processing queued event:', error);
        // Re-queue failed events (up to 3 retries)
        const currentRetryCount = Number(parameters._retryCount || 0);
        if (currentRetryCount < 3) {
          parameters._retryCount = currentRetryCount + 1;
          this.queueEvent(event, parameters);
        }
      }
    }
  }
}
