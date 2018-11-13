import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import * as fromCastActions from '../store/cast.action';

@Injectable()
export class CastEffect {
  esURL = 'http://localhost:9200';
  constructor(private actions$: Actions, private http: HttpClient) {}

  @Effect() castRequested$ = this.actions$
    .ofType<fromCastActions.CastRequested>(
      fromCastActions.CastActionTypes.CAST_REQUESTED
    )
    .pipe(
      switchMap(action => {
        return from(this.http.get(this.esURL + '/podcasts/_search'));
      }),
      map(res => {
        const hits = res['hits']['hits'];
        console.log('hits', hits);
        const casts = [];
        hits.map(itm => {
          const src = itm._source;
          casts.push({
            id: itm._id,
            name: src.name,
            category: src.category,
            feedURL: src.url,
            imageURL: src.image
          });
        });
        return {
          type: fromCastActions.CastActionTypes.CAST_LOADED,
          payload: { casts: casts }
        };
      })
    );
}
