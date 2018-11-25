import { Cast } from './../../models/cast.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/store/app.reducer';
import * as selectors from '../../store/cast.selectors';

@Component({
  selector: 'app-cast-episodes',
  templateUrl: './cast-episodes.component.html',
  styleUrls: ['./cast-episodes.component.css']
})
export class CastEpisodesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('basicModal') basicModal;
  cast$: Observable<Cast>;
  subscription: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    console.log(this.route);
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      if (!params['id']) {
        return;
      }
      console.log(params);
      this.cast$ = this.store.select(selectors.getCastById(params['id']));
    });
  }

  ngAfterViewInit() {
    this.basicModal.show();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeModal($event) {
    this.router.navigate([{ outlets: { modal: null } }]);
    this.modalClose.next($event);
  }
}
