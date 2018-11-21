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

export function castReducer(
  state = castAdapter.getInitialState({ loaded: false }),
  action
) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.CAST_REQUESTED:
      return castAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.CAST_LOADED:
      console.log('casts loaded', action.payload);
      return castAdapter.addAll(action.payload.casts, {
        ...state,
        loaded: true
      });
    case fromCastActions.CastActionTypes.CAST_UPDATE:
      console.log('state before update', state);
      return castAdapter.updateOne(
        { id: action.payload.cast.id, changes: action.payload.cast },
        { ...state }
      );
    case fromCastActions.CastActionTypes.CAST_UPDATED:
      console.log('state after update', state);
      return { ...state };
    default:
      return { ...state };
  }
}

export function categoryReducer(
  state = categoryAdapter.getInitialState({ loaded: false }),
  action
) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.CATEGORY_REQUESTED:
      return categoryAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.CATEGORY_LOADED:
      return categoryAdapter.addAll(action.payload, { ...state, loaded: true });
  }
}

export function episodeReducer(
  state = episodeAdapter.getInitialState({ loaded: false }),
  action
) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.EPISODES_REQUESTED:
      return episodeAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.EPISODES_LOADED:
      return episodeAdapter.addMany(action.payload.episodes, { ...state });
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

/* export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = categoryAdapter.getSelectors();
 */
