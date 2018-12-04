import { EpisodePlayerService } from './../../_services/episode-player.service';
import { AppState } from 'src/app/_store/app.reducer';
import { Store } from '@ngrx/store';
import { Episode } from './../../_models/episode.model';
import { Cast } from './../../_models/cast.model';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as selectors from '../../_store/cast.selectors';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: [ './player.component.css' ]
})
export class PlayerComponent implements OnInit, OnDestroy {
	cast$: Observable<Cast>;
	episode: Episode;
	loaded = false;
	subs: Subscription;
	@ViewChild('player') player;
	constructor(private store: Store<AppState>, private playService: EpisodePlayerService) {}

	ngOnInit() {
		this.subs = this.playService.subject.subscribe((ep) => {
			this.episode = ep;
			this.cast$ = this.store.select(selectors.getCastById(this.episode.castID));
			this.loaded = true;
			console.log(this.episode, this.player);
		});
	}

	ngOnDestroy() {
		this.subs.unsubscribe();
	}
}
