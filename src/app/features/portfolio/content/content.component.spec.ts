import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// Removed AngularFireModule to avoid duplicate import warning
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '@core/layout';
import { SocialComponent } from '@features/profile';
import { Spectator, createComponentFactory, createSpyObject } from '@ngneat/spectator/jest';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { SkillPipe } from '@shared/pipes';
import { DateFormatPipe, ParsePipe } from '@shared/pipes/date.pipe';
import { GoogleAnalyticsService } from '@shared/services';
import { ScrollService } from '@shared/services/scroll.service';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { of } from 'rxjs';
import { ContactComponent } from './contact/contact.component';
import { ContentComponent } from './content.component';
import { ProjectComponent } from './project/project.component';
import { SkillsComponent } from './skills/skills.component';

describe('ContentComponent', () => {
  let spectator: Spectator<ContentComponent>;

  const mockHTTP = createSpyObject(HttpClient);
  mockHTTP.get.andReturn(of([]));

  // Mock Firestore for any child components that need it
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => of([])) });

  // Mock ScrollService
  const mockScrollService = createSpyObject(ScrollService);
  mockScrollService.scrollObs = of({});
  mockScrollService.resizeObs = of({});
  mockScrollService.pos = 0;

  // Mock GoogleAnalyticsService
  const mockGA = createSpyObject(GoogleAnalyticsService);
  mockGA.eventEmitter.andReturn(undefined);

  const createComponent = createComponentFactory({
    component: ContentComponent,
    imports: [
      // Standalone components
      SkillsComponent,
      ContactComponent,
      SocialComponent,
      FooterComponent,
      ProjectComponent,
      // Standalone pipes
      SkillPipe,
      ParsePipe,
      DateFormatPipe,
      // Standalone directives
      LazyLoadFadeDirective,
      AnimateOnScrollDirective,
      // Modules
      // Removed Firebase module initialization
      HighchartsChartModule,
      HttpClientTestingModule,
      ReactiveFormsModule,
      testNgIconsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    shallow: true, // Use shallow rendering to avoid child component issues
    providers: [
      { provide: HttpClient, useValue: mockHTTP },
      { provide: AngularFirestore, useValue: mockFireStore },
      { provide: ScrollService, useValue: mockScrollService },
      { provide: GoogleAnalyticsService, useValue: mockGA },
      {
        provide: FIREBASE_OPTIONS,
        useValue: {
          apiKey: 'fake-api-key',
          authDomain: 'test.firebaseapp.com',
          projectId: 'test-project',
          storageBucket: 'test.appspot.com',
          messagingSenderId: '123456789',
          appId: 'test-app-id'
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false // Prevent automatic change detection
    });

    // Mock the SkillsComponent's problematic methods if it exists
    const skillsComponent = spectator.query(SkillsComponent);
    if (skillsComponent) {
      jest.spyOn(skillsComponent as any, 'updateSeries').mockImplementation(() => undefined);
      jest.spyOn(skillsComponent, 'chartCallbackLang').mockImplementation(() => undefined);
      jest.spyOn(skillsComponent, 'chartCallbackAct').mockImplementation(() => undefined);
      jest.spyOn(skillsComponent, 'chartCallbackEditor').mockImplementation(() => undefined);
    }
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should contain main content sections', () => {
    spectator.detectChanges();
    expect(spectator.query('#about')).toBeTruthy();
    // Note: With shallow rendering, child component selectors are not rendered
    expect(spectator.query('app-skills')).toBeTruthy();
    expect(spectator.query('app-project')).toBeTruthy();
    expect(spectator.query('app-contact')).toBeTruthy();
  });
});
