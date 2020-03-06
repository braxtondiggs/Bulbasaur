import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let spectator: SpectatorService<ScrollService>;
  const createService = createServiceFactory(ScrollService);

  beforeEach(() => spectator = createService());

  it('should create', async () => {
    expect(spectator.service).toBeTruthy();
  });
});
