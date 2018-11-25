import { Cast } from './../../models/cast.model';
import { Subscription, Observable } from 'rxjs';
import { Category } from './../../models/category.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as selectors from '../../store/cast.selectors';

@Component({
  selector: 'app-board-graph',
  templateUrl: './board-graph.component.html',
  styleUrls: ['./board-graph.component.css']
})
export class BoardGraphComponent implements OnInit, OnDestroy {
  categories: Category[];
  catSubs: Subscription;
  selectedCategory: string;
  public chartData: Array<any> = [];
  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = null;
  public chartLoaded = false;
  public chartOptions: any = {
    responsive: true
  };
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.catSubs = this.store
      .select(selectors.selectCategories)
      .subscribe(cats => {
        this.categories = cats;
        this.drawGraph();
        this.chartLoaded = true;
      });
  }

  drawGraph() {
    const chColors = {
      hoverBorderColor: [],
      hoverBorderWidth: 0,
      backgroundColor: [],
      hoverBackgroundColor: []
    };
    for (const cat of this.categories) {
      this.chartLabels.push(cat.key);
      this.chartData.push(cat.doc_count);
      chColors.hoverBorderColor.push('rgba(0, 0, 0, 0.1)');
      chColors.backgroundColor.push(this.getRandomColor());
    }
    chColors.hoverBackgroundColor = chColors.backgroundColor;
    this.chartColors = [chColors];
    console.log('chart data loaded', this.chartColors);
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

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnDestroy() {
    this.catSubs.unsubscribe();
  }
}
