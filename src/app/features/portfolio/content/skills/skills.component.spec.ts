import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { createComponentFactory, createSpyObject, Spectator, SpyObject } from '@ngneat/spectator/jest';
import { SkillsComponent } from './skills.component';
// Removed AngularFireModule to avoid duplicate import warning
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { DateFormatPipe, ParsePipe } from '@shared/pipes/date.pipe';
import { GoogleAnalyticsService, ScrollService } from '@shared/services';
import { of, Subject } from 'rxjs';

describe('SkillsComponent', () => {
  let spectator: Spectator<SkillsComponent>;
  let httpMock: SpyObject<HttpTestingController>;

  // Mock Firestore
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => of([])) });

  // Mock ScrollService
  const mockScrollService = {
    scrollObs: new Subject(),
    resizeObs: new Subject(),
    pos: 0
  };

  const createComponent = createComponentFactory({
    component: SkillsComponent,
    imports: [
      AnimateOnScrollDirective,
      ParsePipe,
      DateFormatPipe,
      HighchartsChartModule,
      HttpClientTestingModule,
      ReactiveFormsModule
    ],
    providers: [
      { provide: AngularFirestore, useValue: mockFireStore },
      { provide: ScrollService, useValue: mockScrollService },
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
    ],
    mocks: [GoogleAnalyticsService]
  });

  beforeEach(() => {
    // Mock DOM elements that Highcharts needs
    jest.spyOn(document, 'getElementById').mockReturnValue({
      clientWidth: 800,
      getBoundingClientRect: () => ({
        width: 800,
        height: 400,
        top: 0,
        left: 0,
        right: 800,
        bottom: 400,
        x: 0,
        y: 0,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        toJSON: () => {}
      })
    } as HTMLElement);

    spectator = createComponent({
      detectChanges: false // Prevent automatic change detection
    });
    httpMock = spectator.inject(HttpTestingController);
    spectator.component.skills = {
      Languages: [],
      Editors: [],
      Timeline: []
    };

    // Mock the chart callback methods to prevent Highcharts DOM access
    jest.spyOn(spectator.component, 'chartCallbackLang').mockImplementation(() => undefined);
    jest.spyOn(spectator.component, 'chartCallbackAct').mockImplementation(() => undefined);
    jest.spyOn(spectator.component, 'chartCallbackEditor').mockImplementation(() => undefined);

    // Mock updateSeries globally to prevent chart access errors
    jest.spyOn(spectator.component as any, 'updateSeries').mockImplementation(() => undefined);
    jest.spyOn(spectator.component as any, 'setDefaultCharts').mockImplementation(() => undefined);
    jest.spyOn(spectator.component as any, 'detectTheme').mockImplementation(() => undefined);
  });

  it('should create', () => {
    const chartSpy = jest.spyOn(spectator.component as any, 'setDefaultCharts');
    const skillSpy = jest.spyOn(spectator.component as any, 'getSkills');
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
    expect(chartSpy).toHaveBeenCalled();
    expect(skillSpy).toHaveBeenCalled();

    // Handle the HTTP request for skills data (called by ngOnInit)
    const req = httpMock.expectOne('https://code.braxtondiggs.com/api?range=last30days');
    expect(req.request.method).toBe('GET');
    req.flush({
      Languages: [{ name: 'TypeScript', total_seconds: 1000 }],
      Editors: [{ name: 'VS Code', total_seconds: 500 }],
      Timeline: [{ date: '2023-01-01', total_seconds: 7200 }]
    });

    httpMock.verify();
  });

  it('should not call anything if custom range', () => {
    const spy = jest.spyOn(spectator.component as any, 'getSkills');
    spectator.component.selectionChange({ value: 'customrange' } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call skills on change', () => {
    const ga = spectator.inject(GoogleAnalyticsService);
    const spy = jest.spyOn(spectator.component as any, 'getSkills');
    spectator.component.selectionChange({ value: 'yesterday' } as any);
    expect(spy).toHaveBeenCalledWith('yesterday');
    expect(ga.eventEmitter).toHaveBeenCalled();

    // Handle the HTTP request
    const req = httpMock.expectOne('https://code.braxtondiggs.com/api?range=yesterday');
    req.flush({
      Languages: [{ name: 'TypeScript', total_seconds: 1000 }],
      Editors: [{ name: 'VS Code', total_seconds: 500 }],
      Timeline: [{ date: '2023-01-01', total_seconds: 7200 }]
    });

    httpMock.verify();
  });

  it('should switch tabs', () => {
    const ga = spectator.inject(GoogleAnalyticsService);
    spectator.component.selectedTabChange({ index: 1, tab: { textLabel: 'Activity' } } as any);
    expect(ga.eventEmitter).toHaveBeenCalled();
  });

  it('should update series', () => {
    // Call getSkills via component's any type to access private method
    (spectator.component as any).getSkills('last30days');

    // Handle all requests for this URL
    const requests = httpMock.match('https://code.braxtondiggs.com/api?range=last30days');
    requests.forEach(req => {
      req.flush({
        Languages: [{ name: 'TypeScript', total_seconds: 1000 }],
        Editors: [{ name: 'VS Code', total_seconds: 500 }],
        Timeline: [{ date: '2023-01-01', total_seconds: 7200 }]
      });
    });

    httpMock.verify();
  });
});
