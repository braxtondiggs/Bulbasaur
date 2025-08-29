import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import dayjs from 'dayjs';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let spectator: Spectator<FooterComponent>;
  const createComponent = createComponentFactory({
    component: FooterComponent,
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display current year', () => {
    const currentYear = dayjs().format('YYYY');
    expect(spectator.component.year).toBe(currentYear);
    expect(spectator.query('div')).toContainText(currentYear);
  });

  it('should display copyright text with name', () => {
    const footerText = spectator.query('div')?.textContent;
    expect(footerText).toContain('Braxton Diggs');
    expect(footerText).toContain('All Rights Reserved');
  });

  it('should have center-aligned text', () => {
    expect(spectator.query('div')).toHaveClass('text-center');
  });

  it('should initialize year on component creation', () => {
    // Test that year is set during component initialization
    const expectedYear = dayjs().format('YYYY');
    expect(spectator.component.year).toBe(expectedYear);
  });
});
