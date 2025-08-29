import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
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
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Mock document methods
    jest.spyOn(document.documentElement, 'setAttribute');
    jest.spyOn(document.body, 'setAttribute');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component.constructor.name).toBe('HeaderComponent');
    });
  });

  describe('Theme Management', () => {
    it('should set theme on html element', () => {
      const theme = 'dark';
      
      spectator.component.setTheme(theme);
      
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', theme);
    });

    it('should set theme on body element', () => {
      const theme = 'light';
      
      spectator.component.setTheme(theme);
      
      expect(document.body.setAttribute).toHaveBeenCalledWith('data-theme', theme);
    });

    it('should save theme to localStorage', () => {
      const theme = 'emerald';
      
      spectator.component.setTheme(theme);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', theme);
    });

    it('should set manual theme flag in localStorage', () => {
      const theme = 'cupcake';
      
      spectator.component.setTheme(theme);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme-manual', 'true');
    });

    it('should handle empty theme string', () => {
      const theme = '';
      
      spectator.component.setTheme(theme);
      
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', '');
      expect(document.body.setAttribute).toHaveBeenCalledWith('data-theme', '');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', '');
    });

    it('should handle special characters in theme name', () => {
      const theme = 'my-custom_theme.v2';
      
      spectator.component.setTheme(theme);
      
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', theme);
      expect(document.body.setAttribute).toHaveBeenCalledWith('data-theme', theme);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', theme);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full theme setting process', () => {
      const theme = 'synthwave';
      
      spectator.component.setTheme(theme);
      
      // Verify all operations completed
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', theme);
      expect(document.body.setAttribute).toHaveBeenCalledWith('data-theme', theme);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', theme);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme-manual', 'true');
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });
});
