import { Spectator, createComponentFactory, SpyObject, createSpyObject } from '@ngneat/spectator/jest';
import { SkillsComponent } from './skills.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '@env/environment';
import { GoogleAnalyticsService } from '@shared/services';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('SkillsComponent', () => {
  let spectator: Spectator<SkillsComponent>;
  let httpMock: SpyObject<HttpTestingController>;

  // Mock Firestore
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => of([])) });

  const createComponent = createComponentFactory({
    component: SkillsComponent,
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      HighchartsChartModule,
      HttpClientTestingModule,
      ReactiveFormsModule
    ],
    providers: [
      { provide: AngularFirestore, useValue: mockFireStore }
    ],
    mocks: [GoogleAnalyticsService]
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false // Prevent automatic change detection
    });
    httpMock = spectator.inject(HttpTestingController);
    spectator.component.skills = {};

    // Mock the chart callback methods to prevent Highcharts DOM access
    jest.spyOn(spectator.component, 'chartCallbackLang').mockImplementation(() => { });
    jest.spyOn(spectator.component, 'chartCallbackAct').mockImplementation(() => { });
    jest.spyOn(spectator.component, 'chartCallbackEditor').mockImplementation(() => { });

    // Mock updateSeries globally to prevent chart access errors
    jest.spyOn(spectator.component as any, 'updateSeries').mockImplementation(() => { });
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
