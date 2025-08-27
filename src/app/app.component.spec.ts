import { Spectator, createComponentFactory, createSpyObject } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { HeaderComponent, FooterComponent, SideNavComponent } from '@core/layout';
import { ProfileBoxComponent, SocialComponent } from '@features/profile';
import { ContentComponent, SkillsComponent, ContactComponent } from '@features/portfolio';
import { SkillPipe } from '@shared/pipes';
import { HighchartsChartModule } from 'highcharts-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  // Mock Firestore for Instagram component
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => of([])) });

  const createComponent = createComponentFactory({
    component: AppComponent,
    declarations: [
      ContactComponent,
      ContentComponent,
      FooterComponent,
      HeaderComponent,
      ProfileBoxComponent,
      SideNavComponent,
      SkillPipe,
      SkillsComponent,
      SocialComponent
    ],
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      HighchartsChartModule,
      HttpClientModule,
      LoadingBarModule,
      ReactiveFormsModule,
      testNgIconsModule
    ],
    providers: [
      { provide: AngularFirestore, useValue: mockFireStore }
    ],
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

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
    const expectedComponents = [
      'app-header',
      'app-side-nav',
      'app-profile-box',
      'app-content'
    ];

    expectedComponents.forEach(selector => {
      expect(spectator.query(selector)).toBeTruthy();
    });
  });
});
