import { Cast } from './../models/cast.model';
import { Action } from '@ngrx/store';

export enum CastActionTypes {
  CAST_REQUESTED = '[Cast API] CAST REQUESTED',
  CAST_LOADED = '[Cast API] CAST LOADED',
  CATEGORY_REQUESTED = '[Cast API] CATEGORY REQUESTED',
  CATEGORY_LOADED = '[Cast API] CATEGORY LOADED',
  EPISODES_REQUESTED = '[Cast API] EPISODES REQUESTED',
  EPISODES_LOADED = '[Cast API] EPISODES LOADED',
  EPISODES_LOAD_ERROR = '[Cast API] EPISODES LOAD ERROR'
}

export class CastRequested implements Action {
  readonly type = CastActionTypes.CAST_REQUESTED;
}

export class CastLoaded implements Action {
  readonly type = CastActionTypes.CAST_LOADED;
  constructor(public payload: { casts: Cast[] }) {}
}

export class CategoryRequested implements Action {
  readonly type = CastActionTypes.CATEGORY_REQUESTED;
}
export class CategoryLoaded implements Action {
  readonly type = CastActionTypes.CATEGORY_LOADED;
}

export class EpisodesRequested implements Action {
  readonly type = CastActionTypes.EPISODES_REQUESTED;
  constructor(public payload: Cast) {}
}

export class EpisodesLoaded implements Action {
  readonly type = CastActionTypes.EPISODES_LOADED;
  constructor(public payload: { episodes: string }) {}
}

export class EpisodesLoadError implements Action {
  readonly type = CastActionTypes.EPISODES_LOADED;
  constructor(public payload: any) {}
}

export type CastActions =
  | CastRequested
  | CastLoaded
  | EpisodesRequested
  | EpisodesLoaded
  | CategoryRequested
  | CategoryLoaded;
