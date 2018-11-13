import { Cast } from './../models/cast.model';
import { Action } from '@ngrx/store';

export enum CastActionTypes {
  CAST_REQUESTED = '[Cast API] CAST REQUESTED',
  CAST_LOADED = '[Cast API] CAST LOADED'
}

export class CastRequested implements Action {
  readonly type = CastActionTypes.CAST_REQUESTED;
}

export class CastLoaded implements Action {
  readonly type = CastActionTypes.CAST_LOADED;
  constructor(public payload: { casts: Cast[] }) {}
}

export type CastActions = CastRequested | CastLoaded;
