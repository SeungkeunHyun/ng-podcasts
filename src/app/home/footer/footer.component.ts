import { Observable } from 'rxjs';
import { AppState } from './../../store/app.reducer';
import { Store } from '@ngrx/store';
import { EpisodePlayerService } from './../../services/episode-player.service';
import { Episode } from './../../models/episode.model';
import { Component, OnInit } from '@angular/core';
import * as selectors from '../../store/cast.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  cast$: Observable<Cast>;
  episode: Episode;
  loaded = false;
  constructor(
    private store: Store<AppState>,
    private playService: EpisodePlayerService
  ) {}

  ngOnInit() {
    this.playService.subject.subscribe(ep => {
      this.episode = ep;
      this.cast$ = this.store.select(
        selectors.getCastById(this.episode.castID)
      );
      this.loaded = true;
      console.log(this.episode);
    });
  }
}
