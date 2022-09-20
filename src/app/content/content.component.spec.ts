import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Spectator, createComponentFactory, createSpyObject } from '@ngneat/spectator/jest';
import { HighchartsChartModule } from 'highcharts-angular';
import { environment } from 'src/environments/environment';
import { FooterComponent } from '../footer/footer.component';
import { SkillPipe } from '../shared/pipes/skill.pipe';
import { SocialComponent } from '../social';
import { ContactComponent } from './contact/contact.component';
import { ContentComponent } from './content.component';
import { SkillsComponent } from './skills/skills.component';
import { of } from 'rxjs';


describe('ContentComponent', () => {
  let spectator: Spectator<ContentComponent>;

  const mockHTTP = createSpyObject(HttpClient);
  mockHTTP.get.andReturn(of([]));

  const createComponent = createComponentFactory({
    component: ContentComponent,
    declarations: [SkillPipe, SkillsComponent, ContactComponent, SocialComponent, FooterComponent],
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      HighchartsChartModule,
      HttpClientTestingModule,
      MatCardModule,
      MatDatepickerModule,
      MatDialogModule,
      MatDividerModule,
      MatFormFieldModule,
      MatGridListModule,
      MatInputModule,
      MatListModule,
      MatNativeDateModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      MatSnackBarModule,
      MatTabsModule,
      ReactiveFormsModule
    ],
    shallow: true,
    providers: [
      { provide: HttpClient, useValue: mockHTTP }
    ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
