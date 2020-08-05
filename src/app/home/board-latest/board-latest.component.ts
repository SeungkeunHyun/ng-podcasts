import { ElasticService } from './../../_services/elastic.service';
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
	styleUrls: ['./board-latest.component.css']
})
export class BoardLatestComponent implements OnInit, OnDestroy {
	latestEpisodes: Episode[];
	subs: Subscription[] = [];
	ep_label = 'Latest';
	constructor(
		private store: Store<AppState>,
		private playService: EpisodePlayerService,
		private elasticService: ElasticService
	) {
		this.subs.push(
			this.elasticService.episodes.subscribe(episodes => {
				this.latestEpisodes = episodes;
			})
		);
		this.subs.push(
			this.elasticService.ep_label.subscribe(
				ep_label => (this.ep_label = ep_label)
			)
		);
	}

	ngOnInit() {
		const sub = this.store.select('casts').subscribe(casts => {
			this.store.select(selectors.selectLatestEpisodes).subscribe(eps => {
				eps.sort((a, b) => {
					if (a.pubDate > b.pubDate) {
						return -1;
					} else if (a.pubDate === b.pubDate) {
						return 0;
					}
					return 1;
				});
				this.latestEpisodes = eps;
			});
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
