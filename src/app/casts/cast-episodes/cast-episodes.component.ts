import { EpisodePlayerService } from './../../_services/episode-player.service';
import { Episode } from './../../_models/episode.model';
import { Cast } from './../../_models/cast.model';
import { Observable, Subscription, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  ViewChild,
	AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/_store/app.reducer';
import * as selectors from '../../_store/cast.selectors';
import * as fromActions from '../../_store/cast.action';

@Component({
	selector: 'app-cast-episodes',
	templateUrl: './cast-episodes.component.html',
	styleUrls: ['./cast-episodes.component.css']
})
export class CastEpisodesComponent implements OnInit, OnDestroy, AfterViewInit {
	@Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('basicModal') basicModal;
	dtSubject: Subject<Episode[]>;
	cast$: Observable<Cast>;
	castID: string;
	episodes: Episode[];
	subscriptions: Subscription[] = [];
	dtOptions = {
		destroy: true,
		retrieve: true,
		responsive: true,
		columns: [
			{ data: 'pubDate', title: '등록일' },
			{
				data: 'title',
				title: '제목',
				render: function(val, typ, row, meta) {
					return `<a data-toggle='tooltip' title='${
						row.summary
							? row.summary.replace(/"/g, '&#34;')
							: row.subtitle
							? row.subtitle.replace(/"/g, '&#34;')
							: ''
					}'>${val} <span class='pull-right'>${
						row.duration ? row.duration : ''
					}</span></a>`;
				}
			},
			{
				data: 'mediaURL',
				title: 'Action',
				render: function(val, typ, row, meta) {
					return '<i class="fa fa-download" aria-hidden="true">다운로드</i>';
				}
			}
		],
		data: [],
		order: [[0, 'desc'], [1, 'asc']]
	};
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private playService: EpisodePlayerService
	) {
		this.dtSubject = new Subject();
	}

	ngOnInit() {
		this.subscriptions.push(
			this.route.params.subscribe(params => {
				this.castID = params['id'];
				this.cast$ = this.store.select(selectors.getCastById(params['id']));
				console.log('Test', this.route, this.cast$);
			})
		);
		this.subscriptions.push(
			this.route.data.subscribe(data => {
				console.log('data loaded', data);
				this.episodes = this.mapEpisodes(data.results.hits.hits);
				console.log(this.episodes);
			})
		);
	}

	mapEpisodes(items): Episode[] {
		const episodes = [];
		for (const item of items) {
			const ep = {
				id: item._id,
				castID: item._source.cast_episode.parent,
				title: item._source.title,
				subtitle: item._source.subtitle,
				summary: item._source.summary,
				duration: item._source.duration,
				mediaURL: item._source.mediaURL,
				pubDate: item._source.pubDate
			};
			episodes.push(ep);
		}
		return episodes;
	}

	processEpisodes(res) {
		console.log('result', res);
	}

	ngAfterViewInit() {
		this.dtOptions.data = this.episodes;
		const pservice = this.playService;
		this.basicModal.show();
		const dt = $('#tabEpisodes').DataTable(this.dtOptions);
		$('#tabEpisodes')
			.find('tbody tr td.sorting_2')
			.on('click', function(e) {
				pservice.subject.next(<Episode>dt.row(this.parentElement).data());
			});
		// this.dtSubject.next(this.episodes);
	}

	getAllEpisodes() {
		// this.store.dispatch(new fromActions.CastEpisodesRequested(this.castID));
		this.playService.subAll.subscribe(data => {
			console.log('fetched all episodes', data);
			this.dtOptions.data = data;
			const $dt = $('#tabEpisodes').DataTable(this.dtOptions);
			console.log($dt);
			// this.dtSubject.next(data);
		});
	}

	ngOnDestroy() {
		$('#tabEpisodes')
			.DataTable()
			.destroy();
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	closeModal($event) {
		this.router.navigate([{ outlets: { modal: null } }]);
		this.modalClose.next($event);
	}
}
