import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import * as fromState from './store';
import { CardEffects } from './store/card.effects';
import { ListEffects } from './store/list.effects';
import { BgImgDataEffects } from './store/bg-img-data.effects';
import { getMetaReducers } from './store';
import { LocalstorageService } from './services/localstorage.service';

// configure Bugsnag asap
Bugsnag.start({ apiKey: process.env.BUGSNAG_API_KEY as string });
// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory(): BugsnagErrorHandler {
  return new BugsnagErrorHandler();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreModule.forRoot(fromState.reducers),
    EffectsModule.forRoot([ListEffects, CardEffects, BgImgDataEffects]),
  ],
  providers: [
    { provide: ErrorHandler, useFactory: errorHandlerFactory },
    {
      provide: USER_PROVIDED_META_REDUCERS,
      deps: [LocalstorageService],
      useFactory: getMetaReducers,
    },
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
