import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// Compat API for test files that still use legacy imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Loading bar
import { LoadingBarHttpClientModule, provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';

// Icons
import { NgIconsModule } from '@ng-icons/core';
import {
  featherChevronsUp,
  featherHeart,
  featherBriefcase,
  featherActivity,
  featherCode,
  featherMail,
  featherFacebook,
  featherGithub,
  featherInstagram,
  featherDownload,
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

    // Import legacy modules
    importProvidersFrom(
      // Firebase compat modules for test compatibility
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,

      // Loading bar
      LoadingBarHttpClientModule,

      // Icons
      NgIconsModule.withIcons({
        featherChevronsUp,
        featherHeart,
        featherBriefcase,  // experience/work
        featherActivity,   // skills/performance
        featherCode,       // portfolio/projects
        featherMail,       // contact
        featherFacebook,   // facebook
        featherGithub,     // github
        featherInstagram,  // instagram
        featherDownload,   // download
        featherSend,       // send
        featherX          // close
      }),

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
