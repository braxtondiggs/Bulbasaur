import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ContentComponent } from './content/content.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileBoxComponent,
    SideNavComponent,
    ContentComponent
  ],
  imports: [
    FlexLayoutModule,
    MaterialModule,
    MomentModule,
    BrowserModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
