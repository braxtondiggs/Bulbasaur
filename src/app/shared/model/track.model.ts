import { IArtist } from './artist.model';

export interface ITrack {
  id?: string;
  name?: string;
  genres?: [string];
  created?: string;
  externalURL?: string;
  duration?: number;
  artist?: IArtist[];
  image?: string;
}
