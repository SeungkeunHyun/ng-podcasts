import { EpisodePlayerService } from './../_services/episode-player.service';
import { Episode } from './../_models/episode.model';
import { ElasticService } from './../_services/elastic.service';
import { AppState } from './app.reducer';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  map,
  switchMap,
  withLatestFrom,
  filter,
  take,
  startWith,
	mergeMap
} from 'rxjs/operators';
import * as fromCastActions from '../_store/cast.action';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as selectors from '../_store/cast.selectors';
@Injectable()
export class CastEffect {
	esURL = 'http://localhost:9200';
	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private elastic: ElasticService,
		private store: Store<AppState>,
		private location: Location,
		private router: Router,
		private playService: EpisodePlayerService
	) {}

	private castQuery = {
		from: 0,
		size: 100,
		query: {
			has_child: {
				type: 'episode',
				query: {
					match_all: {}
				},
				inner_hits: {
					from: 0,
					size: 10,
					sort: [{ pubDate: { order: 'desc' } }]
				}
			}
		}
	};

	private categoryQuery = {
		size: 0,
		aggs: { uniq_provider: { terms: { field: 'category.keyword' } } }
	};

	@Effect()
	castRequested$ = this.actions$
		.ofType<fromCastActions.CastRequested>(
			fromCastActions.CastActionTypes.CAST_REQUESTED
		)
		.pipe(
			withLatestFrom(
				this.store.pipe(select(selectors.selectAllCastsWereLoaded))
			),
			filter(([action, loadedFlag]) => {
				return !loadedFlag;
			}),
			switchMap(action => {
				return this.elastic.search('casts', this.castQuery);
			}),
			map(results => {
				const casts = this.mapCasts(results);
				this.store.dispatch(new fromCastActions.CategoryRequested());
				return {
					type: fromCastActions.CastActionTypes.CAST_LOADED,
					payload: { casts: casts }
				};
			})
		);
	@Effect()
	episodesRequested$ = this.actions$.pipe(
		ofType<fromCastActions.EpisodesRequested>(
			fromCastActions.CastActionTypes.EPISODES_REQUESTED
		),
		switchMap((action: fromCastActions.EpisodesRequested) => {
			return this.http.get(action.payload.feedURL);
		}),
		map(res => {
			return {
				type: fromCastActions.CastActionTypes.EPISODES_LOADED,
				payload: { episodes: res }
			};
		})
	);

	@Effect()
	categoryRequested$ = this.actions$.pipe(
		ofType<fromCastActions.CategoryRequested>(
			fromCastActions.CastActionTypes.CATEGORY_REQUESTED
		),
		withLatestFrom(
			this.store.pipe(select(selectors.selectAllCategoriesWereLoaded))
		),
		filter(([action, flag]) => {
			console.log(flag);
			return !flag;
		}),
		switchMap(action => {
			return this.elastic.search('casts', this.categoryQuery);
		}),
		map((res: any) => res.aggregations.uniq_provider.buckets),
		map(buckets => {
			console.log('buckets', buckets);
			return {
				type: fromCastActions.CastActionTypes.CATEGORY_LOADED,
				payload: buckets
			};
		})
	);

	@Effect()
	castUpdate$ = this.actions$.pipe(
		ofType<fromCastActions.CastUpdate>(
			fromCastActions.CastActionTypes.CAST_UPDATE
		),
		switchMap(action => {
			const doc_id = action.payload.cast.id;
			delete action.payload.cast.id;
			return this.elastic.update('casts', doc_id, action.payload.cast);
		}),
		map(res => {
			this.router.navigateByUrl(this.location.path().replace('/edit', ''));
			this.store.dispatch(new fromCastActions.CategoryRequested());
			return {
				type: fromCastActions.CastActionTypes.CAST_UPDATED
			};
		})
	);

	@Effect()
	castEpisodeRequested$ = this.actions$.pipe(
		ofType<fromCastActions.CastEpisodesRequested>(
			fromCastActions.CastActionTypes.CAST_EPISODES_REQUESTED
		),
		switchMap(action => {
			const doc_id = action.payload;
			return this.elastic.search('casts', {
				from: 0,
				size: 1500,
				query: {
					has_parent: {
						parent_type: 'cast',
						query: {
							term: { _id: doc_id }
						}
					}
				},
				sort: [{ pubDate: { order: 'desc' } }]
			});
		}),
		map((res: any) => {
			const hits = res.hits.hits;
			const episodes = [];
			hits.forEach(itm => {
				const ep = itm._source;
				ep['id'] = itm._id;
				delete ep.cast_episode;
				episodes.push(ep);
			});
			this.playService.fillEpisodes(episodes);
			return {
				type: fromCastActions.CastActionTypes.CAST_EPISODES_LOADED,
				payload: { episodes: episodes }
			};
		})
	);

	/*	 @Effect() episodePlay$ = this.actions$.pipe(
		ofType<fromCastActions.EpisodePlay>(
			fromCastActions.CastActionTypes.EPISODE_PLAY
		),
		switchMap(action => {

		}); */

	mapCasts(results) {
		const casts = [];
		results.hits.hits.map((itm: any) => {
			const src = itm._source;
			if (itm.inner_hits) {
				this.store.dispatch(
					new fromCastActions.EpisodesLoaded({
						episodes: this.mapEpisodes(itm.inner_hits.episode.hits.hits)
					})
				);
			}
			casts.push({
				id: itm._id,
				name: src.name,
				category: src.category,
				provider: src.provider ? src.provider : 'iTunes',
				feedURL: src.feedURL,
				imageURL: (src.imageURL ? src.imageURL : src.image),
				lastPub: itm.inner_hits
					? itm.inner_hits.episode.hits.hits[0]._source.pubDate
					: null,
				episodeCount: itm.inner_hits ? itm.inner_hits.episode.hits.total : null,
				author: src.author ? src.author : null
			});
		});
		return casts;
	}

	mapEpisodes(items): Episode[] {
		const episodes = [];
		for (const item of items) {
			const ep = {
				id: item._id,
				castID: item._source.cast_episode.parent,
				title: item._source.title,
				description: item._source.subtitle,
				duration: item._source.duration,
				mediaURL: item._source.mediaURL,
				pubDate: item._source.pubDate
			};
			episodes.push(ep);
		}
		return episodes;
	}
}
