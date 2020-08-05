import { CastState, EpisodeState, CategoryState } from './cast.reducer';
export interface AppState {
  casts: CastState;
  categories: CategoryState;
  episodes: EpisodeState;
}

export function appReducer(state, action) {
  return state;
}
