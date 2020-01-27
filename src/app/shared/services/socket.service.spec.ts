import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { SocketService } from './socket.service';

describe('SocketService', () => {
  let spectator: SpectatorService<SocketService>;
  const createService = createServiceFactory(SocketService);

  beforeEach(() => spectator = createService());
  it('should create', async () => {
    expect(spectator.service).toBeTruthy();
  });
});
