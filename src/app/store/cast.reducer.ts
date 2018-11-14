import { Category } from './../models/category.model';
import { Episode } from './../models/episode.model';
import { Cast } from './../models/cast.model';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as fromCastActions from './cast.action';
export interface CastState extends EntityState<Cast> {
  loaded: boolean;
}

export interface EpisodeState extends EntityState<string> {
  loaded: boolean;
}

export interface CategoryState extends EntityState<Category> {
  loaded: boolean;
}

export const categoryAdapter = createEntityAdapter<Category>({
  selectId: category => category.key
});

export const castAdapter = createEntityAdapter<Cast>({
  selectId: cast => cast.id
});

export const episodeAdapter = createEntityAdapter<string>({});

const initialCastState: CastState = castAdapter.getInitialState({
  loaded: false
});

const initialEPState: EpisodeState = episodeAdapter.getInitialState({
  loaded: false
});

export function castReducer(state = initialCastState, action) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.CAST_REQUESTED:
      return castAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.CAST_LOADED:
      return castAdapter.addAll(action.payload.casts, state);
    case fromCastActions.CastActionTypes.CAST_UPDATE:
      return castAdapter.updateOne(
        { id: action.payload.cast.id, changes: action.payload.cast },
        state
      );
    case fromCastActions.CastActionTypes.CAST_UPDATED:
      return state;
    default:
      return state;
  }
}

export function categoryReducer(
  state = categoryAdapter.getInitialState(),
  action
) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.CATEGORY_REQUESTED:
      return categoryAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.CATEGORY_LOADED:
      console.log(action);
      return categoryAdapter.addAll(action.payload, state);
  }
}

export function episodeReducer(state = initialEPState, action) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.EPISODES_REQUESTED:
      return episodeAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.EPISODES_LOADED:
      return episodeAdapter.addAll(action.payload.episodes, state);
    case fromCastActions.CastActionTypes.EPISODES_LOAD_ERROR:
      console.error(action.payload);
      return state;
    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = castAdapter.getSelectors();
