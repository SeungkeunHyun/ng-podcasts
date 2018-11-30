import { ElasticService } from './../services/elastic.service';
import { ActivatedRoute } from '@angular/router';
import { CastRequested, CategoryRequested } from './../store/cast.action';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: [ './nav.component.css' ]
})
export class NavComponent implements OnInit {
	@ViewChild('searchWord') searchWord;
	constructor(private store: Store<AppState>, private route: ActivatedRoute, private elastic: ElasticService) {}

	ngOnInit() {
		this.store.dispatch(new CastRequested());
	}

	searchCast(e) {
		console.log(this.searchWord);
		if (e.key === 'Enter' && this.searchWord.nativeElement.value.trim().length > 1) {
			console.log('start search', this.searchWord.nativeElement.value);
			this.elastic
				.search('casts', {
					from: 0,
					size: 100,
					query: {
						multi_match: {
							query: '다스',
							fields: [ 'title', 'subtitle' ]
						}
					}
				})
				.then((data) => console.log(data.hits.hits));
		}
	}
}
