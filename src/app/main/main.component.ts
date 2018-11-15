import { Router, ActivatedRoute } from '@angular/router';
import { CategoryRequested } from './../store/cast.action';
import { Cast } from './../models/cast.model';
import { Dictionary } from '@ngrx/entity';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  casts$: any;
  dtOptions: DataTables.Settings = {
    ordering: true,
    paging: true,
    responsive: true,
    columns: [
      { data: 'category', title: 'Category' },
      { data: 'name', title: 'Cast' },
      {
        data: 'imageURL',
        title: 'Thumbnail',
        render: (val, type, row, meta) => {
          return `<img src='${val}' width='100px' title='${row.name}'>`;
        }
      }
    ],
    rowCallback: (row: Node, data: Cast, index: number) => {
      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        console.log(data);
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
    this.casts$.subscribe(casts => {
      const tabData: Cast[] = [];
      casts.ids.forEach(id => tabData.push(casts.entities[id]));
      this.dtOptions.data = tabData;
    });
  }
}
