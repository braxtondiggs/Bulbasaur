import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator/jest';
import { SkillsComponent } from './skills.component';
import { MatSelectModule } from '@angular/material/select';
import { SatDatepickerModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { ChartModule } from 'angular-highcharts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GoogleAnalyticsService } from 'src/app/shared/services';

describe('SkillsComponent', () => {
  let spectator: Spectator<SkillsComponent>;
  let httpMock: SpyObject<HttpTestingController>;
  const createComponent = createComponentFactory({
    component: SkillsComponent,
    imports: [
      MatSelectModule,
      SatDatepickerModule,
      ChartModule,
      MatTabsModule,
      MatCardModule,
      HttpClientTestingModule,
      AngularFireModule.initializeApp(environment.firebase)
    ],
    providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }],
    mocks: [GoogleAnalyticsService]
  });

  beforeEach(() => {
    spectator = createComponent();
    httpMock = spectator.inject(HttpTestingController);
    spectator.component.skills = {};
  });

  it('should create', () => {
    const chartSpy = spyOn(spectator.component, 'setDefaultCharts').and.callThrough();
    const skillSpy = spyOn(spectator.component, 'getSkills').and.callThrough();
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
    expect(chartSpy).toHaveBeenCalled();
    expect(skillSpy).toHaveBeenCalled();
  });

  it('should not call anything if custom range', () => {
    const spy = spyOn(spectator.component, 'getSkills');
    spectator.component.selectionChange({ value: 'customrange' } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call skills on change', () => {
    const ga = spectator.inject(GoogleAnalyticsService);
    const spy = spyOn(spectator.component, 'getSkills');
    spectator.component.selectionChange({ value: 'yesterday' } as any);
    expect(spy).toHaveBeenCalledWith('yesterday');
    expect(ga.eventEmitter).toHaveBeenCalled();
  });

  it('should switch tabs', () => {
    const ga = spectator.inject(GoogleAnalyticsService);
    const spy = spyOn(spectator.component, 'updateSeries').and.callThrough();
    spectator.component.selectedTabChange({ tab: { textLabel: 'Activity' } } as any);
    expect(spy).toHaveBeenCalled();
    expect(ga.eventEmitter).toHaveBeenCalled();
  });

  it('should update series', () => {
    const spy = spyOn(spectator.component, 'updateSeries').and.callThrough();
    const req = httpMock.expectOne({ method: 'GET', url: 'https://wartortle.herokuapp.com?range=last30days' });
    req.flush({});
    expect(spy).toHaveBeenCalled();
  })
});
