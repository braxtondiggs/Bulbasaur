import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, ViewEncapsulation } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { Project } from '@shared/models';
import { GoogleAnalyticsService } from '@shared/services';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, NgIcon, LazyLoadFadeDirective],
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
        currentProject.description_modified = currentProject.description;
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
