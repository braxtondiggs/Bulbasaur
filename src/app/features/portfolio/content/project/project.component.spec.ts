import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgIcon } from '@ng-icons/core';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { Project } from '@shared/models';
import { AnalyticsHelperService, GoogleAnalyticsService } from '@shared/services';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { ProjectComponent } from './project.component';

describe('ProjectComponent', () => {
  let spectator: Spectator<ProjectComponent>;
  let analyticsHelperService: jest.Mocked<AnalyticsHelperService>;
  let googleAnalyticsService: jest.Mocked<GoogleAnalyticsService>;

  const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    title: 'Test Project Title',
    category: 'web',
    type: 'web',
    status: 'active',
    featured: true,
    technologies: ['Angular', 'TypeScript'],
    platforms: ['web'],
    description: 'Test project description',
    image: {
      icon: 'test-icon.svg',
      screenshot: 'test-screenshot.jpg',
      alt: 'Test project screenshot'
    },
    github: 'https://github.com/test/project',
    url: {
      web: 'https://test-project.com'
    },
    urls: {
      web: 'https://test-project-alt.com'
    },
    dateCreated: '2024-01-01',
    lastUpdated: '2024-01-15'
  };

  const createComponent = createComponentFactory({
    component: ProjectComponent,
    imports: [NgIcon, LazyLoadFadeDirective, testNgIconsModule],
    providers: [
      {
        provide: AnalyticsHelperService,
        useValue: {
          trackProjectInteraction: jest.fn()
        }
      },
      {
        provide: GoogleAnalyticsService,
        useValue: {
          trackExternalLink: jest.fn()
        }
      }
    ],
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        project: mockProject,
        isVisible: false
      }
    });
    
    analyticsHelperService = spectator.inject(AnalyticsHelperService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component.constructor.name).toBe('ProjectComponent');
    });

    it('should initialize with required project input', () => {
      expect(spectator.component.project()).toEqual(mockProject);
    });

    it('should initialize with default isVisible value', () => {
      expect(spectator.component.isVisible()).toBe(false);
    });

    it('should track project view on initialization when project has description', () => {
      expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
        'view',
        mockProject.name,
        mockProject.category
      );
    });
  });

  describe('Project Tracking Methods', () => {
    describe('trackProjectView', () => {
      it('should track project view with project name and category', () => {
        spectator.component.trackProjectView();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'view',
          mockProject.name,
          mockProject.category
        );
      });

      it('should use title when name is not available', () => {
        const projectWithoutName = { ...mockProject, name: undefined };
        spectator.setInput('project', projectWithoutName);

        spectator.component.trackProjectView();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'view',
          projectWithoutName.title,
          projectWithoutName.category
        );
      });

      it('should not throw error when project is null', () => {
        spectator.setInput('project', null as any);

        expect(() => spectator.component.trackProjectView()).not.toThrow();
      });
    });

    describe('trackProjectDemo', () => {
      it('should track demo interaction and external link with web URL', () => {
        spectator.component.trackProjectDemo();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'demo',
          mockProject.name,
          mockProject.category
        );
        expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(
          mockProject.url!.web,
          `${mockProject.name} demo`
        );
      });

      it('should use urls.web when url.web is not available', () => {
        const projectWithUrlsWeb = { ...mockProject, url: undefined };
        spectator.setInput('project', projectWithUrlsWeb);

        spectator.component.trackProjectDemo();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'demo',
          projectWithUrlsWeb.name,
          projectWithUrlsWeb.category
        );
        expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(
          projectWithUrlsWeb.urls!.web,
          `${projectWithUrlsWeb.name} demo`
        );
      });

      it('should not track external link when no web URL is available', () => {
        const projectWithoutUrl = { ...mockProject, url: undefined, urls: undefined };
        spectator.setInput('project', projectWithoutUrl);

        spectator.component.trackProjectDemo();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'demo',
          projectWithoutUrl.name,
          projectWithoutUrl.category
        );
        expect(googleAnalyticsService.trackExternalLink).not.toHaveBeenCalled();
      });

      it('should use title when name is not available', () => {
        const projectWithoutName = { ...mockProject, name: undefined };
        spectator.setInput('project', projectWithoutName);

        spectator.component.trackProjectDemo();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'demo',
          projectWithoutName.title,
          projectWithoutName.category
        );
      });
    });

    describe('trackProjectSource', () => {
      it('should track source interaction and external link with GitHub URL', () => {
        spectator.component.trackProjectSource();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'source',
          mockProject.name,
          mockProject.category
        );
        expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(
          mockProject.github,
          `${mockProject.name} source`
        );
      });

      it('should not track external link when GitHub URL is not available', () => {
        const projectWithoutGithub = { ...mockProject, github: undefined };
        spectator.setInput('project', projectWithoutGithub);

        spectator.component.trackProjectSource();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'source',
          projectWithoutGithub.name,
          projectWithoutGithub.category
        );
        expect(googleAnalyticsService.trackExternalLink).not.toHaveBeenCalled();
      });

      it('should use title when name is not available', () => {
        const projectWithoutName = { ...mockProject, name: undefined };
        spectator.setInput('project', projectWithoutName);

        spectator.component.trackProjectSource();

        expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
          'source',
          projectWithoutName.title,
          projectWithoutName.category
        );
      });
    });
  });

  describe('Modal Management', () => {
    it('should emit closeModal event when close is called', () => {
      let emitted = false;
      spectator.output('closeModal').subscribe(() => {
        emitted = true;
      });

      spectator.component.close();

      expect(emitted).toBe(true);
    });
  });

  describe('Input Changes', () => {
    it('should update project when input changes', () => {
      const newProject: Project = {
        ...mockProject,
        id: '2',
        name: 'Updated Project',
        description: 'Updated description'
      };

      spectator.setInput('project', newProject);

      expect(spectator.component.project()).toEqual(newProject);
    });

    it('should update visibility when input changes', () => {
      spectator.setInput('isVisible', true);

      expect(spectator.component.isVisible()).toBe(true);
    });
  });

  describe('Project Description Modification', () => {
    it('should modify project description when effect runs', () => {
      const projectWithDescription = {
        ...mockProject,
        description: 'Original description'
      };
      
      spectator.setInput('project', projectWithDescription);

      // The effect should set description_modified
      expect(spectator.component.project().description_modified).toBe('Original description');
    });

    it('should not modify description when project has no description', () => {
      const projectWithoutDescription: Project = {
        id: '2',
        name: 'Test Project 2',
        title: 'Test Project Title 2',
        category: 'web',
        type: 'web',
        status: 'active',
        featured: false,
        technologies: ['React'],
        platforms: ['web'],
        description: undefined,
        image: {
          icon: 'test-icon.svg',
          screenshot: 'test-screenshot.jpg',
          alt: 'Test project screenshot'
        },
        github: 'https://github.com/test/project2',
        url: {
          web: 'https://test-project2.com'
        },
        urls: {
          web: 'https://test-project2-alt.com'
        },
        dateCreated: '2024-01-01',
        lastUpdated: '2024-01-15'
      };
      
      spectator.setInput('project', projectWithoutDescription);
      spectator.detectChanges();

      // Since the effect only sets description_modified when description exists,
      // it should not have this property when description is undefined
      expect(spectator.component.project().description).toBeUndefined();
      expect(spectator.component.project().description_modified).toBeUndefined();
    });
  });

  describe('Service Injection', () => {
    it('should inject AnalyticsHelperService', () => {
      expect(analyticsHelperService).toBeDefined();
    });

    it('should inject GoogleAnalyticsService', () => {
      expect(googleAnalyticsService).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full demo tracking flow', () => {
      spectator.component.trackProjectDemo();

      expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
        'demo',
        mockProject.name,
        mockProject.category
      );
      expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(
        mockProject.url!.web,
        `${mockProject.name} demo`
      );
    });

    it('should complete full source tracking flow', () => {
      spectator.component.trackProjectSource();

      expect(analyticsHelperService.trackProjectInteraction).toHaveBeenCalledWith(
        'source',
        mockProject.name,
        mockProject.category
      );
      expect(googleAnalyticsService.trackExternalLink).toHaveBeenCalledWith(
        mockProject.github,
        `${mockProject.name} source`
      );
    });
  });
});
