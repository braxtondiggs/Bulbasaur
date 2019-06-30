import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GoogleAnalyticsService } from '../../shared/services';
import { join } from 'lodash-es';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'project',
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html'
})
export class ProjectComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public project: any, public ga: GoogleAnalyticsService) {
    project.description_modified = join(project.description, '<br /><br />');
  }
}
