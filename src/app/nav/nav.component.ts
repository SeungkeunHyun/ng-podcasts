import { EpisodePlayerService } from 'src/app/_services/episode-player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CastRequested } from './../_store/cast.action';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../_store/app.reducer';
import { Store } from '@ngrx/store';
import { AlertifyService } from '../_services/alertify.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
	@ViewChild('searchWord') searchWord;
	bookmarks: [];
	constructor(
		private store: Store<AppState>,
		private route: ActivatedRoute,
		private router: Router,
		private playService: EpisodePlayerService,
		private alertify: AlertifyService
	) {}

	ngOnInit() {
		this.store.dispatch(new CastRequested());
	}

	refreshCasts() {
		this.store.dispatch(new CastRequested());
	}

	loadBookmarks() {
		this.bookmarks = [];
		const strBookmarks = localStorage.getItem('bookmarks');
		if (strBookmarks) {
			const jsonBM = JSON.parse(strBookmarks);
			for (const k in jsonBM) {
				this.bookmarks.push(jsonBM[k]);
			}
			console.log(this.bookmarks);
			this.bookmarks.sort((a, b) => {
				return b.storedAt - a.storedAt;
			});
		}
	}

	playCast(bm) {
		console.log(bm);
		this.playService.setEpisode(bm.episode);
	}

	searchCast(e) {
		if (
			e.key === 'Enter' &&
			this.searchWord.nativeElement.value.trim().length > 1
		) {
			console.log('start search', this.searchWord.nativeElement.value);
			this.router.navigate([{ outlets: { modal: 'search' } }], {
				queryParams: { term: this.searchWord.nativeElement.value.trim() }
			});
		}
	}
}
