import { ElasticService } from './../../services/elastic.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Episode } from 'src/app/models/episode.model';

@Component({
	selector: 'app-modal-search',
	templateUrl: './modal-search.component.html',
	styleUrls: [ './modal-search.component.css' ]
})
export class ModalSearchComponent implements OnInit {
	searchWord: string;
	episodes: Episode[] = [];
	constructor(private route: ActivatedRoute, private elastic: ElasticService) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.searchWord = params['term'];
			this.search();
		});
	}

	search() {
		this.elastic
			.search('casts', {
				from: 0,
				size: 100,
				query: {
					multi_match: {
						query: this.searchWord,
						fields: [ 'title', 'subtitle' ]
					}
				}
			})
			.then((data) => this.processSearchResult(data));
	}

	processSearchResult(data) {
		console.log(data);
		const hits = data.hits.hits;
		for (const hit of hits) {
			this.episodes.push({
				id: hit._id,
				castID: hit._source.cast_episode.parent,
				duration: hit._source.duration,
				mediaURL: hit._source.mediaURL,
				pubDate: hit._source.pubDate,
				title: hit._source.title
			});
		}
	}
}
