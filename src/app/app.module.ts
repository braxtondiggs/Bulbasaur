import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent, ContactComponent, ProjectComponent, SkillsComponent } from './content/';
import { SocialComponent } from './social';
import { DateFormatPipe, DifferencePipe, ParsePipe, SkillPipe } from './shared/pipes';
import { AnimateOnScrollDirective } from './shared/directives/animate-on-scroll.directive';
import { GoogleAnalyticsService, ScrollService } from './shared/services';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { InstagramComponent } from './profile-box/instagram/instagram.component';
import { ServiceWorkerModule } from '@angular/service-worker';
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

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AnimateOnScrollDirective,
    AppComponent,
    ContactComponent,
    ContentComponent,
    DateFormatPipe,
    DifferencePipe,
    FooterComponent,
    HeaderComponent,
    InstagramComponent,
    ParsePipe,
    ProfileBoxComponent,
    ProjectComponent,
    SideNavComponent,
    SkillPipe,
    SkillsComponent,
    SocialComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
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
    HighchartsChartModule,
    FormsModule,
    LazyLoadImageModule,
    LoadingBarHttpClientModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    GoogleAnalyticsService,
    ScrollService
  ]
})
export class AppModule { }
