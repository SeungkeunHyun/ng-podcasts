import { Router, ActivatedRoute } from '@angular/router';
import { Cast } from './../../models/cast.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  casts$: any;
  dtTrigger = new Subject();
  dtReady = false;
  subscription: Subscription;
  dtOptions: DataTables.Settings = {
    destroy: true,
    ordering: true,
    paging: true,
    responsive: true,
    data: [],
    columns: [
      { data: 'category', title: 'Category' },
      {
        data: 'name',
        title: 'Cast',
        render: (val, type, row, meta) => {
          return `<strong>${val}</strong> <span class='pull-right badge badge-primary'>${
            row.episodeCount
          }</span><br><span class='pull-right'>${
            row.lastPub ? row.lastPub.substring(0, 10) : ''
          }</span>`;
        }
      },
      {
        data: 'imageURL',
        title: 'Thumbnail',
        render: (val, type, row, meta) => {
          return `<img src='${val}' width='100px' title='${row.name}'>`;
        }
      },
      {
        data: 'episodeCount',
        title: 'Episodes'
      },
      {
        data: 'lastPub',
        title: 'Last published',
        visible: false
      }
    ],
    order: [[4, 'desc']],
    rowCallback: (row: Node, data: Cast, index: number) => {
      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        this.router.navigate([data.id, 'edit'], { relativeTo: this.route });
      });
      return row;
    }
  };
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.casts$ = this.store.select('casts');
    this.subscription = this.casts$.subscribe(casts => {
      const tabData: Cast[] = [];
      casts.ids.forEach(id => {
        tabData.push(casts.entities[id]);
      });
      this.dtOptions.data = tabData;
      this.dtReady = true;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
