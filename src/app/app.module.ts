import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentModule } from 'angular2-moment';
import { NgxPageScrollModule, PageScrollConfig } from 'ngx-page-scroll';
import { ChartModule } from 'angular-highcharts';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './content/contact/contact.component';
import { SocialComponent, SnapchatQRComponent } from './social';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileBoxComponent,
    SnapchatQRComponent,
    SideNavComponent,
    ContentComponent,
    FooterComponent,
    ContactComponent,
    SocialComponent
  ],
  imports: [
    ChartModule,
    NgxPageScrollModule,
    FlexLayoutModule,
    MaterialModule,
    MomentModule,
    BrowserModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule
  ],
  entryComponents: [SnapchatQRComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    PageScrollConfig.defaultScrollOffset = 25;
    PageScrollConfig.defaultDuration = 500;
  }
}
