import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { State } from '../store';
import * as BgImgActions from '../store/bg-img.actions';
import { BgImg } from '../store/bg-img.reducer';
import { selectBgImgState } from '../store/bg-img.selectors';
import { IUnsplashImgData } from '../types/unsplash-img-data.model';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private readonly myAppName = 'my_drag_and_drop';
  readonly unsplashUrl = 'https://unsplash.com/';
  readonly query = `?utm_source=${this.myAppName}&utm_medium=referral`;
  private readonly unsplashApiUrl = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
  private readonly localstorageLifetime = 72000; // allow 50 times in an hour => 60 * 60 * 1000 / 50
  constructor(
    private http: HttpClient,
    private store: Store<State>,
  ) {}
  getStored(): Observable<BgImg> {
    return this.store.pipe(
      first(),
      select(selectBgImgState),
    );
  }
  storedIsValid(result: BgImg): boolean {
    return result?.data !== null && !this.storedIsExpired(result?.timestamp as number);
  }
  private storedIsExpired(timestamp: number): boolean {
    return new Date().getTime() - timestamp > this.localstorageLifetime;
  }
  fetch(): Observable<IUnsplashImgData> {
    return this.http.get(this.unsplashApiUrl) as Observable<IUnsplashImgData>;
  }
  handleLoadError(error: HttpErrorResponse): any {
    // client error or network error
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    // server error
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`);
    }
    // dispatch load failure action
    this.store.dispatch(BgImgActions.fetchFailure({ error }));
    // return error message
    return throwError('Something bad happened; please try again later.');
  }
}
