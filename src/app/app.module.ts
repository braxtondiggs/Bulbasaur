import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentModule } from 'ngx-moment';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ChartModule } from 'angular-highcharts';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent, ContactComponent, ProjectComponent, SkillsComponent } from './content/';
import { SocialComponent, SnapchatQRComponent } from './social';
import { SkillPipe } from './shared/pipes/skill.pipe';
import { AnimateOnScrollDirective } from './shared/directives/animate-on-scroll.directive';
import { GoogleAnalyticsService, ScrollService, SocketService } from './shared/services';
import { InstagramComponent } from './profile-box/instagram/instagram.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileBoxComponent,
    SnapchatQRComponent,
    SideNavComponent,
    ContentComponent,
    FooterComponent,
    ContactComponent,
    SocialComponent,
    ProjectComponent,
    SkillPipe,
    SkillsComponent,
    AnimateOnScrollDirective,
    InstagramComponent
  ],
  entryComponents: [
    SnapchatQRComponent,
    ProjectComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    NgxPageScrollModule,
    NgxPageScrollCoreModule.forRoot({ duration: 500, scrollOffset: 25 }),
    FlexLayoutModule,
    MaterialModule,
    MomentModule,
    BrowserModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule
  ],
  providers: [
    GoogleAnalyticsService,
    ScrollService,
    SocketService
  ]
})
export class AppModule { }
