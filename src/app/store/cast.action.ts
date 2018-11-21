import { Cast } from './../models/cast.model';
import { Action } from '@ngrx/store';
import { Episode } from '../models/episode.model';

export enum CastActionTypes {
  CAST_REQUESTED = '[Cast API] CAST REQUESTED',
  CAST_LOADED = '[Cast API] CAST LOADED',
  CAST_UPDATE = '[Cast API] CAST UPDATE',
  CAST_UPDATED = '[Cast API] CAST UPDATED',
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

export class CastUpdate implements Action {
  readonly type = CastActionTypes.CAST_UPDATE;
  constructor(public payload: { cast: Cast }) {}
}

export class CastUpdated implements Action {
  readonly type = CastActionTypes.CAST_UPDATED;
  constructor(public payload: { cast: Cast }) {}
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
  constructor(public payload: { episodes: Episode[] }) {}
}

export class EpisodesLoadError implements Action {
  readonly type = CastActionTypes.EPISODES_LOADED;
  constructor(public payload: any) {}
}

export type CastActions =
  | CastRequested
  | CastLoaded
  | CastUpdate
  | CastUpdated
  | EpisodesRequested
  | EpisodesLoaded
  | CategoryRequested
  | CategoryLoaded;
