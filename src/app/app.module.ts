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
import { ProfileBoxComponent, SnapchatQRComponent } from './profile-box/index';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ContentComponent } from './content/content.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileBoxComponent,
    SnapchatQRComponent,
    SideNavComponent,
    ContentComponent
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
