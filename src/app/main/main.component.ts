import { Cast } from './../models/cast.model';
import { EntityState } from '@ngrx/entity';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  casts$: Observable<Cast[]>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.casts$ = this.store.pipe(select('casts'));
  }
}
