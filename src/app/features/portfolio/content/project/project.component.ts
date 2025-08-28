import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { GoogleAnalyticsService } from '@shared/services';
import { Project } from '@shared/models';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    NgIconsModule,
    LazyLoadFadeDirective
  ],
  templateUrl: './project.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnChanges {
  @Input() project!: Project;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  public ga = inject(GoogleAnalyticsService);

  ngOnChanges() {
    if (this.project && this.project.description) {
      this.project.description_modified = this.project.description.join('<br /><br />');
    }
  }

  close() {
    this.closeModal.emit();
  }
}
