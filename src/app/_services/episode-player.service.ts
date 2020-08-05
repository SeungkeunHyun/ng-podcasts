import { Episode } from './../_models/episode.model';
import { Injectable, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EpisodePlayerService {
	private episodeHistory: Episode[];
	subject: Subject<Episode> = new Subject();
	subAll: Subject<Episode[]> = new Subject();

	constructor() {
		this.episodeHistory = [];
	}

	setEpisode(ep) {
		this.episodeHistory.push(ep);
		this.subject.next(ep);
	}

	fillEpisodes(episodes: Episode[]) {
		this.subAll.next(episodes);
	}
}
