import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { GoogleAnalyticsService } from '@shared/services';
import { Project } from '@shared/models';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnChanges {
  @Input() project!: Project;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(public ga: GoogleAnalyticsService) { }

  ngOnChanges() {
    if (this.project && this.project.description) {
      this.project.description_modified = this.project.description.join('<br /><br />');
    }
  }

  close() {
    this.closeModal.emit();
  }
}
