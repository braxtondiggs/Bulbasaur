import { Spectator, createSpyObject, createComponentFactory } from '@ngneat/spectator/jest';
import { InstagramComponent } from './instagram.component';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

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

  const data$ = of(mockInstagramData);
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => data$) });

  const createComponent = createComponentFactory({
    component: InstagramComponent,
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      LazyLoadImageModule,
      HttpClientModule
    ],
    providers: [
      { provide: AngularFirestore, useValue: mockFireStore }
    ],
    shallow: true
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize instagram observable on ngOnInit', () => {
    spectator.component.ngOnInit();
    expect(spectator.component.instagram$).toBeTruthy();
    expect(mockFireStore.collection).toHaveBeenCalledWith('instagram', expect.any(Function));
  });

  it('should query firebase collection with correct parameters', () => {
    spectator.component.ngOnInit();

    // Get the callback function passed to collection
    const collectionCalls = (mockFireStore.collection as jest.Mock).mock.calls;
    const lastCall = collectionCalls[collectionCalls.length - 1];
    const queryCallback = lastCall[1];

    // Mock the ref object
    const mockRef = {
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis()
    };

    // Call the query callback
    queryCallback(mockRef);

    expect(mockRef.orderBy).toHaveBeenCalledWith('CreatedAt', 'desc');
    expect(mockRef.limit).toHaveBeenCalledWith(6);
  });

  it('should have instagram observable that emits data', (done) => {
    spectator.component.ngOnInit();

    spectator.component.instagram$.subscribe(data => {
      expect(data).toEqual(mockInstagramData);
      expect(data).toHaveLength(2);
      expect(data[0].Caption).toBe('Water Wall 🧱 💦');
      done();
    });
  });
});
