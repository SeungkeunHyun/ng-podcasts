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
	constructor(private store: Store<AppState>, private actions: Actions) {}
	palette = [
		'#001f3f',
		'#0074D9',
		'#7FDBFF',
		'#39CCCC',
		'#3D9970',
		'#2ECC40',
		'#01FF70',
		'#FFDC00',
		'#FF851B',
		'#FF4136',
		'#85144b',
		'#F012BE',
		'#B10DC9',
		'#111111',
		'#AAAAAA',
		'#DDDDDD'
	];
	subs: Subscription[] = [];
	categories: Category[];

	@Effect()
	categories$ = this.actions
		.ofType<fromCastActions.CategoryLoaded>(
			fromCastActions.CastActionTypes.CATEGORY_LOADED
		)
		.pipe(
			map(action => {
				const cats = <Category[]>action.payload;
				const palette = this.palette.slice(0);
				cats.forEach(cat => (cat['color'] = palette.shift()));
				console.log('listen to the action', action);
				this.categories = cats;
				console.log('categories loaded', this, this.categories);
				return { type: 'disposingAction', payload: this.categories };
			})
		);
}
