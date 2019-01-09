import { CastResolver } from './_resolvers/cast-resolver';
import { SearchMainComponent } from './search/search-main/search-main.component';
import { ModalSearchComponent } from './home/modal-search/modal-search.component';
import { CastReadComponent } from './casts/cast-read/cast-read.component';
import { CastEditComponent } from './casts/cast-edit/cast-edit.component';
import { CastMainComponent } from './casts/cast-main/cast-main.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { CastEpisodesComponent } from './casts/cast-episodes/cast-episodes.component';
import { SearchResolver } from './_resolvers/search-resolver';
import { StatResolver } from './_resolvers/stat-resolver';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{
		path: 'dashboard',
		component: DashboardComponent,
		resolve: { results: StatResolver },
		pathMatch: 'full'
	},
	{
		path: 'search',
		component: ModalSearchComponent,
		outlet: 'modal',
		resolve: { results: SearchResolver }
	},
	{
		path: 'popup/:id',
		component: CastEpisodesComponent,
		resolve: { results: CastResolver },
		outlet: 'modal'
	},
	{
		path: 'casts',
		component: CastMainComponent,
		children: [
			{ path: ':id', component: CastReadComponent, pathMatch: 'full' },
			{ path: ':id/edit', component: CastEditComponent }
		]
	},
	{
		path: 'searchCast',
		component: SearchMainComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
