import { Episode } from './../../models/episode.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/store/app.reducer';
import * as selectors from '../../store/cast.selectors';

@Component({
  selector: 'app-board-latest',
  templateUrl: './board-latest.component.html',
  styleUrls: ['./board-latest.component.css']
})
export class BoardLatestComponent implements OnInit, OnDestroy {
  latestEpisodes: Observable<Episode[]>;
  subs: Subscription[] = [];
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const sub = this.store.select('casts').subscribe(casts => {
      this.latestEpisodes = this.store.select(selectors.selectLatestEpisodes);
    });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
}
