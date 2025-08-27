import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { SideNavComponent } from './side-nav.component';
import { GoogleAnalyticsService } from '@shared/services';
import { NgIconsModule } from '@ng-icons/core';
import { featherBriefcase, featherCode, featherMail, featherFolder } from '@ng-icons/feather-icons';

describe('SideNavComponent', () => {
  let spectator: Spectator<SideNavComponent>;
  const createComponent = createComponentFactory({
    component: SideNavComponent,
    imports: [
      NgIconsModule.withIcons({
        featherBriefcase,
        featherCode,
        featherMail,
        featherFolder
      }),
    ],
    providers: [
      mockProvider(GoogleAnalyticsService, {
        eventEmitter: jest.fn()
      })
    ],
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();

    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true
    });

    // Mock window.pageYOffset
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true
    });

    // Mock document.getElementById
    jest.spyOn(document, 'getElementById').mockReturnValue({
      getBoundingClientRect: () => ({
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => { }
      })
    } as HTMLElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have a GoogleAnalyticsService', () => {
    expect(spectator.component.ga).toBeTruthy();
  });

  it('should render navigation buttons with proper DaisyUI classes', () => {
    const buttons = spectator.queryAll('button');

    buttons.forEach(button => {
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('btn-ghost');
      expect(button).toHaveClass('btn-circle');
      expect(button).toHaveClass('tooltip');
      expect(button).toHaveClass('tooltip-left');
    });
  });

  it('should have accessibility attributes', () => {
    const buttons = spectator.queryAll('button');

    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('data-tip');
    });
  });

  describe('scrollToSection', () => {
    it('should scroll to element when it exists', () => {
      spectator.component.scrollToSection('about');

      expect(document.getElementById).toHaveBeenCalledWith('about');
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 80, // 100 (getBoundingClientRect top) + 0 (pageYOffset) - 20 (offset)
        behavior: 'smooth'
      });
    });

    it('should not scroll when element does not exist', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);

      spectator.component.scrollToSection('nonexistent');

      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('should calculate correct scroll position with page offset', () => {
      Object.defineProperty(window, 'pageYOffset', {
        value: 500,
        writable: true
      });

      spectator.component.scrollToSection('skills');

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 580, // 100 + 500 - 20
        behavior: 'smooth'
      });
    });
  });

  it('should call Google Analytics and scroll when navigation buttons are clicked', () => {
    jest.spyOn(spectator.component, 'scrollToSection');

    const aboutButton = spectator.query('button[aria-label="About"]');
    spectator.click(aboutButton!);

    expect(spectator.component.ga.eventEmitter).toHaveBeenCalledWith('nav', 'about');
    expect(spectator.component.scrollToSection).toHaveBeenCalledWith('about');
  });

  it('should render profile image with lazy loading', () => {
    const profileImage = spectator.query('img');

    expect(profileImage).toBeTruthy();
    expect(profileImage).toHaveAttribute('src', 'assets/braxton/profile.png');
    expect(profileImage).toHaveAttribute('loading', 'lazy');
    expect(profileImage).toHaveAttribute('alt', 'Braxton Diggs');
    expect(profileImage).toHaveClass('w-8');
    expect(profileImage).toHaveClass('h-8');
    expect(profileImage).toHaveClass('rounded-full');
  });
});
