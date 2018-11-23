import { Cast } from './../../models/cast.model';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as selectors from '../../store/cast.selectors';

@Component({
  selector: 'app-board-thumb',
  templateUrl: './board-thumb.component.html',
  styleUrls: ['./board-thumb.component.css']
})
export class BoardThumbComponent implements OnInit {
  @Input() catId: string;
  castInfo$: Observable<Cast>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.castInfo$ = this.store.select(selectors.getCastById(this.catId));
  }
}
