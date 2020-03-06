import { createServiceFactory, SpectatorService, mockProvider } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from './google-analytics.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalytics, AngularFireAnalyticsModule } from '@angular/fire/analytics';

describe('GoogleAnalyticsService', () => {
  let spectator: SpectatorService<GoogleAnalyticsService>;
  const createService = createServiceFactory({
    service: GoogleAnalyticsService,
    imports: [AngularFireModule.initializeApp(environment.firebase)],
    providers: [
      mockProvider(AngularFireAnalytics, {
        logEvent: () => jest.fn()
      })
    ]
  });

  beforeEach(() => spectator = createService());

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should send a gtag event', () => {
    const analytics = spectator.inject(AngularFireAnalytics);
    const spy = spyOn(analytics, 'logEvent');
    spectator.service.eventEmitter('event_category', 'event_action');
    expect(spy).toHaveBeenCalledWith('event_action', {
      category: 'event_category', label: null, value: null
    });
  });
});
