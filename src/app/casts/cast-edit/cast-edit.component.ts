import { CastCommonService } from './../../_services/cast-common.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from './../../_models/category.model';
import { Cast } from './../../_models/cast.model';
import { Store } from '@ngrx/store';
import {
	Component,
	ViewChild,
	OnInit,
	OnDestroy,
	AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../_store/app.reducer';
import * as fromActions from '../../_store/cast.action';
import { FormGroup } from '@angular/forms';
import * as selectors from '../../_store/cast.selectors';

@Component({
	selector: 'app-cast-edit',
	templateUrl: './cast-edit.component.html',
	styleUrls: ['./cast-edit.component.css']
})
export class CastEditComponent implements OnInit, OnDestroy, AfterViewInit {
	id: string;
	cast: Cast;
	categories: Category[];
	subsParam: Subscription;
	subsCast: Subscription;
	@ViewChild('f', { static: true }) castForm: FormGroup;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<AppState>,
		private castCommon: CastCommonService
	) {}

	ngOnInit() {
		this.castCommon.categories$.subscribe(
			action => (this.categories = action.payload)
		);
	}

	initCastEdit() {
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

	ngAfterViewInit() {
		this.initCastEdit();
	}

	ngOnDestroy() {
		this.subsParam.unsubscribe();
		this.subsCast.unsubscribe();
	}

	onSubmit(f) {
		this.store.dispatch(
			new fromActions.CastUpdate({ cast: this.castForm.value })
		);
		return false;
	}
}
