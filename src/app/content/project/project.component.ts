import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { GoogleAnalyticsService } from '../../shared/services';
import { join } from 'lodash-es';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnChanges {
  @Input() project: any;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(public ga: GoogleAnalyticsService) { }

  ngOnChanges() {
    if (this.project && this.project.description) {
      this.project.description_modified = join(this.project.description, '<br /><br />');
    }
  }

  close() {
    this.closeModal.emit();
  }
}
