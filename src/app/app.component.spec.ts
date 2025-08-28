import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { Firestore } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent, HeaderComponent, SideNavComponent } from '@core/layout';
import { ContactComponent, ContentComponent, SkillsComponent } from '@features/portfolio';
import { InstagramComponent, ProfileBoxComponent, SocialComponent } from '@features/profile';
import { Spectator, createComponentFactory, createSpyObject } from '@ngneat/spectator/jest';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { SkillPipe } from '@shared/pipes';
import { DateFormatPipe, ParsePipe } from '@shared/pipes/date.pipe';
import { GoogleAnalyticsService } from '@shared/services';
import { ScrollService } from '@shared/services/scroll.service';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  // Mock Firestore for Instagram component
  const mockFirestore = {};

  // Mock Analytics
  const mockAnalytics = {};

  // Mock ScrollService
  const mockScrollService = createSpyObject(ScrollService);
  mockScrollService.scrollObs = of({});
  mockScrollService.resizeObs = of({});
  mockScrollService.pos = 0;

  // Mock GoogleAnalyticsService
  const mockGA = createSpyObject(GoogleAnalyticsService);
  mockGA.eventEmitter.andReturn(undefined);

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      // Standalone components
      ContactComponent,
      ContentComponent,
      FooterComponent,
      HeaderComponent,
      ProfileBoxComponent,
      SideNavComponent,
      SkillsComponent,
      SocialComponent,
      InstagramComponent,
      // Standalone pipes
      SkillPipe,
      ParsePipe,
      DateFormatPipe,
      // Standalone directives
      LazyLoadFadeDirective,
      AnimateOnScrollDirective,
      // Modules
      HttpClientModule,
      LoadingBarModule,
      ReactiveFormsModule,
      testNgIconsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      { provide: Firestore, useValue: mockFirestore },
      { provide: Analytics, useValue: mockAnalytics },
      { provide: ScrollService, useValue: mockScrollService },
      { provide: GoogleAnalyticsService, useValue: mockGA }
    ],
    shallow: true
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have main layout structure', () => {
    expect(spectator.query('.container')).toBeTruthy();
    expect(spectator.query('app-header')).toBeTruthy();
    expect(spectator.query('app-profile-box')).toBeTruthy();
    expect(spectator.query('app-content')).toBeTruthy();
    expect(spectator.query('app-side-nav')).toBeTruthy();
  });

  it('should contain all main components', () => {
    // These components should be present in the app template
    const expectedComponents = ['app-header', 'app-side-nav', 'app-profile-box', 'app-content'];

    expectedComponents.forEach(selector => {
      expect(spectator.query(selector)).toBeTruthy();
    });
  });
});
