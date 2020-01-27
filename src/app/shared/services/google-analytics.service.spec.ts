import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let spectator: SpectatorService<GoogleAnalyticsService>;
  const createService = createServiceFactory(GoogleAnalyticsService);

  beforeEach(() => spectator = createService());

  it('should create', async () => {
    expect(spectator.service).toBeTruthy();
  });
  it('should send a gtag event', () => {
    const gaSpy = spyOn(spectator.service, 'gtag');
    spectator.service.eventEmitter('event_category', 'event_action');

    expect(gaSpy).toHaveBeenCalledWith('event', 'event_action', {
      event_category: 'event_category', event_label: null, value: null
    });
  });
});
