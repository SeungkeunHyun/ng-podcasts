import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paging } from 'src/app/_models/paging.model';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-paging',
	templateUrl: './paging.component.html',
	styleUrls: [ './paging.component.css' ]
})
export class PagingComponent implements OnInit {
	@Input() items;
	paging: Paging;
	@Output() pagedItems: EventEmitter<any[]> = new EventEmitter();
	constructor() {}

	ngOnInit() {
		this.paging = new Paging(this.items);
		console.log(this.paging);
		this.pagedItems.emit(this.getPagedItems());
	}

	gotoPage(pg: number) {
		if (pg === this.paging.pageNumber) {
			return;
		}
		this.paging.pageNumber = pg;
		this.pagedItems.emit(this.getPagedItems());
	}

	getPagedItems() {
		return this.items.slice(
			(this.paging.pageNumber - 1) * this.paging.pageSize,
			this.paging.pageNumber * this.paging.pageSize
		);
	}
}
