import { ActivatedRoute } from '@angular/router';
import { CastRequested, CategoryRequested } from './../store/cast.action';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.dispatch(new CastRequested());
  }
}
