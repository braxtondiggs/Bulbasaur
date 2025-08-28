import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// Compat API for test files that still use legacy imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideHighcharts } from 'highcharts-angular';

// Loading bar
import { LoadingBarHttpClientModule, provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';

// Icons
import { provideIcons } from '@ng-icons/core';
import {
  featherActivity,
  featherBriefcase,
  featherChevronsUp,
  featherCode,
  featherDownload,
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
import { GoogleAnalyticsService, ScrollService } from '@shared/services';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core providers
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideLoadingBarInterceptor(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideHighcharts({
      instance: () => import('highcharts'),
      modules: () => {
        return [import('highcharts/esm/modules/accessibility')];
      },
      options: {
        lang: {
          loading: 'Loading data...',
          noData: 'No data available'
        },
        accessibility: {
          enabled: false
        }
      }
    }),
    provideIcons({
      featherChevronsUp,
      featherHeart,
      featherBriefcase, // experience/work
      featherActivity, // skills/performance
      featherCode, // portfolio/projects
      featherMail, // contact
      featherFacebook, // facebook
      featherGithub, // github
      featherInstagram, // instagram
      featherDownload, // download
      featherSend, // send
      featherX // close
    }),

    // Import legacy modules
    importProvidersFrom(
      // Firebase compat modules for test compatibility
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,

      // Loading bar
      LoadingBarHttpClientModule,

      // Service Worker
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerWhenStable:30000'
      })
    ),

    // App services
    GoogleAnalyticsService,
    ScrollService
  ]
};
