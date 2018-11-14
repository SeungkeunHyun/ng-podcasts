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
  dtOptions: DataTables.Settings = {};
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.casts$ = this.store.select('casts');
    this.store.dispatch(new CategoryRequested());
  }
}
