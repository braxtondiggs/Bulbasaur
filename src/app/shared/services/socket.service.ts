import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITrack, Event } from '../model';

import socketIo from 'socket.io-client';

const SERVER_URL = 'https://braxtondiggs.com';

@Injectable()
export class SocketService {
  private socket: any;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL, { transports: ['websocket', 'polling'] });
  }

  public send(message: ITrack): void {
    this.socket.emit('track', message);
  }

  public onMessage(): Observable<ITrack> {
    return new Observable<ITrack>((observer) => {
      this.socket.on('track', (data: ITrack) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }
}
