import { Episode } from './../_models/episode.model';
import { AppState } from './app.reducer';
import { createSelector, State } from '@ngrx/store';
import { Cast } from '../_models/cast.model';

export const selectCasts = (state: AppState) => state.casts;
export const selectCategoryState = (state: AppState) => state.categories;
export const selectCastState = (state: AppState) => state.casts;
export const getCastById = id =>
	createSelector(
		selectCasts,
		allCasts => {
			return allCasts.entities[id];
		}
	);

export const getCastsByCategory = cat =>
	createSelector(
		selectCasts,
		allCasts => {
			const casts = [];
			for (const id of allCasts.ids) {
				if (allCasts.entities[id].category === cat) {
					casts.push(allCasts.entities[id]);
				}
			}
			casts.sort((c1: Cast, c2: Cast) => {
				if (c1.lastPub === c2.lastPub) {
					return 0;
				}
				return c1.lastPub > c2.lastPub ? -1 : 1;
			});
			return casts;
		}
	);

export const selectAllCasts = createSelector(
	selectCasts,
	castDic => {
		if (!castDic.loaded) {
			return null;
		}
		const allCasts = [];
		for (const id of castDic.ids) {
			allCasts.push(castDic.entities[id]);
		}
		return allCasts;
	}
);

export const selectEpisodes = (state: AppState) => state.episodes;

export const selectCategories = createSelector(
	selectCategoryState,
	catState => {
		if (!catState) {
			console.log('category state is null', catState);
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

export const getCastEpisodes = castID =>
	createSelector(
		selectEpisodes,
		allEpisodes => {
			const episodes = [];
			for (const id of allEpisodes.ids) {
				if (castID === allEpisodes.entities[id]['castID']) {
					episodes.push(allEpisodes.entities[id]);
				}
			}
			return episodes;
		}
	);

export const selectLatestEpisodes = createSelector(
	selectEpisodes,
	allEpisodes => {
		const episodes = [];
		for (const id of allEpisodes.ids) {
			episodes.push(allEpisodes.entities[id]);
		}
		episodes.sort((e1: Episode, e2: Episode) => {
			if (!e1.pubDate) {
				return -1;
			}
			if (!e2.pubDate) {
				return 1;
			}
			// console.log(e1, e2);
			return new Date(e2.pubDate).getTime() - new Date(e1.pubDate).getTime();
		});
		return episodes.slice(0, 10);
	}
);
