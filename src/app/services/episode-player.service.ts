import { Episode } from './../models/episode.model';
import { Injectable, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpisodePlayerService {
  private episodeHistory: Episode[];
  subject: Subject<Episode> = new Subject();

  constructor() {
    this.episodeHistory = [];
  }

  setEpisode(ep) {
    this.episodeHistory.push(ep);
    this.subject.next(ep);
  }
}
