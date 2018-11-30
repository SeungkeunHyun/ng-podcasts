import { ElasticService } from './../../services/elastic.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-modal-search',
	templateUrl: './modal-search.component.html',
	styleUrls: [ './modal-search.component.css' ]
})
export class ModalSearchComponent implements OnInit {
	constructor(private route: ActivatedRoute, private elastic: ElasticService) {}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			console.log(params);
		});
	}

	search(word: string) {
		this.elastic
			.search('casts', {
				from: 0,
				size: 100,
				query: {
					multi_match: {
						query: word,
						fields: [ 'title', 'subtitle' ]
					}
				}
			})
			.then((data) => console.log(data.hits.hits));
	}
}
