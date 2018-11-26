import { EpisodePlayerService } from './../../services/episode-player.service';
import { Episode } from './../../models/episode.model';
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
  episodes$: Observable<Episode[]>;
  subscriptions: Subscription[] = [];
  dtOptions = {
    destroy: true,
    responsive: true,
    columns: [
      { data: 'pubDate', title: '등록일' },
      {
        data: 'title',
        title: '제목',
        render: function(val, typ, row, meta) {
          return `${val} <span class='pull-right'>${row.duration}</span>`;
        }
      },
      {
        data: 'mediaURL',
        title: 'Action',
        render: function(val, typ, row, meta) {
          return '<i class="fa fa-download" aria-hidden="true">다운로드</i>';
        }
      }
    ],
    data: [],
    order: [[0, 'desc'], [1, 'asc']]
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private playService: EpisodePlayerService
  ) {
    console.log(this.route);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        if (!params['id']) {
          return;
        }
        console.log(params);
        this.cast$ = this.store.select(selectors.getCastById(params['id']));
        this.episodes$ = this.store.select(
          selectors.getCastEpisodes(params['id'])
        );
      })
    );
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.episodes$.subscribe(ep => {
        this.dtOptions.data = ep;
        const pservice = this.playService;
        const dt = $('#tabEpisodes').DataTable(this.dtOptions);
        $('#tabEpisodes')
          .find('tbody tr td.sorting_2')
          .on('click', function(e) {
            pservice.subject.next(dt.row(this.parentElement).data());
          });
        console.log(dt);
      })
    );
    this.basicModal.show();
  }

  getAllEpisodes() {}

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeModal($event) {
    this.router.navigate([{ outlets: { modal: null } }]);
    this.modalClose.next($event);
  }
}
