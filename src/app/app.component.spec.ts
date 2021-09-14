import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { AppComponent } from './app.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { HeaderComponent } from './header/header.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { SocialComponent } from './social';
import { MatCardModule } from '@angular/material/card';
import { ContentComponent, SkillsComponent, ContactComponent } from './content';
import { MatDividerModule } from '@angular/material/divider';
import { SkillPipe } from './shared/pipes/skill.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { FooterComponent } from './footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { SideNavComponent } from './side-nav/side-nav.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
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
      MatCardModule,
      MatDatepickerModule,
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
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
