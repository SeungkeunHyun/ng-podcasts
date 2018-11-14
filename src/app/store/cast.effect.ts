import { ElasticService } from './../services/elastic.service';
import { CastActionTypes } from './cast.action';
import { AppState } from './app.reducer';
import { Store } from '@ngrx/store';
import { Cast } from './../models/cast.model';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as fromCastActions from '../store/cast.action';
import { Client } from 'elasticsearch-browser';
@Injectable()
export class CastEffect {
  esURL = 'http://localhost:9200';
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private elastic: ElasticService,
    private store: Store<AppState>
  ) {}

  @Effect() castRequested$ = this.actions$
    .ofType<fromCastActions.CastRequested>(
      fromCastActions.CastActionTypes.CAST_REQUESTED
    )
    .pipe(
      switchMap(action => {
        return this.http.get(this.esURL + '/podcasts/_search?from=0&size=100');
      }),
      , map((res: {}) => res.hits.hits)  
      , map(hits => {
        console.log('hits', hits);
        const casts = [];
        hits.map(itm => {
          const src = itm._source;
          casts.push({
            id: itm._id,
            name: src.name,
			category: src.category,
			provider: src.provider,
            feedURL: src.url,
			imageURL: src.image,
			lastPub: src.lastPub,
			episodeCount: src.episodeCount,
			author: src.author
          });
        });
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
    ofType<fromCastActions.CategoryRequested>(fromCastActions.CastActionTypes.CATEGORY_REQUESTED)
    , switchMap((action) => {
      const reqBody = JSON.parse(`{ "size": 0, "aggs": { "uniq_provider": { "terms": { "field": "category.keyword" } } } }`);
      console.log(reqBody, this.elastic);
      return this.elastic.search('podcasts', reqBody);
    })
    , map((res: any) => res.aggregations.uniq_provider.buckets)
    , map(buckets => {
      console.log("buckets", buckets);
      return {
        type: fromCastActions.CastActionTypes.CATEGORY_LOADED,
        payload: buckets
      }
    })


  )
}
