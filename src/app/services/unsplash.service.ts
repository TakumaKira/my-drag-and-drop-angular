import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';

import { State } from '../store';
import * as BgImgDataActions from '../store/bg-img-data.actions';
import { IStoredBgImgData } from '../types/stored-bg-img-data';
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
  private readonly LOCAL_STORAGE_STORE_KEY = 'bgImg';
  constructor(
    private http: HttpClient,
    private store: Store<State>,
  ) {}
  checkLocalStorage(): IStoredBgImgData | null {
    const bgImgStr = localStorage.getItem(this.LOCAL_STORAGE_STORE_KEY);
    return !!bgImgStr ? JSON.parse(bgImgStr) as IStoredBgImgData : null;
  }
  isStored(result: IStoredBgImgData | null): boolean {
    return result !== null && !this.isExpired(result.timestamp);
  }
  private isExpired(timestamp: number): boolean {
    return new Date().getTime() - timestamp > this.localstorageLifetime;
  }
  get(): Observable<IUnsplashImgData> {
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
    this.store.dispatch(BgImgDataActions.loadBgImgDataFailure({ error }));
    // return error message
    return throwError('Something bad happened; please try again later.');
  }
  setToLocalStorage(data: IStoredBgImgData): void {
    localStorage.setItem(this.LOCAL_STORAGE_STORE_KEY, JSON.stringify(data));
  }
}
