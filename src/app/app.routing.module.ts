import { ModalSearchComponent } from './home/modal-search/modal-search.component';
import { CastReadComponent } from './casts/cast-read/cast-read.component';
import { CastEditComponent } from './casts/cast-edit/cast-edit.component';
import { CastMainComponent } from './casts/cast-main/cast-main.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { CastEpisodesComponent } from './casts/cast-episodes/cast-episodes.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{
		path: 'search',
		component: ModalSearchComponent,
		outlet: 'modal'
	},
	{
		path: 'popup/:id',
		component: CastEpisodesComponent,
		outlet: 'modal'
	},
	{
		path: 'casts',
		component: CastMainComponent,
		children: [
			{ path: ':id', component: CastReadComponent, pathMatch: 'full' },
			{ path: ':id/edit', component: CastEditComponent }
		]
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(appRoutes, { enableTracing: true }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
