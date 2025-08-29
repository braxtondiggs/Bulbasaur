import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { enableIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideHighcharts } from 'highcharts-angular';

// Loading bar
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';

// Icons
import { provideIcons } from '@ng-icons/core';
import {
  featherActivity,
  featherBriefcase,
  featherChevronsUp,
  featherCode,
  featherDownload,
  featherEdit,
  featherExternalLink,
  featherFacebook,
  featherGithub,
  featherHeart,
  featherInstagram,
  featherMail,
  featherSend,
  featherX
} from '@ng-icons/feather-icons';

// Environment
import { environment } from '@env/environment';

// Services
import { AnalyticsHelperService } from '@shared/services/analytics-helper.service';
import { FirebaseService } from '@shared/services/firebase.service';
import { GoogleAnalyticsService } from '@shared/services/google-analytics.service';
import { ScrollService } from '@shared/services/scroll.service';
import { FirebaseDevUtils } from '@shared/utils/firebase-dev.utils';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core providers
    provideHttpClient(withInterceptorsFromDi()),
    provideLoadingBarInterceptor(),

    // Firebase providers with enhanced configuration
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      return app;
    }),

    provideAnalytics(() => {
      const app = getApp();
      const analytics = getAnalytics(app);
      return analytics;
    }),

    provideFirestore(() => {
      const app = getApp();
      const firestore = getFirestore(app);
      // Firestore emulator disabled

      // Enable offline persistence in production
      if (environment.production) {
        enableIndexedDbPersistence(firestore).catch(err => {
          console.warn('Failed to enable Firestore persistence:', err.code);
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
          } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support persistence.');
          }
        });
      }
      return firestore;
    }),

    provideFunctions(() => {
      const app = getApp();
      const functions = getFunctions(app);
      if (!environment.production) {
        try {
          connectFunctionsEmulator(functions, 'localhost', 5001);
        } catch (error) {
          console.warn('Functions emulator connection failed:', error);
        }
      }
      return functions;
    }),

    provideHighcharts(),
    provideIcons({
      featherActivity, // skills/performance
      featherBriefcase, // experience/work
      featherChevronsUp,
      featherCode, // portfolio/projects
      featherDownload, // download
      featherEdit,
      featherExternalLink,
      featherFacebook, // facebook
      featherGithub, // github
      featherHeart,
      featherInstagram, // instagram
      featherMail, // contact
      featherSend, // send
      featherX // close
    }),

    // Service Worker with enhanced configuration
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
      scope: './'
    }),

    // App services
    GoogleAnalyticsService,
    AnalyticsHelperService,
    FirebaseService,
    FirebaseDevUtils,
    ScrollService
  ]
};
