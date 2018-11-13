import { CastEffect } from './store/cast.effect';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './main/main.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { StoreModule } from '@ngrx/store';
import { castReducer } from './store/cast.reducer';
import { appReducer } from './store/app.reducer';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent, NavComponent, MainComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    StoreModule.forRoot({ app: appReducer, casts: castReducer }),
    EffectsModule.forRoot([CastEffect])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
