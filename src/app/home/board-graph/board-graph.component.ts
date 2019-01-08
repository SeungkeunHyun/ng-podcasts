import { Subscription, Observable } from 'rxjs';
import { Category } from './../../_models/category.model';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/_store/app.reducer';
import * as selectors from '../../_store/cast.selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-board-graph',
	templateUrl: './board-graph.component.html',
	styleUrls: ['./board-graph.component.css']
})
export class BoardGraphComponent implements OnInit, OnDestroy, AfterViewInit {
	categories$: Observable<Category[]>;
	categories: Category[];
	catSubs: Subscription[];
	selectedCategory: string;
	public chartData: Array<any> = [];
	public chartLabels: Array<any> = [];
	public chartColors: Array<any> = null;
	public chartLoaded = false;
	public chartOptions: any = {
		responsive: true
	};
	constructor(private store: Store<AppState>, private route: ActivatedRoute) {
		this.catSubs = [];
	}

	ngOnInit() {
		this.categories$ = this.store.select(selectors.selectCategories);
		this.catSubs.push(
			this.categories$.subscribe(cats => {
				console.log('categories', cats);
				if (!cats || cats.length === 0) {
					return;
				}
				this.categories = cats;
				this.drawGraph();
			})
		);
	}

	ngAfterViewInit() {
		const chart = document.querySelector('#dchart');
		console.log('chart after viewinit', chart);
	}

	drawGraph() {
		const chColors = {
			hoverBorderColor: [],
			hoverBorderWidth: 0,
			backgroundColor: [],
			hoverBackgroundColor: []
		};
		let seq = 0;
		for (const cat of this.categories) {
			this.chartLabels.push(cat.key);
			this.chartData.push(cat.doc_count);
			chColors.hoverBorderColor.push('rgba(0, 0, 0, 0.1)');
			chColors.backgroundColor.push(this.getSeqColor(seq++));
		}
		chColors.hoverBackgroundColor = chColors.backgroundColor;
		this.chartColors = [chColors];
		console.log('chart data loaded', this.categories, this.chartColors);
		this.chartLoaded = true;
	}

	public chartClicked(e: any): void {
		const data = this.getDataOfEvent(e);
		this.selectedCategory = data.label;
		console.log(this.selectedCategory);
	}

	public chartHovered(e: any): void {}

	getDataOfEvent(e: any) {
		if (e.active) {
			const eventData = {
				label: e.active[0]._chart.config.data.labels[e.active[0]._index],
				data:
					e.active[0]._chart.config.data.datasets[0].data[e.active[0]._index]
			};
			return eventData;
		}
		return null;
	}

	getSeqColor(seq) {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor((seq * (i + 2)) % 16)];
		}
		return color;
	}

	getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	ngOnDestroy() {
		this.catSubs.forEach(sub => sub.unsubscribe());
		this.chartLoaded = false;
	}
}
