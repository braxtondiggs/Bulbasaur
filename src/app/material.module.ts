import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  exports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
    MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatGridListModule, MatTabsModule, MatSelectModule, SatDatepickerModule,
    MatNativeDateModule, MatRippleModule],
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatDividerModule,
    MatListModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatGridListModule, MatTabsModule, MatSelectModule, SatDatepickerModule,
    MatNativeDateModule, MatRippleModule],
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
