import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, ViewEncapsulation } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { Project } from '@shared/models';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';

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
  private analyticsHelper = inject(AnalyticsHelperService);

  public trackProjectView(): void {
    const project = this.project();
    if (project) {
      this.analyticsHelper.trackProjectInteraction('view', project.name || project.title, project.category);
    }
  }

  public trackProjectDemo(): void {
    const project = this.project();
    if (project) {
      this.analyticsHelper.trackProjectInteraction('demo', project.name || project.title, project.category);

      // Track the appropriate URL based on available options
      const webUrl = project.url?.web || project.urls?.web;
      if (webUrl) {
        this.ga.trackExternalLink(webUrl, `${project.name || project.title} demo`);
      }
    }
  }

  public trackProjectSource(): void {
    const project = this.project();
    if (project) {
      this.analyticsHelper.trackProjectInteraction('source', project.name || project.title, project.category);

      if (project.github) {
        this.ga.trackExternalLink(project.github, `${project.name || project.title} source`);
      }
    }
  }

  constructor() {
    // Use effect to watch for project changes instead of ngOnChanges
    effect(() => {
      const currentProject = this.project();
      if (currentProject && currentProject.description) {
        currentProject.description_modified = currentProject.description;
        // Track project view when project is loaded
        this.trackProjectView();
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
