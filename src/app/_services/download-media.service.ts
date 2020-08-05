import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../_store/app.reducer';
import * as selectors from '../_store/cast.selectors';
import { Episode } from '../_models/episode.model';
import { Subscription } from 'rxjs';

// TODO: Add Angular decorator.
@Injectable({
	providedIn: 'root'
})
export class DownloadMediaService implements OnDestroy {
	subs: Subscription[] = [];
	constructor(private store: Store<AppState>) {}

	downloadMedia(ep: Episode) {
		this.subs.push(
			this.store.select(selectors.getCastById(ep.castID)).subscribe(cast => {
				console.log(cast, ep);
				const frm = document.querySelector('#dnframe').querySelector('form');
				if (cast.author) {
					frm.elements['artist'].value = cast.author;
				} else {
					frm.elements['artist'].value = cast.name;
				}
				frm.elements['ttl'].value = cast.name;
				frm.elements['img'].value = cast.imageURL;
				frm.elements['lnk'].value = ep.mediaURL;
				frm.elements['title'].value = ep.title;
				frm.elements['summary'].value = ep.summary;
				frm.submit();
			})
		);
	}

	ngOnDestroy(): void {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subs.forEach(sub => sub.unsubscribe());
	}
}
