import { CastCommonService } from './../../_services/cast-common.service';
import { Category } from 'src/app/_models/category.model';
import { CastSearchService } from './../../_services/cast-search.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AppState } from 'src/app/_store/app.reducer';
import { Store } from '@ngrx/store';
import * as selectors from '../../_store/cast.selectors';
@Component({
	selector: 'app-search-main',
	templateUrl: './search-main.component.html',
	styleUrls: ['./search-main.component.css']
})
export class SearchMainComponent implements OnInit, OnDestroy {
	providers: string[];
	searchResult: {};
	subs: Subscription[] = [];
	categories: Category[];

	constructor(
		private searchService: CastSearchService,
		private store: Store<AppState>,
		private castCommon: CastCommonService
	) {
		if (this.castCommon.categories) {
			this.categories = this.castCommon.categories;
			console.log('category data loaded', this.categories);
			return;
		}
		this.subs.push(
			this.castCommon.categories$.subscribe(action => {
				this.categories = action.payload;
				console.log('category data loaded', this.categories);
			})
		);
	}

	ngOnInit() {}

	typeIn(e) {
		const srchWord = e.target.value;
		if (e.key === 'Enter') {
			if (srchWord && srchWord.length > 1) {
				this.search(srchWord);
			}
		}
	}

	addCast(itm, cat, e) {
		console.log(itm, cat, e);
		const pdiv = e.target.parentElement;
		itm.category = cat;
		const res = this.searchService.register(itm);
		res.subscribe(dat => {
			console.log(dat);
			pdiv.hidden = true;
		});
	}

	search(srchWord) {
		this.subs.push(
			this.searchService.search(srchWord).subscribe(data => {
				this.searchResult = data;
				console.log(data);
				this.providers = Object.keys(data);
			})
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}
}
