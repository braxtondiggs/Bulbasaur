import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// Layout Components
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';

// Icons are now handled in AppModule globally

const CORE_COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SideNavComponent
];

@NgModule({
  declarations: [
    ...CORE_COMPONENTS
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ...CORE_COMPONENTS
  ]
})
export class CoreModule { }