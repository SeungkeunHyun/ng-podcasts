import { Observable } from 'rxjs';
import { ElasticService } from '../_services/elastic.service';
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StatResolver implements Resolve<any> {
	constructor(private elastic: ElasticService) {}
	qry = {
		query: {
			range: {
				pubDate: {
					gte: 'now-7d/d',
					lte: 'now/d'
				}
			}
		},
		aggs: {
			range: {
				date_histogram: {
					field: 'pubDate',
					format: 'yyyy-MM-dd',
					interval: 'day'
				}
			}
		}
	};

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> {
		return this.elastic.search('casts', this.qry);
	}
}
