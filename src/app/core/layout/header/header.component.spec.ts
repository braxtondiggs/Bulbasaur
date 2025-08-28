import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory({
    component: HeaderComponent,
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render theme dropdown with all theme options', () => {
    const themeButtons = spectator.queryAll('.dropdown-content button');
    expect(themeButtons).toHaveLength(4);

    const themeTexts = themeButtons.map(button => button.textContent?.trim());
    expect(themeTexts).toEqual(['Light', 'Dark', 'Cyberpunk', 'Synthwave']);
  });

  it('should have proper dropdown structure with DaisyUI classes', () => {
    const dropdown = spectator.query('.dropdown');
    expect(dropdown).toHaveClass('dropdown-end');

    const dropdownButton = spectator.query('.btn');
    expect(dropdownButton).toHaveClass('btn-ghost');
    expect(dropdownButton).toHaveClass('btn-circle');

    const dropdownContent = spectator.query('.dropdown-content');
    expect(dropdownContent).toHaveClass('menu');
    expect(dropdownContent).toHaveClass('shadow');
    expect(dropdownContent).toHaveClass('bg-base-100');
  });

  describe('setTheme', () => {
    beforeEach(() => {
      // Mock document methods
      jest.spyOn(document.documentElement, 'setAttribute');
      jest.spyOn(document.body, 'setAttribute');
    });

    it('should set theme on document elements and localStorage when setTheme is called', () => {
      spectator.component.setTheme('dark');

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(document.body.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme-manual', 'true');
    });

    it('should call setTheme when theme buttons are clicked', () => {
      jest.spyOn(spectator.component, 'setTheme');

      const lightButton = spectator.query('[data-text="Light"]') || spectator.query('button') as HTMLElement;
      const darkButton = spectator.query('[data-text="Dark"]') || spectator.queryAll('button')[1] as HTMLElement;

      if (lightButton && lightButton.textContent?.includes('Light')) {
        spectator.click(lightButton);
        expect(spectator.component.setTheme).toHaveBeenCalledWith('light');
      }

      if (darkButton && darkButton.textContent?.includes('Dark')) {
        spectator.click(darkButton);
        expect(spectator.component.setTheme).toHaveBeenCalledWith('dark');
      }
    });

    it('should work with all available themes', () => {
      const themes = ['light', 'dark', 'cyberpunk', 'synthwave'];

      themes.forEach(theme => {
        spectator.component.setTheme(theme);

        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', theme);
        expect(document.body.setAttribute).toHaveBeenCalledWith('data-theme', theme);
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', theme);
      });
    });
  });
});
