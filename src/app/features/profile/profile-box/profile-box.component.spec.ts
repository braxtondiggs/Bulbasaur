import { createComponentFactory, Spectator, createSpyObject } from '@ngneat/spectator/jest';
import { SocialComponent } from '../social';
import { ProfileBoxComponent } from './profile-box.component';
import { InstagramComponent } from './instagram/instagram.component';
import { testNgIconsModule, mockGoogleAnalyticsService } from '@shared/testing/test-utils';
import { GoogleAnalyticsService } from '@shared/services';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '@env/environment';
import { of } from 'rxjs';

describe('ProfileBoxComponent', () => {
  let spectator: Spectator<ProfileBoxComponent>;

  // Mock Firestore
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => of([])) });

  const createComponent = createComponentFactory({
    component: ProfileBoxComponent,
    declarations: [SocialComponent, InstagramComponent],
    imports: [
      testNgIconsModule,
      AngularFireModule.initializeApp(environment.firebase)
    ],
    providers: [
      { provide: GoogleAnalyticsService, useValue: mockGoogleAnalyticsService },
      { provide: AngularFirestore, useValue: mockFireStore }
    ],
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render profile card with DaisyUI classes', () => {
    const profileCard = spectator.query('.card.bg-accent-content');
    expect(profileCard).toBeTruthy();
    expect(profileCard).toHaveClass('shadow-xl');
    expect(profileCard).toHaveClass('mb-4');
    expect(profileCard).toHaveClass('text-neutral-content');
  });

  it('should display profile image with correct attributes', () => {
    const profileImage = spectator.query('img');
    expect(profileImage).toBeTruthy();
    expect(profileImage).toHaveAttribute('src', 'assets/braxton/profile.png');
    expect(profileImage).toHaveAttribute('loading', 'lazy');
    expect(profileImage).toHaveAttribute('alt', 'Braxton Diggs');
    expect(profileImage).toHaveClass('w-24');
    expect(profileImage).toHaveClass('h-24');
    expect(profileImage).toHaveClass('rounded-full');
    expect(profileImage).toHaveClass('mx-auto');
    expect(profileImage).toHaveClass('mb-4');
  });

  it('should display name and title', () => {
    const nameElement = spectator.query('.card-title');
    expect(nameElement).toHaveText('Braxton Diggs');
    expect(nameElement).toHaveClass('justify-center');
    expect(nameElement).toHaveClass('text-3xl');
    expect(nameElement).toHaveClass('mb-2');

    const titleElement = spectator.query('.text-base-content\\/70');
    expect(titleElement).toHaveText('Front-end Developer');
    expect(titleElement).toHaveClass('mb-4');
  });

  it('should contain social component', () => {
    expect(spectator.query('app-social')).toBeTruthy();
  });

  it('should contain instagram component in secondary card', () => {
    const instagramCard = spectator.query('.card.bg-base-100');
    expect(instagramCard).toBeTruthy();
    expect(instagramCard).toHaveClass('shadow-xl');
    expect(instagramCard).toHaveClass('min-h-80');

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
