import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator/jest';
import { SkillsComponent } from './skills.component';
import { MatSelectModule } from '@angular/material/select';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

describe('SkillsComponent', () => {
  let spectator: Spectator<SkillsComponent>;
  let httpMock: SpyObject<HttpTestingController>;
  const createComponent = createComponentFactory({
    component: SkillsComponent,
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      HighchartsChartModule,
      HttpClientTestingModule,
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatSelectModule,
      MatTabsModule,
      ReactiveFormsModule
    ],
    mocks: [GoogleAnalyticsService]
  });

  beforeEach(() => {
    spectator = createComponent();
    httpMock = spectator.inject(HttpTestingController);
    spectator.component.skills = {};
  });

  it('should create', () => {
    const chartSpy = jest.spyOn(spectator.component as any, 'setDefaultCharts');
    const skillSpy = jest.spyOn(spectator.component as any, 'getSkills');
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
    expect(chartSpy).toHaveBeenCalled();
    expect(skillSpy).toHaveBeenCalled();
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
  });

  it('should switch tabs', () => {
    const ga = spectator.inject(GoogleAnalyticsService);
    const spy = jest.spyOn(spectator.component as any, 'updateSeries');
    spectator.component.selectedTabChange({ tab: { textLabel: 'Activity' } } as any);
    expect(spy).toHaveBeenCalled();
    expect(ga.eventEmitter).toHaveBeenCalled();
  });

  it('should update series', () => {
    const spy = jest.spyOn(spectator.component as any, 'updateSeries');
    const req = httpMock.expectOne({ method: 'GET', url: 'https://code.braxtondiggs.com/api?range=last30days' });
    req.flush({});
    expect(spy).toHaveBeenCalled();
  })
});
