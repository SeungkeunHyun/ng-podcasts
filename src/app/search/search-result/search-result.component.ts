import { Component, OnInit } from '@angular/core';
import { CastSearchService } from './../../_services/cast-search.service';
import { AppState } from './../../_store/app.reducer';
import { Observable } from 'rxjs';
import { Category } from './../../_models/category.model';
import * as selectors from '../../_store/cast.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(private searchService: CastSearchService, private store: Store<AppState>) { 
    this.categories$ = this.store.select(selectors.selectCategories);
  }

  ngOnInit() {
  }

  addCast(itm, cat) {
    console.log(itm, cat);
    itm.category = cat;
    const res = this.searchService.register(itm);
    res.subscribe(dat => console.log(dat));
  }
}
