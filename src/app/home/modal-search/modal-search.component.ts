import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { ElasticService } from './../../_services/elastic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Episode } from 'src/app/_models/episode.model';
import * as selectors from '../../_store/cast.selectors';
import { AppState } from '../../_store/app.reducer';
import { EpisodePlayerService } from 'src/app/_services/episode-player.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
	selector: 'app-modal-search',
	templateUrl: './modal-search.component.html',
	styleUrls: [ './modal-search.component.css' ]
})
export class ModalSearchComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('basicModal') basicModal;
	@Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
	searchWord: string;
	dicCast: {};
	episodes: Episode[] = [];
	pagedItems: Episode[];
	subs: Subscription[];
	searchFinished = false;
	constructor(
		private store: Store<AppState>,
		private route: ActivatedRoute,
		private elastic: ElasticService,
		private router: Router,
		private playService: EpisodePlayerService,
		private alertify: AlertifyService,
		private location: Location
	) {
		this.subs = [];
	}

	ngOnInit() {
		this.searchWord = this.route.snapshot.queryParams['term'];
		this.subs.push(this.route.data.subscribe((data) => this.processSearchResult(data.results)));
	}

	ngOnDestroy() {
		this.subs.forEach((sub) => sub.unsubscribe());
	}

	ngAfterViewInit() {
		if (this.episodes && this.episodes.length > 0) {
			this.basicModal.show();
			return;
		}
		console.log(this.basicModal);
		this.location.back();
		this.alertify.warning('There is no result for this search');
		// this.search();
	}
	/*
	search() {
		this.elastic
			.search('casts', {
				from: 0,
				size: 100,
				query: {
					multi_match: {
						query: this.searchWord,
						fields: [ 'title', 'subtitle' ]
					}
				}
			})
			.then((data) => this.processSearchResult(data));
	}
*/
	getCast(ep: Episode) {
		console.log('cast id', ep);
		const cast = this.store.select(selectors.getCastById(ep.castID));
		console.log(cast);
		return cast;
	}

	getPagedItems(items) {
		console.log(items);
		this.pagedItems = items;
	}

	processSearchResult(data) {
		console.log(data);
		this.dicCast = {};
		const hits = data.hits.hits;
		for (const hit of hits) {
			const ep = {
				id: hit._id,
				castID: hit._source.cast_episode.parent,
				duration: hit._source.duration,
				mediaURL: hit._source.mediaURL,
				pubDate: hit._source.pubDate,
				title: hit._source.title,
				summary: hit._source.hasOwnProperty('summary') ? hit._source.summary : null,
				subtitle: hit._source.hasOwnProperty('subtitle') ? hit._source.subtitle : null
			};
			this.episodes.push(ep);
			if (!this.dicCast.hasOwnProperty(ep.castID)) {
				this.subs.push(this.getCast(ep).subscribe((cast) => (this.dicCast[ep.castID] = cast)));
			}
		}
		this.searchFinished = true;
	}

	closeModal($event) {
		this.router.navigate([ { outlets: { modal: null } } ]);
		this.modalClose.next($event);
	}

	play(ep: Episode) {
		console.log(ep);
		this.playService.setEpisode(ep);
	}
}
