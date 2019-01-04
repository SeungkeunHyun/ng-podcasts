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
	subs: Subscription;
	categories$: Observable<Category[]>;

	constructor(
		private searchService: CastSearchService,
		private store: Store<AppState>
	) {
		this.categories$ = this.store.select(selectors.selectCategories);
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
		this.subs = this.searchService.search(srchWord).subscribe(data => {
			this.searchResult = data;
			console.log(data);
			this.providers = Object.keys(data);
		});
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
