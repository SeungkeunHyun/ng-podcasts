import { EpisodePlayerService } from './../../services/episode-player.service';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Episode } from './../../models/episode.model';
import { Cast } from './../../models/cast.model';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as selectors from '../../store/cast.selectors';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: [ './player.component.css' ]
})
export class PlayerComponent implements OnInit {
	cast$: Observable<Cast>;
	episode: Episode;
	loaded = false;
	@ViewChild('player') player;
	constructor(private store: Store<AppState>, private playService: EpisodePlayerService) {}

	ngOnInit() {
		this.playService.subject.subscribe((ep) => {
			this.episode = ep;
			this.cast$ = this.store.select(selectors.getCastById(this.episode.castID));
			this.loaded = true;
			console.log(this.episode);
		});
	}
}
