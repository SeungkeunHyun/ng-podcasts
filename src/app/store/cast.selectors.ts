import { Episode } from './../models/episode.model';
import { AppState } from './app.reducer';
import { createSelector } from '@ngrx/store';

export const selectCasts = (state: AppState) => state.casts.entities;
export const selectCategoryState = (state: AppState) => state.categories;
export const selectCastState = (state: AppState) => state.casts;
export const getCastById = id =>
  createSelector(
    selectCasts,
    allCasts => {
      console.log(id, allCasts);
      return allCasts[id];
    }
  );

export const selectEpisodes = (state: AppState) => state.episodes;

export const selectCategories = createSelector(
  selectCategoryState,
  catState => {
    if (!catState) {
      return [];
    }
    const cats = [];
    for (const id of catState.ids) {
      cats.push(catState.entities[id]);
    }
    return cats;
  }
);

export const selectAllCastsWereLoaded = createSelector(
  selectCastState,
  castState => castState.loaded
);

export const selectAllCategoriesWereLoaded = createSelector(
  selectCategoryState,
  catState => {
    if (catState && catState.ids) {
      return catState.loaded;
    }
    return false;
  }
);

export const selectLatestEpisodes = createSelector(
  selectEpisodes,
  allEpisodes => {
    const episodes = [];
    for (const id of allEpisodes.ids) {
      episodes.push(allEpisodes.entities[id]);
    }
    episodes.sort((e1: Episode, e2: Episode) => {
      if (!e1.pubDate) {
        return -1;
      }
      if (!e2.pubDate) {
        return 1;
      }
      // console.log(e1, e2);
      return new Date(e2.pubDate).getTime() - new Date(e1.pubDate).getTime();
    });
    return episodes.slice(0, 10);
  }
);
