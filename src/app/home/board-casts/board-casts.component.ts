import { Router } from '@angular/router';
import { Cast } from './../../_models/cast.model';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/_store/app.reducer';
import * as selectors from '../../_store/cast.selectors';

@Component({
	selector: 'app-board-casts',
	templateUrl: './board-casts.component.html',
	styleUrls: [ './board-casts.component.css' ]
})
export class BoardCastsComponent implements OnInit {
	private _category: string;
	@Input()
	set category(value: string) {
		this._category = value;
		this.fetchCastsOfCategory();
	}
	subject: Subject<string> = new Subject<string>();
	castsOfCategory$: Observable<Cast[]>;
	constructor(private store: Store<AppState>, private router: Router) {}

	ngOnInit() {}

	fetchCastsOfCategory() {
		this.castsOfCategory$ = this.store.select(selectors.getCastsByCategory(this._category));
	}

	showCast(castId) {
		console.log('cast id ' + castId);
		this.router.navigate([
			{ outlets: { modal: 'popup/' + castId } } // cast/' + castId + '/episodes' } }
		]);
	}
}
