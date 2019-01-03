import { CastSearchService } from './../../_services/cast-search.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
	constructor(private searchService: CastSearchService) {}

	ngOnInit() {}

	typeIn(e) {
		const srchWord = e.target.value;
		if (e.key === 'Enter') {
			if (srchWord && srchWord.length > 1) {
				this.search(srchWord);
			}
		}
	}

	search(srchWord) {
		this.searchService.search(srchWord);
	}
}
