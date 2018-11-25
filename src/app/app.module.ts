import { CastMainComponent } from './casts/cast-main/cast-main.component';
import { CastEffect } from './store/cast.effect';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './casts/main/main.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { StoreModule } from '@ngrx/store';
import {
  castReducer,
  episodeReducer,
  categoryReducer
} from './store/cast.reducer';
import { appReducer } from './store/app.reducer';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { CastDetailComponent } from './casts/cast-detail/cast-detail.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { DataTablesModule } from 'angular-datatables';
import { CastEditComponent } from './casts/cast-edit/cast-edit.component';
import { AppRouterModule } from './app.routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CastReadComponent } from './casts/cast-read/cast-read.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
// For MDB Angular Free
import { ChartsModule } from 'angular-bootstrap-md';
import { BoardGraphComponent } from './home/board-graph/board-graph.component';
import { BoardLatestComponent } from './home/board-latest/board-latest.component';
import { BoardThumbComponent } from './home/board-thumb/board-thumb.component';
import { BoardCastsComponent } from './home/board-casts/board-casts.component';
import { CastEpisodesComponent } from './casts/cast-episodes/cast-episodes.component';
import { ModalComponent } from './home/modal/modal.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MainComponent,
    CastMainComponent,
    CastDetailComponent,
    CastEditComponent,
    CastReadComponent,
    DashboardComponent,
    BoardGraphComponent,
    BoardLatestComponent,
    BoardThumbComponent,
    BoardCastsComponent,
    CastEpisodesComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRouterModule,
    MDBBootstrapModule.forRoot(),
    ChartsModule,
    StoreModule.forRoot({
      app: appReducer,
      casts: castReducer,
      categories: categoryReducer,
      episodes: episodeReducer
    }),
    EffectsModule.forRoot([CastEffect]),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
