import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatButtonModule, MatIconRegistry, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
  MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
  MatInputModule
} from '@angular/material';
@NgModule({
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
    MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatInputModule],
  exports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
    MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatInputModule],
})
export class MaterialModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('../../assets/mdi.svg'));
    matIconRegistry.registerFontClassAlias('linearicons', 'icon');
  }
}
