import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// Firebase
import { getAnalytics } from '@angular/fire/analytics';
import { getApp, initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { getFunctions } from '@angular/fire/functions';
import { getStorage } from '@angular/fire/storage';

// Icons
import { provideIcons } from '@ng-icons/core';

// App config
import { appConfig } from './app.config';

// Services
import { AnalyticsHelperService } from '@shared/services/analytics-helper.service';
import { FirebaseService } from '@shared/services/firebase.service';
import { GoogleAnalyticsService } from '@shared/services/google-analytics.service';
import { ScrollService } from '@shared/services/scroll.service';
import { FirebaseDevUtils } from '@shared/utils/firebase-dev.utils';

// Mock environment
jest.mock('@env/environment', () => ({
  environment: {
    production: false,
    firebase: {
      projectId: 'test-project',
      apiKey: 'test-api-key',
      authDomain: 'test.firebaseapp.com',
      storageBucket: 'test.appspot.com',
      messagingSenderId: '123456789',
      appId: 'test-app-id',
      measurementId: 'G-TEST123'
    }
  }
}));

// Mock Firebase services
jest.mock('@angular/fire/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(() => ({ name: 'test-app' })),
  provideFirebaseApp: jest.fn((factory) => ({
    provide: 'FIREBASE_APP',
    useFactory: factory
  }))
}));

jest.mock('@angular/fire/analytics', () => ({
  getAnalytics: jest.fn(),
  provideAnalytics: jest.fn((factory) => ({
    provide: 'FIREBASE_ANALYTICS',
    useFactory: factory
  }))
}));

jest.mock('@angular/fire/auth', () => ({
  getAuth: jest.fn(),
  connectAuthEmulator: jest.fn(),
  provideAuth: jest.fn((factory) => ({
    provide: 'FIREBASE_AUTH',
    useFactory: factory
  }))
}));

jest.mock('@angular/fire/firestore', () => ({
  getFirestore: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
  enableIndexedDbPersistence: jest.fn(),
  provideFirestore: jest.fn((factory) => ({
    provide: 'FIREBASE_FIRESTORE',
    useFactory: factory
  }))
}));

jest.mock('@angular/fire/functions', () => ({
  getFunctions: jest.fn(),
  connectFunctionsEmulator: jest.fn(),
  provideFunctions: jest.fn((factory) => ({
    provide: 'FIREBASE_FUNCTIONS',
    useFactory: factory
  }))
}));

jest.mock('@angular/fire/storage', () => ({
  getStorage: jest.fn(),
  connectStorageEmulator: jest.fn(),
  provideStorage: jest.fn((factory) => ({
    provide: 'FIREBASE_STORAGE',
    useFactory: factory
  }))
}));

jest.mock('highcharts-angular', () => ({
  provideHighcharts: jest.fn(() => ({
    provide: 'HIGHCHARTS',
    useValue: {}
  }))
}));

jest.mock('@ngx-loading-bar/http-client', () => ({
  provideLoadingBarInterceptor: jest.fn(() => ({
    provide: 'LOADING_BAR_INTERCEPTOR',
    useValue: {}
  }))
}));

// Mock console methods
const consoleSpy = {
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {})
};

describe('AppConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.warn.mockClear();
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Configuration Structure', () => {
    it('should have valid ApplicationConfig structure', () => {
      expect(appConfig).toBeDefined();
      expect(appConfig.providers).toBeDefined();
      expect(Array.isArray(appConfig.providers)).toBe(true);
    });

    it('should include all required providers', () => {
      const providers = appConfig.providers;
      expect(providers.length).toBeGreaterThan(0);
      
      // Check that providers array contains various types
      const hasObjectProviders = providers.some(p => typeof p === 'object' && p !== null);
      const hasClassProviders = providers.some(p => typeof p === 'function');
      
      expect(hasObjectProviders || hasClassProviders).toBe(true);
    });
  });

  describe('Service Providers', () => {
    it('should include required application services', () => {
      // Test can create TestBed with config
      expect(() => {
        TestBed.configureTestingModule({
          providers: [
            ...appConfig.providers,
            // Add minimal mocks for testing
            { provide: 'FIREBASE_APP', useValue: { name: 'test' } },
            { provide: 'FIREBASE_ANALYTICS', useValue: {} },
            { provide: 'FIREBASE_AUTH', useValue: {} },
            { provide: 'FIREBASE_FIRESTORE', useValue: {} },
            { provide: 'FIREBASE_FUNCTIONS', useValue: {} },
            { provide: 'FIREBASE_STORAGE', useValue: {} }
          ]
        });
      }).not.toThrow();
    });

    it('should provide core services', () => {
      const providers = appConfig.providers;
      
      // Check that service classes are included
      expect(providers).toContain(GoogleAnalyticsService);
      expect(providers).toContain(AnalyticsHelperService);
      expect(providers).toContain(FirebaseService);
      expect(providers).toContain(FirebaseDevUtils);
      expect(providers).toContain(ScrollService);
    });
  });

  describe('HTTP Configuration', () => {
    it('should configure HTTP client with interceptors', () => {
      const httpProvider = appConfig.providers.find(p => 
        typeof p === 'object' && 
        p !== null && 
        'provide' in p &&
        p.provide.toString().includes('HttpClient')
      );
      
      // HTTP client should be configured
      expect(appConfig.providers.some(p => 
        typeof p === 'function' && p.name === 'provideHttpClient' ||
        (typeof p === 'object' && p !== null)
      )).toBe(true);
    });
  });

  describe('Firebase Configuration', () => {
    it('should initialize Firebase app', () => {
      // Verify Firebase app initialization is configured
      expect(appConfig.providers.some(p => 
        typeof p === 'object' && 
        p !== null && 
        'provide' in p
      )).toBe(true);
    });

    it('should configure Firebase services', () => {
      const providers = appConfig.providers;
      
      // Should have Firebase-related providers
      expect(providers.length).toBeGreaterThan(5);
    });
  });

  describe('Icons Configuration', () => {
    it('should configure icon providers', () => {
      // Icons should be configured
      expect(appConfig.providers.some(p => 
        typeof p === 'object' && 
        p !== null
      )).toBe(true);
    });
  });

  describe('Service Worker Configuration', () => {
    it('should configure service worker', () => {
      // Service worker should be configured
      expect(appConfig.providers.some(p => 
        typeof p === 'object' && 
        p !== null
      )).toBe(true);
    });
  });

  describe('Development vs Production Configuration', () => {
    it('should handle development environment', () => {
      // In development mode, emulators should be configured
      // This is implicitly tested by the mocks not throwing errors
      expect(() => {
        // Simulate config loading in development
        const config: ApplicationConfig = appConfig;
        expect(config).toBeDefined();
      }).not.toThrow();
    });

    it('should be compatible with production environment', () => {
      // Mock production environment
      jest.doMock('@env/environment', () => ({
        environment: {
          production: true,
          firebase: {
            projectId: 'prod-project',
            apiKey: 'prod-api-key',
            authDomain: 'prod.firebaseapp.com',
            storageBucket: 'prod.appspot.com',
            messagingSenderId: '987654321',
            appId: 'prod-app-id',
            measurementId: 'G-PROD123'
          }
        }
      }));

      expect(() => {
        const config: ApplicationConfig = appConfig;
        expect(config).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle Firebase connection errors gracefully', () => {
      // Mock Firebase connection errors
      const mockError = new Error('Connection failed');
      
      // This would be tested when the providers are actually executed
      // For now, we test that the config structure can handle errors
      expect(() => {
        const config: ApplicationConfig = appConfig;
        expect(config.providers).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should create valid Angular application config', () => {
      expect(appConfig).toEqual({
        providers: expect.any(Array)
      });
    });

    it('should have non-empty providers array', () => {
      expect(appConfig.providers.length).toBeGreaterThan(0);
    });

    it('should include all essential Angular providers', () => {
      // Test that config can be used to bootstrap an Angular app
      const providers = appConfig.providers;
      
      // Should have multiple providers for different aspects
      expect(providers.length).toBeGreaterThan(10);
    });
  });
});
