import { CastEffect } from './store/cast.effect';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './main/main.component';
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
import { CastDetailComponent } from './cast-detail/cast-detail.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { DataTablesModule } from 'angular-datatables';
import { CastEditComponent } from './cast-edit/cast-edit.component';
import { AppRouterModule } from './app.routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MainComponent,
    CastDetailComponent,
    CastEditComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRouterModule,
    MDBBootstrapModule.forRoot(),
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
