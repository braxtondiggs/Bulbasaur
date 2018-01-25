import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule, MatIconRegistry, MatIconModule, MatCardModule } from '@angular/material';
@NgModule({
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  exports: [MatButtonModule, MatIconModule, MatCardModule],
})
export class MaterialModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('../../assets/mdi.svg'));
  }
}
