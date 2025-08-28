import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { InstagramComponent } from './instagram.component';
import { Firestore } from '@angular/fire/firestore';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InstagramComponent', () => {
  let spectator: Spectator<InstagramComponent>;

  const mockInstagramData = [
    {
      'SourceUrl': 'https://storage.googleapis.com/download/storage/v1/b/bulbasaur-bfb64.appspot.com/o/instagram%2FCWepSuXrTsX.jpeg?generation=1637370968273624&alt=media',
      'Caption': 'Water Wall 🧱 💦',
      'Url': 'https://instagr.am/p/CWepSuXrTsX/',
      'CreatedAt': { 'seconds': 1637370968, 'nanoseconds': 367000000 }
    },
    {
      'SourceUrl': 'https://firebasestorage.googleapis.com/v0/b/bulbasaur-bfb64.appspot.com/o/instagram%2F118683005_308694883721559_7400362705411114887_n.jpeg?alt=media&token=99cf6af8-ba92-4965-8ab9-bc7af6fc7558',
      'Url': 'https://www.instagram.com/p/CEW1uGkgeAi/',
      'Caption': 'Photo by Braxton Diggs in Central Park.',
      'CreatedAt': { 'seconds': 1616569438, 'nanoseconds': 114000000 }
    }
  ];

  const mockFirestore = {
    // Mock the new modular Firebase functions
    app: {},
    toFirestore: jest.fn(),
    fromFirestore: jest.fn()
  } as unknown as Firestore;

  // Mock the Firebase modular functions globally
  jest.mock('@angular/fire/firestore', () => ({
    ...jest.requireActual('@angular/fire/firestore'),
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    collectionData: jest.fn(() => of(mockInstagramData))
  }));

  const createComponent = createComponentFactory({
    component: InstagramComponent,
    imports: [
      LazyLoadFadeDirective,
      testNgIconsModule
    ],
    providers: [
      { provide: Firestore, useValue: mockFirestore }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize instagram observable on ngOnInit', () => {
    spectator.component.ngOnInit();
    expect(spectator.component.instagram$).toBeTruthy();
  });

  it('should handle component initialization', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component.instagram$).toBeDefined();
  });

  it('should have proper accessibility attributes for Instagram links', () => {
    spectator.detectChanges();
    
    // Wait for async data to load and check template structure
    spectator.component.instagram$.subscribe(() => {
      spectator.detectChanges();
      
      const links = spectator.queryAll('a[target="_blank"]');
      links.forEach(link => {
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('title')).toBeTruthy();
      });
    });
  });
});
