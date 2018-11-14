import { CategoryState } from './../store/cast.reducer';
import { Observable } from 'rxjs';
import { EntityState } from '@ngrx/entity';
import { Category } from './../models/category.model';
import { Cast } from './../models/cast.model';
import { Store } from '@ngrx/store';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../store/app.reducer';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import * as selectors from '../store/cast.selectors';
import { clearResolutionOfComponentResourcesQueue } from '@angular/core/src/metadata/resource_loading';

@Component({
  selector: 'app-cast-edit',
  templateUrl: './cast-edit.component.html',
  styleUrls: ['./cast-edit.component.css']
})
export class CastEditComponent implements OnInit {
  id: string;
  cast: Cast;
  categories: Observable<CategoryState>;
  @ViewChild('f')
  castForm: FormGroup;
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit() {
    console.log(this.castForm);
    this.categories = this.store.select('categories');
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.store.select(selectors.getCastById(this.id)).subscribe(cast => {
		this.cast = cast;
		this.castForm.setValue(this.cast);  
      });
    });
  }

  onSubmit(f) {
    console.log(this.castForm.value);
  }
}
