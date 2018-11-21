import { CategoryRequested } from './../store/cast.action';
import { Observable, Subscription } from 'rxjs';
import { Category } from './../models/category.model';
import { Cast } from './../models/cast.model';
import { Store } from '@ngrx/store';
import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../store/app.reducer';
import * as fromActions from '../store/cast.action';
import * as fromCastReducer from '../store/cast.reducer';
import { FormGroup } from '@angular/forms';
import * as selectors from '../store/cast.selectors';

@Component({
  selector: 'app-cast-edit',
  templateUrl: './cast-edit.component.html',
  styleUrls: ['./cast-edit.component.css']
})
export class CastEditComponent implements OnInit, OnDestroy, AfterViewInit {
  id: string;
  cast: Cast;
  categories$: Observable<Category[]>;
  subsParam: Subscription;
  subsCast: Subscription;
  @ViewChild('f')
  castForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new CategoryRequested());
    console.log(this.castForm);
    this.categories$ = this.store.select(selectors.selectCategories);
    this.subsParam = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.subsCast = this.store
        .select(selectors.getCastById(this.id))
        .subscribe(cast => {
          if (!cast) {
            console.log('Category was not fetched yet');
            return this.router.navigate(['casts']);
          }
          this.cast = cast;
          this.castForm.setValue(cast);
        });
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subsParam.unsubscribe();
    this.subsCast.unsubscribe();
  }

  onSubmit(f) {
    console.log(this.castForm.value);
    this.store.dispatch(
      new fromActions.CastUpdate({ cast: this.castForm.value })
    );
    return false;
  }
}