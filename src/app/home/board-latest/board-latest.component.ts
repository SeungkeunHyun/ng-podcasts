import { EpisodePlayerService } from './../../_services/episode-player.service';
import { Episode } from './../../_models/episode.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/_store/app.reducer';
import * as selectors from '../../_store/cast.selectors';

@Component({
	selector: 'app-board-latest',
	templateUrl: './board-latest.component.html',
	styleUrls: [ './board-latest.component.css' ]
})
export class BoardLatestComponent implements OnInit, OnDestroy {
	latestEpisodes: Observable<Episode[]>;
	subs: Subscription[] = [];
	constructor(private store: Store<AppState>, private playService: EpisodePlayerService) {}

	ngOnInit() {
		const sub = this.store.select('casts').subscribe((casts) => {
			this.latestEpisodes = this.store.select(selectors.selectLatestEpisodes);
		});
		this.subs.push(sub);
	}

	playCast(ep) {
		this.playService.setEpisode(ep);
	}

	ngOnDestroy() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
	}
}
