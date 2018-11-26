import { Router, ActivatedRoute } from '@angular/router';
import { Cast } from './../../models/cast.model';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import * as selectors from '../../store/cast.selectors';
import { DataTableDirective } from 'angular-datatables';
import * as $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  casts$: any;
  subject = new Subject<Cast[]>();
  dtReady = false;
  subscriptions: Subscription[] = [];
  dtOptions: DataTables.Settings;

  dtOptionTemplate = {
    destroy: true,
    ordering: true,
    paging: true,
    data: [],
    responsive: true,
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
          return `<img src='${val}' width='80px' title='${row.name}'>`;
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
    private route: ActivatedRoute,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.casts$ = this.store.select(selectors.selectAllCasts);
    this.chRef.detectChanges();
    if (sessionStorage.getItem('dtData')) {
      const dtData = JSON.parse(sessionStorage.getItem('dtData'));
      this.dtOptionTemplate.data = dtData;
      console.log(this.dtOptionTemplate);
      $('#dtCasts').DataTable(this.dtOptionTemplate);
      this.dtOptions = this.dtOptionTemplate;
      this.subject.next(dtData);
    }
    this.casts$.subscribe(data => {
      if (this.dtOptionTemplate.data === data) {
        return;
      }
      // this.chRef.detectChanges();
      this.dtOptionTemplate.data = data;
      $('#dtCasts').DataTable(this.dtOptionTemplate);
      sessionStorage.setItem('dtData', JSON.stringify(data));
      this.subject.next(data);
    });
  }

  ngAfterViewInit() {
    console.log(this.subject);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe);
    this.subject.unsubscribe();
  }
}
