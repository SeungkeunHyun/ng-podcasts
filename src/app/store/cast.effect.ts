import { Episode } from './../models/episode.model';
import { ElasticService } from './../services/elastic.service';
import { CastActionTypes } from './cast.action';
import { AppState } from './app.reducer';
import { Store, select } from '@ngrx/store';
import { Cast } from './../models/cast.model';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  map,
  switchMap,
  catchError,
  mergeMap,
  withLatestFrom,
  filter
} from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as fromCastActions from '../store/cast.action';
import { Client } from 'elasticsearch-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as selectors from '../store/cast.selectors';
@Injectable()
export class CastEffect {
  esURL = 'http://localhost:9200';
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private elastic: ElasticService,
    private store: Store<AppState>,
    private location: Location,
    private router: Router
  ) {}

  mapEpisodes(items: {}[]): Episode[] {
    let episodes = [];
    for(let item of items) {
      const ep = {
        id: item._id,
        castID: item._source.join_field.parent,
        title: item._source.title,
        description: item._source.subtitle,
        duration: item._source.duration,
        mediaURL: item._source.mediaURL,
        pubDate: item._source.pubDate;
      }
      episodes.push(ep);
    }
    return episodes;
  }

  @Effect() castRequested$ = this.actions$
    .ofType<fromCastActions.CastRequested>(
      fromCastActions.CastActionTypes.CAST_REQUESTED
    )
    .pipe(
      withLatestFrom(
        this.store.pipe(select(selectors.selectAllCastsWereLoaded))
      ),
      filter(([action, loadedFlag]) => !loadedFlag),
      switchMap(action => {
        const reqBody = {
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
        console.log(reqBody);
        return this.elastic.search('casts', reqBody);
      }),
      map((res: any) => res.hits.hits),
      map(hits => {
        console.log(
          'hits',
          hits,
          'episodes',
          hits[0].inner_hits.episode.hits.hits
        );
        const casts = [];
        hits.map(itm => {
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
            feedURL: src.url,
            imageURL: src.image,
            lastPub: itm.inner_hits
              ? itm.inner_hits.episode.hits.hits[0]._source.pubDate
              : null,
            episodeCount: itm.inner_hits
              ? itm.inner_hits.episode.hits.total
              : null,
            author: src.author ? src.author : null
          });
        });
        console.log(casts);
        return {
          type: fromCastActions.CastActionTypes.CAST_LOADED,
          payload: { casts: casts }
        };
      })
    );
  @Effect() episodesRequested$ = this.actions$.pipe(
    ofType<fromCastActions.EpisodesRequested>(
      fromCastActions.CastActionTypes.EPISODES_REQUESTED
    ),
    switchMap((action: fromCastActions.EpisodesRequested) => {
      console.log(action);
      return this.http.get(action.payload.feedURL);
    }),
    map(res => {
      return {
        type: fromCastActions.CastActionTypes.EPISODES_LOADED,
        payload: { episodes: res }
      };
    })
  );

  @Effect() categoryRequested$ = this.actions$.pipe(
    ofType<fromCastActions.CategoryRequested>(
      fromCastActions.CastActionTypes.CATEGORY_REQUESTED
    ),
    withLatestFrom(
      this.store.pipe(select(selectors.selectAllCategoriesWereLoaded))
    ),
    filter(([action, flag]) => {
      console.log('category filter', action, flag);
      return !flag;
    }),
    switchMap(action => {
      const reqBody = JSON.parse(
        `{ "size": 0, "aggs": { "uniq_provider": { "terms": { "field": "category.keyword" } } } }`
      );
      console.log(reqBody, this.elastic);
      return this.elastic.search('casts', reqBody);
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

  @Effect() castUpdate$ = this.actions$.pipe(
    ofType<fromCastActions.CastUpdate>(
      fromCastActions.CastActionTypes.CAST_UPDATE
    ),
    switchMap(action => {
      const doc_id = action.payload.cast.id;
      delete action.payload.cast.id;
      console.log(action.payload.cast);
      return this.elastic.update('casts', doc_id, action.payload.cast);
    }),
    map(res => {
      this.router.navigateByUrl(this.location.path().replace('/edit', ''));
      return {
        type: fromCastActions.CastActionTypes.CAST_UPDATED
      };
    })
  );
}
