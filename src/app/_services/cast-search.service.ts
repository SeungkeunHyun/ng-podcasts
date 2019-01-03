import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CastSearchService {
  result$ = null;
	constructor(private http: HttpClient) {}

	search(term: string) {
    console.log('search this word: ' + term);
    this.result$ = this.http.get('http://localhost/python/searchcasts.py?term=' + term);
  }
  
  register(item) {
    console.log('register this cast', item);
    return this.http.put('http://localhost:9200/casts/_doc/' + item.podcastID, item);
  }
}
