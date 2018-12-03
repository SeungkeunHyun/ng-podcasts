import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ElasticService } from './../../services/elastic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Episode } from 'src/app/models/episode.model';
import * as selectors from '../../store/cast.selectors';
import { AppState } from '../../store/app.reducer';
import { Paging } from 'src/app/models/paging.model';
import { EpisodePlayerService } from 'src/app/services/episode-player.service';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css']
})
export class ModalSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('basicModal') basicModal;
  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  searchWord: string;
  dicCast: {};
  episodes: Episode[] = [];
  pagedItems: Episode[];
  subs: Subscription[];
  constructor(
	private store: Store<AppState>,
	private route: ActivatedRoute,
	private elastic: ElasticService,
	private router: Router,
	private playService: EpisodePlayerService
  ) {
	this.subs = [];
  }

  ngOnInit() {
	this.subs.push(
	  this.route.queryParams.subscribe((params) => {
		this.searchWord = params['term'];
	  })
	);
  }

  ngOnDestroy() {
	this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngAfterViewInit() {
	console.log(this.basicModal);
	this.basicModal.show();
	this.search();
  }

  search() {
	this.elastic
	  .search('casts', {
		from: 0,
		size: 100,
		query: {
		  multi_match: {
			query: this.searchWord,
			fields: ['title', 'subtitle']
		  }
		}
	  })
	  .then((data) => this.processSearchResult(data));
  }

  getCast(ep: Episode) {
	console.log('cast id', ep);
	const cast = this.store.select(selectors.getCastById(ep.castID));
	console.log(cast);
	return cast;
  }

  getPagedItems(items) {
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
		description: hit._source.hasOwnProperty('subtitle') ? hit._source.subtitle : null
	  };
	  this.episodes.push(ep);
	  if (!this.dicCast.hasOwnProperty(ep.castID)) {
		this.subs.push(this.getCast(ep).subscribe((cast) => (this.dicCast[ep.castID] = cast)));
	  }
	}
  }

  closeModal($event) {
	this.router.navigate([{ outlets: { modal: null } }]);
	this.modalClose.next($event);
  }

  play(ep: Episode) {
	console.log(ep);
	this.playService.setEpisode(ep);
  }
}
