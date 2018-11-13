import { Cast } from './../models/cast.model';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as fromCastActions from './cast.action';
export interface CastState extends EntityState<Cast> {
  loaded: boolean;
}

export const castAdapter = createEntityAdapter<Cast>({
  selectId: cast => cast.id
});

const initialState: CastState = castAdapter.getInitialState({
  loaded: false
});

export function castReducer(state = initialState, action) {
  switch (action.type) {
    case fromCastActions.CastActionTypes.CAST_REQUESTED:
      return castAdapter.removeAll(state);
    case fromCastActions.CastActionTypes.CAST_LOADED:
      return castAdapter.addAll(action.payload.casts, state);
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
