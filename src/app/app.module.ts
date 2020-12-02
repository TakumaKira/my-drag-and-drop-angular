import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import Bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';

import { AppComponent } from './app.component';

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
  ],
  providers: [
    { provide: ErrorHandler, useFactory: errorHandlerFactory },
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
