import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatButtonModule, MatIconRegistry, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
  MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
  MatInputModule, MatSnackBarModule, MatGridListModule, MatTabsModule, MatSelectModule, MatNativeDateModule
} from '@angular/material';
@NgModule({
  exports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
    MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatGridListModule, MatTabsModule, MatSelectModule, SatDatepickerModule,
    MatNativeDateModule],
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
    MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatGridListModule, MatTabsModule, MatSelectModule, SatDatepickerModule,
    MatNativeDateModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class MaterialModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('../../assets/mdi.svg'));
    matIconRegistry.registerFontClassAlias('linearicons', 'icon');
  }
}
