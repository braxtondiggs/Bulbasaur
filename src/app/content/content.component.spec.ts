import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { Spectator, createComponentFactory, createSpyObject } from '@ngneat/spectator/jest';
import { HighchartsChartModule } from 'highcharts-angular';
import { environment } from 'src/environments/environment';
import { FooterComponent } from '../footer/footer.component';
import { SkillPipe } from '../shared/pipes/skill.pipe';
import { SocialComponent } from '../social';
import { ContactComponent } from './contact/contact.component';
import { ContentComponent } from './content.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectComponent } from './project/project.component';
import { testNgIconsModule } from '../shared/testing/test-utils';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('ContentComponent', () => {
  let spectator: Spectator<ContentComponent>;

  const mockHTTP = createSpyObject(HttpClient);
  mockHTTP.get.andReturn(of([]));

  // Mock Firestore for any child components that need it
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => of([])) });

  const createComponent = createComponentFactory({
    component: ContentComponent,
    declarations: [SkillPipe, SkillsComponent, ContactComponent, SocialComponent, FooterComponent, ProjectComponent],
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      HighchartsChartModule,
      HttpClientTestingModule,
      LazyLoadImageModule,
      ReactiveFormsModule,
      testNgIconsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    shallow: false, // Need to render child components
    providers: [
      { provide: HttpClient, useValue: mockHTTP },
      { provide: AngularFirestore, useValue: mockFireStore }
    ]
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false // Prevent automatic change detection
    });

    // Mock the SkillsComponent's problematic methods if it exists
    const skillsComponent = spectator.query(SkillsComponent);
    if (skillsComponent) {
      jest.spyOn(skillsComponent as any, 'updateSeries').mockImplementation(() => { });
      jest.spyOn(skillsComponent, 'chartCallbackLang').mockImplementation(() => { });
      jest.spyOn(skillsComponent, 'chartCallbackAct').mockImplementation(() => { });
      jest.spyOn(skillsComponent, 'chartCallbackEditor').mockImplementation(() => { });
    }
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should contain main content sections', () => {
    spectator.detectChanges();
    expect(spectator.query('#about')).toBeTruthy();
    expect(spectator.query('app-skills')).toBeTruthy();
    expect(spectator.query('app-project')).toBeTruthy();
    expect(spectator.query('app-contact')).toBeTruthy();
  });
});
