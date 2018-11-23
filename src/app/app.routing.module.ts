import { CastReadComponent } from './casts/cast-read/cast-read.component';
import { CastEditComponent } from './casts/cast-edit/cast-edit.component';
import { MainComponent } from './casts/main/main.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './home/dashboard/dashboard.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'casts',
    component: MainComponent,
    children: [
      { path: ':id', component: CastReadComponent, pathMatch: 'full' },
      { path: ':id/edit', component: CastEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRouterModule {}
