import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './_store/app.reducer';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	title = 'ng-podcasts';

	constructor(private store: Store<AppState>) {}

	ngOnInit() {}
}
