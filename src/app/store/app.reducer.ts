import { CastState, EpisodeState, CategoryState } from './cast.reducer';
export interface AppState {
  casts: CastState;
  episodes: EpisodeState;
  categories: CategoryState;
}

export function appReducer(state, action) {
  return state;
}
