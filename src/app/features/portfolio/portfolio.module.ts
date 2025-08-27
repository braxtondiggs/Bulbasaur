import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// Portfolio Components
import { ContentComponent } from './content/content.component';
import { ContactComponent } from './content/contact/contact.component';
import { ProjectComponent } from './content/project/project.component';
import { SkillsComponent } from './content/skills/skills.component';

// Cross-module dependencies
import { ProfileModule } from '../profile/profile.module';
import { CoreModule } from '../../core/core.module';

// Third-party modules for portfolio
import { HighchartsChartModule } from 'highcharts-angular';

const PORTFOLIO_COMPONENTS = [
  ContentComponent,
  ContactComponent,
  ProjectComponent,
  SkillsComponent
];

@NgModule({
  declarations: [
    ...PORTFOLIO_COMPONENTS
  ],
  imports: [
    SharedModule,
    HighchartsChartModule,
    ProfileModule,
    CoreModule
  ],
  exports: [
    ...PORTFOLIO_COMPONENTS
  ]
})
export class PortfolioModule { }