import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { join } from 'lodash-es';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'project',
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html'
})
export class ProjectComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public project: any) {
    project.description_modified = join(project.description, '<br /><br />');
  }
}
