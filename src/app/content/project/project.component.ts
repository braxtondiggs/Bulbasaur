import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public project: any) {
    project.description_modified = _.join(project.description, '<br /><br />');
  }
}
