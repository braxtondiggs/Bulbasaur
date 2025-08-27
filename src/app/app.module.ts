import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';

// Loading bar
import { LoadingBarHttpClientModule, provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';

// Icons
import { NgIconsModule } from '@ng-icons/core';
import {
  featherChevronsUp,
  featherHeart,
  featherCoffee,
  featherHeadphones,
  featherCamera,
  featherZap,
  featherTool,
  featherWind,
  featherMapPin,
  featherSun,
  featherTruck,
  featherUser,
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

// App modules
import { AppComponent } from './app.component';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { PortfolioModule } from '@features/portfolio/portfolio.module';
import { ProfileModule } from '@features/profile/profile.module';

// Services
import { GoogleAnalyticsService, ScrollService } from '@shared/services';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular core modules
    BrowserModule,
    BrowserAnimationsModule,
    
    // Firebase
    AngularFireModule.initializeApp(environment.firebase),
    
    // Loading bar
    LoadingBarHttpClientModule,
    
    // Icons
    NgIconsModule.withIcons({
      featherChevronsUp,
      featherHeart,
      featherCoffee,
      featherHeadphones,
      featherCamera,
      featherZap,        // gaming/energy
      featherTool,       // chef/cooking
      featherWind,       // drinks/refreshment
      featherMapPin,     // travel/activity
      featherSun,        // bright/ideas
      featherTruck,      // vehicles
      featherUser,       // about/profile
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
    }),
    
    // App modules
    SharedModule,
    CoreModule,
    PortfolioModule,
    ProfileModule
  ],
  providers: [
    // HTTP Client
    provideHttpClient(withInterceptorsFromDi()),
    provideLoadingBarInterceptor(),
    
    // App services
    GoogleAnalyticsService,
    ScrollService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }