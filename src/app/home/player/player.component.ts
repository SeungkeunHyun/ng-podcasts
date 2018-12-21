import { EpisodePlayerService } from './../../_services/episode-player.service';
import { AppState } from 'src/app/_store/app.reducer';
import { Store } from '@ngrx/store';
import { Episode } from './../../_models/episode.model';
import { Cast } from './../../_models/cast.model';
import { Observable, Subscription } from 'rxjs';
import * as $ from 'jquery';

import {
	Component,
	OnInit,
	ViewChild,
	OnDestroy,
	AfterViewInit
} from '@angular/core';
import * as selectors from '../../_store/cast.selectors';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
	cast$: Observable<Cast>;
	episode: Episode;
	loaded = false;
	subs: Subscription;
	controllers = ['fb', 'b', 'p', 'f', 'ff'];
	@ViewChild('player') player;
	constructor(
		private store: Store<AppState>,
		private playService: EpisodePlayerService
	) {}

	ngAfterViewInit() {}

	ngOnInit() {
		this.subs = this.playService.subject.subscribe(ep => {
			this.episode = ep;
			this.cast$ = this.store.select(
				selectors.getCastById(this.episode.castID)
			);
			this.loaded = true;
		});
	}

	setupPlayer(e) {
		if (!this.player) {
			return;
		}
		const pl = e.target;
		console.log('player', pl);
		pl.onpause = () => {
			$('#ctrlP i')
				.removeClass('fa-pause')
				.addClass('fa-play');
			const history = {
				episode: this.episode,
				pausedAt: pl.currentTime,
				storedAt: new Date().getTime()
			};
			this.storePausedEpisode(history);
		};
		pl.onabort = () => {
			const history = {
				episode: this.episode,
				pausedAt: pl.currentTime,
				storedAt: new Date().getTime()
			};
			this.storePausedEpisode(history);
		};
		const hist = this.getHistory(this.episode.id);
		console.log(hist, this.player);
		if (hist) {
			pl.currentTime = hist.pausedAt;
		}
		pl.play();
	}

	getHistory(id) {
		const strBookmarks = localStorage.getItem('bookmarks');
		if (strBookmarks) {
			const bookmarks = JSON.parse(strBookmarks);
			return bookmarks[id];
		}
		return null;
	}

	storePausedEpisode(hist) {
		const strBookmarks = localStorage.getItem('bookmarks');
		let bookmarks = {};
		if (!strBookmarks) {
			bookmarks = {};
		} else {
			bookmarks = JSON.parse(strBookmarks);
		}
		bookmarks[hist.episode.id] = hist;
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks, null, 2));
	}

	getIcon(c: string) {
		let iconClass = 'fa fa-';
		switch (c) {
			case 'fb':
				iconClass += 'fast-backward';
				break;
			case 'b':
				iconClass += 'backward';
				break;
			case 'p':
				iconClass += 'pause';
				break;
			case 'f':
				iconClass += 'forward';
				break;
			case 'ff':
				iconClass += 'fast-forward';
				break;
		}
		return iconClass;
	}

	controlPlayer(ctrl) {
		console.log(ctrl, this.player);
		const pl = this.player.nativeElement;
		switch (ctrl) {
			case 'fb':
				pl.currentTime -= 30;
				break;
			case 'b':
				pl.currentTime -= 5;
				break;
			case 'p':
				if (pl.paused) {
					pl.play();
					$('#ctrlP i').removeClass('fa-play');
					$('#ctrlP i').addClass('fa-pause');
				} else {
					pl.pause();
					$('#ctrlP i').removeClass('fa-pause');
					$('#ctrlP i').addClass('fa-play');
				}
				break;
			case 'f':
				pl.currentTime += 5;
				break;
			case 'ff':
				pl.currentTime += 30;
				break;
		}
	}

	ngOnDestroy() {
		if (this.player) {
			const hist = {
				episode: this.episode,
				pausedAt: this.player.nativeElement.currentTime
			};
			console.log(hist);
			this.storePausedEpisode(hist);
		}
		this.subs.unsubscribe();
	}
}
