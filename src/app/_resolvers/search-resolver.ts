import { Observable } from 'rxjs';
import { ElasticService } from './../_services/elastic.service';
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Episode } from '../_models/episode.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchResolver implements Resolve<any> {
	constructor(private elastic: ElasticService) {}
	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<Episode[]> {
		return this.elastic.search('casts', {
			from: 0,
			size: 100,
			query: {
				multi_match: {
					query: route.queryParams['term'],
					fields: ['title', 'subtitle', 'summary']
				}
			},
			sort: [{ pubDate: { order: 'desc' } }]
		});
	}
}
