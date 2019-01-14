import { Category } from './../_models/category.model';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import * as fromCastActions from '../_store/cast.action';
import * as selectors from '../_store/cast.selectors';
import { Subscription } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Effect, ofType } from '@ngrx/effects';
import { AppState } from '../_store/app.reducer';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CastCommonService {
	subs: Subscription[] = [];
	categories: Category[];

	constructor(private store: Store<AppState>, private actions: Actions) {}

	@Effect()
	categories$ = this.actions
		.ofType<fromCastActions.CategoryLoaded>(
			fromCastActions.CastActionTypes.CATEGORY_LOADED
		)
		.pipe(
			map(action => {
				console.log('listen to the action', action);
				this.categories = action.payload;
				console.log('categorys loaded', this.categories);
				return { type: 'disposingAction', payload: this.categories };
			})
		);
}
