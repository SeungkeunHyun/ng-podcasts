import { CastCommonService } from './../../_services/cast-common.service';
import { Subscription, Observable } from 'rxjs';
import { Category } from './../../_models/category.model';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/_store/app.reducer';
import * as selectors from '../../_store/cast.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { ElasticService } from '../../_services/elastic.service';

@Component({
  selector: 'app-board-graph',
  templateUrl: './board-graph.component.html',
  styleUrls: ['./board-graph.component.css']
})
export class BoardGraphComponent implements OnInit, OnDestroy, AfterViewInit {
  categories: Category[];
  catSubs: Subscription[];
  selectedCategory: string;
  l7dBuckets = [];
  public statDataset: any;
  public statData: Array<any> = [];
	public statLabels: Array<any> = [];
	public chartData: Array<any> = [];
	public chartLabels: Array<any> = [];
	public chartColors: Array<any> = null;
	public chartLoaded = false;
	public chartOptions: any = {
		responsive: true
	};
	constructor(
		private store: Store<AppState>,
		private router: Router,
		private route: ActivatedRoute,
		private castCommon: CastCommonService,
		private elasticService: ElasticService
	) {
		this.catSubs = [];
		this.catSubs.push(
			this.route.queryParams.subscribe(qry => {
				console.log(qry);
				if (qry['category']) {
					this.selectedCategory = qry['category'];
				}
			})
		);
		this.catSubs.push(
			this.route.data.subscribe(dat => {
				this.l7dBuckets = dat.results.aggregations.range.buckets;
				this.l7dBuckets.forEach(itm => {
					this.statData.push(itm['doc_count']);
					this.statLabels.push(itm['key_as_string']);
					this.statDataset = [
						{ data: this.statData, label: '일주일간 Ep. 등록건수' }
					];
				});
			})
		);
	}

	ngOnInit() {
		if (this.castCommon.categories) {
			this.categories = this.castCommon.categories;
			console.log('category data loaded', this.categories);
			this.drawGraph();
		}
		this.catSubs.push(
			this.castCommon.categories$.subscribe(action => {
				this.categories = action.payload;
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
		const seq = 0;
		for (const cat of this.categories) {
			this.chartLabels.push(cat.key);
			this.chartData.push(cat.doc_count);
			chColors.hoverBorderColor.push('rgba(0, 0, 0, 0.1)');
			chColors.backgroundColor.push(cat.color);
		}
		chColors.hoverBackgroundColor = chColors.backgroundColor;
		this.chartColors = [chColors];
		console.log('chart data loaded', this.categories, this.chartColors);
		this.chartLoaded = true;
	}

	public chartClicked(e: any): void {
		const data = this.getDataOfEvent(e);
		this.router.navigate(['dashboard'], {
			queryParams: { category: data.label }
		});
	}

	public barchartClicked(e: any): void {
		const data = this.getDataOfEvent(e);
		let dtstr =
			new Date().getFullYear() +
			'-' +
			data.label.replace(/(\d+)\/(\d+).+/, '$1-$2');
		dtstr = new Date(dtstr)
			.toISOString()
			.substring(0, 10)
			.replace(/-/g, '/');
		const qry = {
			from: 0,
			size: 500,
			query: {
				range: {
					pubDate: {
						gte: dtstr + ' 00:00:00',
						lte: dtstr + ' 23:59:59'
					}
				}
			},
			sort: [{ pubDate: { order: 'desc' } }]
		};
		const results = this.elasticService.search('casts', qry);
		results.then(dat => {
			const episodes = [];
			dat.hits.hits.forEach(itm => {
				const src = itm._source;
				src.castID = src.cast_episode.parent;
				delete src.cast_episode;
				episodes.push(src);
			});
			console.log('daily ep', episodes);
			this.elasticService.episodes.next(episodes);
			this.elasticService.ep_label.next(data.label);
		});
		console.log('barchart clicked', dtstr, qry, results);
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
