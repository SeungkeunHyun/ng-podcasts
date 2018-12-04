import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducers from '../../_store/cast.reducer';
import { Cast } from './../../_models/cast.model';
import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../../_store/app.reducer';

@Component({
	selector: 'app-cast-detail',
	templateUrl: './cast-detail.component.html',
	styleUrls: [ './cast-detail.component.css' ]
})
export class CastDetailComponent implements OnInit {
	@Input() cast: Cast;
	episodes$: Observable<fromReducers.EpisodeState>;
	constructor(private store: Store<AppState>, private http: HttpClient) {}

	ngOnInit() {
		/* $.ajax({ url: this.cast.feedURL })
      .then(dat => {
        console.log(dat);
      })
      .catch(err => {
        console.error(err);
      }); */
		/* const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    this.http.get(this.cast.feedURL, { headers: headers }).subscribe(res => {
      console.log(res);
    }); */
	}
}
