import { ElasticService } from './../services/elastic.service';
import { ActivatedRoute, Router } from '@angular/router';
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
	constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {}

	ngOnInit() {
		this.store.dispatch(new CastRequested());
	}

	searchCast(e) {
		if (e.key === 'Enter' && this.searchWord.nativeElement.value.trim().length > 1) {
			console.log('start search', this.searchWord.nativeElement.value);
			this.router.navigate([ 'search' ], {
				queryParams: { term: this.searchWord.nativeElement.value.trim() }
			});
		}
	}
}
