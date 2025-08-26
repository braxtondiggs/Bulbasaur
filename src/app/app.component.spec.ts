import { Spectator, createComponentFactory, createSpyObject } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { HeaderComponent } from './header/header.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { SocialComponent } from './social';
import { ContentComponent, SkillsComponent, ContactComponent } from './content';
import { SkillPipe } from './shared/pipes/skill.pipe';
import { FooterComponent } from './footer/footer.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SideNavComponent } from './side-nav/side-nav.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';
import { testNgIconsModule } from './shared/testing/test-utils';
import { LazyLoadImageModule } from 'ng-lazyload-image';
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
      LazyLoadImageModule,
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
