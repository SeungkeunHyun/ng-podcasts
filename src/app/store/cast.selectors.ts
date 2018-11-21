import { AppState } from './app.reducer';
import { createSelector } from '@ngrx/store';

export const selectCasts = (state: AppState) => state.casts.entities;
export const selectCategoryState = (state: AppState) => state.categories;
export const selectCastState = (state: AppState) => state.casts;
export const getCastById = id =>
  createSelector(
    selectCasts,
    allCasts => allCasts[id]
  );

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
