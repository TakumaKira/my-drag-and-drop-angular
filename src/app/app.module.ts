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
import { LocalstorageService } from './services/localstorage.service';
import * as fromState from './store';
import { getMetaReducers } from './store';
import { BgImgEffects } from './store/bg-img.effects';
import { CardEffects } from './store/card.effects';
import { ListEffects } from './store/list.effects';

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
    StoreModule.forRoot(fromState.reducers),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([ListEffects, CardEffects, BgImgEffects]),
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
