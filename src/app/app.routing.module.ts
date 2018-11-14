import { CastReadComponent } from './cast-read/cast-read.component';
import { CastEditComponent } from './cast-edit/cast-edit.component';
import { MainComponent } from './main/main.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const appRoutes: Routes = [
  { path: '', redirectTo: 'casts', pathMatch: 'full' },
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
