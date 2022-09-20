import { Spectator, createSpyObject, createComponentFactory } from '@ngneat/spectator/jest';
import { InstagramComponent } from './instagram.component';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MaterialModule } from 'src/app/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('InstagramComponent', () => {
  let spectator: Spectator<InstagramComponent>;

  const data = of([{ "SourceUrl": "https://storage.googleapis.com/download/storage/v1/b/bulbasaur-bfb64.appspot.com/o/instagram%2FCWepSuXrTsX.jpeg?generation=1637370968273624&alt=media", "Caption": "Water Wall 🧱 💦", "Url": "https://instagr.am/p/CWepSuXrTsX/", "CreatedAt": { "seconds": 1637370968, "nanoseconds": 367000000 } }, { "SourceUrl": "https://firebasestorage.googleapis.com/v0/b/bulbasaur-bfb64.appspot.com/o/instagram%2F118683005_308694883721559_7400362705411114887_n.jpeg?alt=media&token=99cf6af8-ba92-4965-8ab9-bc7af6fc7558", "Url": "https://www.instagram.com/p/CEW1uGkgeAi/", "Caption": "Photo by Braxton Diggs in Central Park.", "CreatedAt": { "seconds": 1616569438, "nanoseconds": 114000000 } }, { "Caption": "Photo by Braxton Diggs in Stairway To Heaven.", "CreatedAt": { "seconds": 1616568264, "nanoseconds": 0 }, "SourceUrl": "https://firebasestorage.googleapis.com/v0/b/bulbasaur-bfb64.appspot.com/o/instagram%2F66181972_123033215641441_9176721204245296322_n.jpeg?alt=media&token=3637b4bf-a9a0-460c-8b7f-44e19c905666", "Url": "https://www.instagram.com/p/B0UXbTxAaBo/" }, { "SourceUrl": "https://firebasestorage.googleapis.com/v0/b/bulbasaur-bfb64.appspot.com/o/instagram%2F47581811_2294237410860089_2180303258105229140_n.jpeg?alt=media&token=ea0e578d-8e65-4cb2-bdb0-ce78cdae96be", "CreatedAt": { "seconds": 1616568180, "nanoseconds": 0 }, "Caption": "Photo by Braxton Diggs in Kansas City Union Station.", "Url": "https://www.instagram.com/p/BsEImVhANcz/" }, { "SourceUrl": "https://firebasestorage.googleapis.com/v0/b/bulbasaur-bfb64.appspot.com/o/instagram%2F45273571_351302039009773_657154322966714364_n.jpeg?alt=media&token=f160369d-d39a-4147-8461-f8a8be55ee9c", "CreatedAt": { "seconds": 1616568120, "nanoseconds": 0 }, "Url": "https://www.instagram.com/p/BqLRrsDgrzT/", "Caption": "Photo by Braxton Diggs in Walkway Over The Hudson." }, { "Caption": "Photo by Braxton Diggs in Knockdown Center.", "CreatedAt": { "seconds": 1616568060, "nanoseconds": 0 }, "Url": "https://www.instagram.com/p/BqGIzT8gm1U/", "SourceUrl": "https://firebasestorage.googleapis.com/v0/b/bulbasaur-bfb64.appspot.com/o/instagram%2F44425919_561576747619241_8847645400142134480_n.jpeg?alt=media&token=1017841b-4830-4c2b-8410-8d9806566fd8" }]);
  const mockFireStore = createSpyObject(AngularFirestore);
  mockFireStore.collection.andReturn({ valueChanges: jest.fn(() => data) })

  const createComponent = createComponentFactory({
    component: InstagramComponent,
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      LazyLoadImageModule,
      MaterialModule,
      HttpClientModule
    ],
    providers: [
      { provide: AngularFirestore, useValue: mockFireStore }
    ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    spectator.component.ngOnInit();
  });
});
