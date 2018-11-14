import { AppState } from './app.reducer';
import { createSelector } from '@ngrx/store';

export const selectCasts = (state: AppState) => state.casts.entities;
export const getCastById = id =>
  createSelector(
    selectCasts,
    allCasts => allCasts[id]
  );
