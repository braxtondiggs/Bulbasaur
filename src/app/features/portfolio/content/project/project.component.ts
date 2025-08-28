import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject, input, output, effect } from '@angular/core';
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
export class ProjectComponent {
  project = input.required<Project>();
  isVisible = input<boolean>(false);
  closeModal = output<void>();

  public ga = inject(GoogleAnalyticsService);

  constructor() {
    // Use effect to watch for project changes instead of ngOnChanges
    effect(() => {
      const currentProject = this.project();
      if (currentProject && currentProject.description) {
        currentProject.description_modified = currentProject.description.join('<br /><br />');
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
