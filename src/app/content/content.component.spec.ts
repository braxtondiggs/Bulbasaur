import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator';
import { ContentComponent } from './content.component';
import { MatDividerModule } from '@angular/material/divider';
import { SkillPipe } from '../shared/pipes/skill.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MomentModule } from 'ngx-moment';
import { SkillsComponent } from './skills/skills.component';
import { MatSelectModule } from '@angular/material/select';
import { SatDatepickerModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { ChartModule } from 'angular-highcharts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { ContactComponent } from './contact/contact.component';
import { SocialComponent } from '../social';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('ContentComponent', () => {
  let spectator: Spectator<ContentComponent>;
  const createComponent = createComponentFactory({
    component: ContentComponent,
    declarations: [SkillPipe, SkillsComponent, ContactComponent, SocialComponent, FooterComponent],
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      ChartModule,
      HttpClientTestingModule,
      MatCardModule,
      MatDividerModule,
      MatFormFieldModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      MatSnackBarModule,
      MatTabsModule,
      MomentModule,
      ReactiveFormsModule,
      SatDatepickerModule
    ],
    providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
