import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CastSearchService {
	result$ = null;
	constructor(private http: HttpClient) {}

	search(term: string): Observable<any> {
		console.log('search this word: ' + term);
		return this.http.get('http://localhost/python/searchcasts.py?term=' + term);
	}

	register(item): Observable<any> {
		console.log('register this cast', item);
		return this.http.put(
			'http://localhost:9200/casts/_doc/' + item.podcastID,
			item
		);
	}
}
