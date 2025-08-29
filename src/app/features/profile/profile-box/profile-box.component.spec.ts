import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { GoogleAnalyticsService } from '@shared/services';
import { mockGoogleAnalyticsService, testNgIconsModule } from '@shared/testing/test-utils';
import { ProfileBoxComponent } from './profile-box.component';

// Mock Firestore
const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  collectionGroup: jest.fn()
};

describe('ProfileBoxComponent', () => {
  let spectator: Spectator<ProfileBoxComponent>;

  const createComponent = createComponentFactory({
    component: ProfileBoxComponent,
    imports: [LazyLoadFadeDirective, testNgIconsModule],
    providers: [
      { provide: GoogleAnalyticsService, useValue: mockGoogleAnalyticsService },
      { provide: Firestore, useValue: mockFirestore }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render profile card with DaisyUI classes', () => {
    const profileCard = spectator.query('.card.bg-primary');
    expect(profileCard).toBeTruthy();
    expect(profileCard).toHaveClass('shadow-xl');
    expect(profileCard).toHaveClass('mb-4');
    expect(profileCard).toHaveClass('text-primary-content');
  });

  it('should display avatar with profile image', () => {
    const avatar = spectator.query('.avatar');
    expect(avatar).toBeTruthy();
    expect(avatar).toHaveClass('mx-auto');
    expect(avatar).toHaveClass('mb-4');

    const avatarDiv = spectator.query('.avatar > div');
    expect(avatarDiv).toBeTruthy();
    expect(avatarDiv).toHaveClass('w-48');
    expect(avatarDiv).toHaveClass('rounded-full');

    const profileImage = spectator.query('.avatar img');
    expect(profileImage).toBeTruthy();
    expect(profileImage).toHaveAttribute('appLazyLoadFade', 'assets/braxton/profile.png');
    expect(profileImage).toHaveAttribute('alt', 'Braxton Diggs');
  });

  it('should display name and title', () => {
    const nameElement = spectator.query('.card-title');
    expect(nameElement).toHaveText('Braxton Diggs');
    expect(nameElement).toHaveClass('justify-center');
    expect(nameElement).toHaveClass('text-3xl');
    expect(nameElement).toHaveClass('mb-2');

    const titleElement = spectator.query('p');
    expect(titleElement).toHaveText('Front-end Developer');
    expect(titleElement).toHaveClass('mb-4');
  });

  it('should contain social component', () => {
    // With shallow rendering, child components are rendered as plain elements
    expect(spectator.query('app-social')).toBeTruthy();
  });

  it('should contain instagram component in secondary card', () => {
    const instagramCard = spectator.query('.card.bg-base-100');
    expect(instagramCard).toBeTruthy();
    expect(instagramCard).toHaveClass('shadow-xl');
    expect(instagramCard).toHaveClass('min-h-80');

    // With shallow rendering, child components are rendered as plain elements
    expect(spectator.query('app-instagram')).toBeTruthy();
  });

  it('should have proper card structure', () => {
    const cardBody = spectator.query('.card-body');
    expect(cardBody).toBeTruthy();
    expect(cardBody).toHaveClass('text-center');

    const cardInfo = spectator.query('.card-info');
    expect(cardInfo).toBeTruthy();
  });
});
