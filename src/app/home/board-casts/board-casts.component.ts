import { CastCommonService } from './../../_services/cast-common.service';
import { Category } from 'src/app/_models/category.model';
import { Router } from '@angular/router';
import { Cast } from './../../_models/cast.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/_store/app.reducer';
import * as selectors from '../../_store/cast.selectors';

@Component({
	selector: 'app-board-casts',
	templateUrl: './board-casts.component.html',
	styleUrls: ['./board-casts.component.css']
})
export class BoardCastsComponent implements OnInit, OnDestroy {
	public _category: string;
	public categories: Category[];
	subs: Subscription[] = [];
	@Input('category')
	set category(value: string) {
		if (!value || value.length === 0) {
			return;
		}
		this._category = value;
		this.fetchCastsOfCategory();
	}
	subject: Subject<string> = new Subject<string>();
	castsOfCategory$: Observable<Cast[]>;
	constructor(
		private store: Store<AppState>,
		private router: Router,
		private castCommon: CastCommonService
	) {}

	ngOnInit() {
		if (this.castCommon.categories) {
			this.categories = this.castCommon.categories;
			return;
		}
		this.subs.push(
			this.castCommon.categories$.subscribe(action => {
				this.categories = action.payload;
			})
		);
	}

	selectCategory(e) {
		this.router.navigate(['dashboard'], {
			queryParams: { category: e.target.value }
		});
	}

	fetchCastsOfCategory() {
		this.castsOfCategory$ = this.store.select(
			selectors.getCastsByCategory(this._category)
		);
	}

	showCast(castId) {
		console.log('cast id ' + castId);
		this.router.navigate([{ outlets: { modal: 'popup/' + castId } }]);
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}
}
