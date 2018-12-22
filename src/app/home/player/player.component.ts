import { EpisodePlayerService } from './../../_services/episode-player.service';
import { AppState } from 'src/app/_store/app.reducer';
import { Store } from '@ngrx/store';
import { Episode } from './../../_models/episode.model';
import { Cast } from './../../_models/cast.model';
import { Observable, Subscription, Subject } from 'rxjs';
import * as $ from 'jquery';

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as selectors from '../../_store/cast.selectors';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  cast$: Observable<Cast>;
  episode: Episode;
	interval = null;
	player: HTMLMediaElement;
	percent: Subject<number>;
	loaded = false;
	subs: Subscription;
	controllers = ['fb', 'b', 'p', 'f', 'ff'];
	constructor(
		private store: Store<AppState>,
		private playService: EpisodePlayerService
	) {
		this.percent = new Subject<number>();
	}

	ngAfterViewInit() {
		console.log('after view init');
		this.setupPlayer();
	}

	ngOnInit() {
		this.subs = this.playService.subject.subscribe(ep => {
			this.episode = ep;
			this.cast$ = this.store.select(
				selectors.getCastById(this.episode.castID)
			);
			this.loaded = true;
			if (!this.player) {
				if (this.episode.mediaURL.indexOf('.mp3') > -1) {
					this.player = document.createElement('audio');
				} else {
					this.player = document.createElement('video');
				}
				this.player.onloadeddata = () => {
					this.setupPlayer();
				};
			}
			this.preparePlayer();
		});
	}

	getProgressPct(): number {
		return Math.floor((this.player.currentTime / this.player.duration) * 100);
	}

	preparePlayer() {
		this.player.src = this.episode.mediaURL;
		this.player.preload = 'true';
		const hist = this.getHistory(this.episode.id);
		console.log(hist, this.player);
		if (hist) {
			this.player.currentTime = hist.pausedAt;
		}
		$('#ctrlP i')
			.removeClass('fa-play')
			.addClass('fa-pause');
		this.player.play();
	}

	setupPlayer() {
		$('#divPlayer').empty();
		$('#divPlayer').append(this.player);
		console.log('setup player');
		if (!this.player) {
			return;
		}
		console.log('player', this.player);
		this.player.onplay = () => {
			console.log('player started!');
		};
		this.player.ontimeupdate = () => {
			$('#divProgress').css('width', this.getProgressPct() + '%');
		};
		this.player.onended = () => {
			this.deleteEndedEpisode();
		};
		this.player.onpause = () => {
			console.log('player paused');
			$('#ctrlP i')
				.removeClass('fa-pause')
				.addClass('fa-play');
			const history = {
				episode: this.episode,
				pausedAt: this.player.currentTime,
				storedAt: new Date().getTime()
			};
			this.storePausedEpisode(history);
		};
		this.player.onabort = () => {
			const history = {
				episode: this.episode,
				pausedAt: this.player.currentTime,
				storedAt: new Date().getTime()
			};
			this.storePausedEpisode(history);
		};
	}

	deleteEndedEpisode() {
		const strBookmarks = localStorage.getItem('bookmarks');
		let bookmarks = {};
		if (!strBookmarks) {
			return;
		}
		bookmarks = JSON.parse(strBookmarks);
		delete bookmarks[this.episode.id];
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks, null, 2));
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
		switch (ctrl) {
			case 'fb':
				this.player.currentTime -= 30;
				break;
			case 'b':
				this.player.currentTime -= 5;
				break;
			case 'p':
				if (this.player.paused) {
					this.player.play();
					$('#ctrlP i').removeClass('fa-play');
					$('#ctrlP i').addClass('fa-pause');
				} else {
					this.player.pause();
					$('#ctrlP i').removeClass('fa-pause');
					$('#ctrlP i').addClass('fa-play');
				}
				break;
			case 'f':
				this.player.currentTime += 5;
				break;
			case 'ff':
				this.player.currentTime += 30;
				break;
		}
	}

	ngOnDestroy() {
		if (this.player) {
			const hist = {
				episode: this.episode,
				pausedAt: this.player.currentTime
			};
			console.log(hist);
			this.storePausedEpisode(hist);
		}
		this.subs.unsubscribe();
	}
}
