import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { InstagramComponent } from './instagram.component';
import { Firestore } from '@angular/fire/firestore';
import { LazyLoadFadeDirective } from '@shared/directives/lazy-load-fade.directive';
import { testNgIconsModule } from '@shared/testing/test-utils';
import { of, throwError, Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock Firebase Firestore functions at module level
const mockCollectionData = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();

jest.mock('@angular/fire/firestore', () => {
  const actual = jest.requireActual('@angular/fire/firestore');
  return {
    ...actual,
    collection: (...args: any[]) => mockCollection(...args),
    collectionData: (...args: any[]) => mockCollectionData(...args),
    query: (...args: any[]) => mockQuery(...args),
    orderBy: (...args: any[]) => mockOrderBy(...args),
    limit: (...args: any[]) => mockLimit(...args)
  };
});

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
    app: { name: 'test-app' },
    toFirestore: jest.fn(),
    fromFirestore: jest.fn()
  } as unknown as Firestore;

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
    shallow: true,
    detectChanges: false
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockCollection.mockReturnValue({ path: 'instagram' });
    mockOrderBy.mockReturnValue('orderBy');
    mockLimit.mockReturnValue('limit');
    mockQuery.mockReturnValue('query');
    mockCollectionData.mockReturnValue(of(mockInstagramData));
    
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize with default instagram observable', () => {
    expect(spectator.component.instagram$).toBeTruthy();
    expect(spectator.component.instagram$).toBeInstanceOf(Observable);
  });

  it('should initialize Instagram data on ngOnInit', () => {
    spectator.component.ngOnInit();
    
    expect(mockCollection).toHaveBeenCalledWith(mockFirestore, 'instagram');
    expect(mockCollectionData).toHaveBeenCalled();
  });

  it('should handle Firebase data loading successfully', (done) => {
    spectator.component.ngOnInit();
    
    spectator.component.instagram$.subscribe(data => {
      if (data !== null && Array.isArray(data)) {
        expect(data).toEqual(mockInstagramData);
        expect(data.length).toBe(2);
        done();
      }
    });
  });

  it('should handle Firebase errors gracefully', (done) => {
    mockCollectionData.mockReturnValue(throwError(() => new Error('Firebase error')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    spectator.component.ngOnInit();
    
    spectator.component.instagram$.subscribe(data => {
      expect(data).toEqual([]);
      consoleSpy.mockRestore();
      done();
    });
  });

  it('should setup Firestore query correctly', () => {
    spectator.component.ngOnInit();
    
    expect(mockCollection).toHaveBeenCalledWith(mockFirestore, 'instagram');
    expect(mockOrderBy).toHaveBeenCalledWith('CreatedAt', 'desc');
    expect(mockLimit).toHaveBeenCalledWith(6);
    expect(mockQuery).toHaveBeenCalled();
  });

  it('should handle initialization errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCollection.mockImplementation(() => {
      throw new Error('Collection error');
    });

    expect(() => {
      spectator.component.ngOnInit();
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  it('should emit null initially from observable', (done) => {
    spectator.component.ngOnInit();
    
    let emissionCount = 0;
    spectator.component.instagram$.subscribe(data => {
      emissionCount++;
      if (emissionCount === 1) {
        expect(data).toBe(null);
        done();
      }
    });
  });
});