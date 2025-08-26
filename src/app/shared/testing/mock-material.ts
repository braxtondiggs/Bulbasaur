import { NgModule, Component, Injectable } from '@angular/core';

/**
 * Mock Angular Material modules for testing when Material is not installed
 * This prevents import errors in tests while maintaining test functionality
 */

// Mock Material Components
@Component({
  selector: 'mat-card',
  template: '<ng-content></ng-content>'
})
export class MockMatCard { }

@Component({
  selector: 'mat-card-content',
  template: '<ng-content></ng-content>'
})
export class MockMatCardContent { }

@Component({
  selector: 'mat-divider',
  template: '<hr>'
})
export class MockMatDivider { }

@Component({
  selector: 'mat-progress-bar',
  template: '<div></div>',
  inputs: ['value', 'mode']
})
export class MockMatProgressBar { }

@Component({
  selector: 'mat-list',
  template: '<ng-content></ng-content>'
})
export class MockMatList { }

@Component({
  selector: 'mat-select',
  template: '<ng-content></ng-content>',
  inputs: ['value'],
  outputs: ['selectionChange']
})
export class MockMatSelect { }

// Mock Material Modules
@NgModule({
  declarations: [MockMatCard, MockMatCardContent],
  exports: [MockMatCard, MockMatCardContent]
})
export class MatCardModule { }

@NgModule({
  declarations: [MockMatDivider],
  exports: [MockMatDivider]
})
export class MatDividerModule { }

@NgModule({
  declarations: [MockMatProgressBar],
  exports: [MockMatProgressBar]
})
export class MatProgressBarModule { }

@NgModule({})
export class MatProgressSpinnerModule { }

@NgModule({
  declarations: [MockMatList],
  exports: [MockMatList]
})
export class MatListModule { }

@NgModule({})
export class MatGridListModule { }

@NgModule({
  declarations: [MockMatSelect],
  exports: [MockMatSelect]
})
export class MatSelectModule { }

@NgModule({})
export class MatTabsModule { }

@NgModule({})
export class MatSnackBarModule { }

@NgModule({})
export class MatFormFieldModule { }

@NgModule({})
export class MatInputModule { }

@NgModule({})
export class MatDatepickerModule { }

@NgModule({})
export class MatNativeDateModule { }

@NgModule({})
export class MatDialogModule { }

// Mock Material services
@Injectable()
export class MatDialog {
  open = jest.fn().mockReturnValue({
    afterClosed: () => ({ subscribe: jest.fn() }),
    close: jest.fn()
  });
  closeAll = jest.fn();
}

@Injectable()
export class MatSnackBar {
  open = jest.fn().mockReturnValue({
    dismiss: jest.fn()
  });
  dismiss = jest.fn();
}

// Mock Material interfaces
export interface MatSelectChange {
  value: any;
  source?: any;
}

export interface MatTabChangeEvent {
  index: number;
  tab: {
    textLabel: string;
    [key: string]: any;
  };
}
