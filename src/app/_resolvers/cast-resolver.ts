import { Observable } from 'rxjs';
import { ElasticService } from '../_services/elastic.service';
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Episode } from '../_models/episode.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CastResolver implements Resolve<any> {
	constructor(private elastic: ElasticService) {}
	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> {
		return this.elastic.search('casts', {
			from: 0,
			size: 2000,
			query: {
				has_parent: {
					parent_type: 'cast',
					query: {
						term: { podcastID: route.params.id }
					}
				}
			},
			sort: [{ pubDate: { order: 'desc' } }]
		});
	}
}
