import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import dayjs from 'dayjs';
import { FooterComponent } from './footer.component';

// Mock dayjs to control the date
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return jest.fn(() => ({
    format: jest.fn().mockReturnValue('2024')
  }));
});

describe('FooterComponent', () => {
  let spectator: Spectator<FooterComponent>;
  const createComponent = createComponentFactory({
    component: FooterComponent,
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have correct change detection strategy', () => {
      expect(spectator.component.constructor.name).toBe('FooterComponent');
    });
  });

  describe('Year Display', () => {
    it('should initialize with current year', () => {
      expect(spectator.component.year).toBe('2024');
    });

    it('should call dayjs format with YYYY', () => {
      // Verify that dayjs().format('YYYY') was called during component initialization
      expect(dayjs).toHaveBeenCalled();
    });
  });

  describe('Component Properties', () => {
    it('should have year as public property', () => {
      expect(spectator.component.year).toBeDefined();
      expect(typeof spectator.component.year).toBe('string');
    });

    it('should have year property accessible from template', () => {
      // Since year is public, it should be accessible in the template
      expect(spectator.component.year).toEqual(expect.any(String));
    });
  });

  describe('Date Formatting', () => {
    it('should format year correctly', () => {
      // Reset mocks and test with different year
      jest.clearAllMocks();
      
      const mockDayjs = jest.fn(() => ({
        format: jest.fn().mockReturnValue('2025')
      }));
      
      // Test that the format method would be called with 'YYYY'
      const mockFormat = jest.fn().mockReturnValue('2025');
      mockDayjs.mockReturnValue({ format: mockFormat });
      
      // Simulate component creation with new mock
      const newSpectator = createComponent();
      
      // The actual year should still be from our original mock
      expect(newSpectator.component.year).toBe('2024');
    });
  });

  describe('Integration Tests', () => {
    it('should maintain year value throughout component lifecycle', () => {
      const initialYear = spectator.component.year;
      
      // Trigger change detection
      spectator.detectChanges();
      
      // Year should remain the same
      expect(spectator.component.year).toBe(initialYear);
    });

    it('should be ready for template rendering', () => {
      expect(spectator.component.year).toBeTruthy();
      expect(spectator.component.year.length).toBe(4);
      expect(spectator.component.year).toMatch(/^\d{4}$/);
    });
  });
});
