import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { iif, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { FALLBACK_BG_IMG_DATA } from '../constants/fallback-bg-img';
import { UnsplashService } from '../services/unsplash.service';
import { IUnsplashImgData } from '../types/unsplash-img-data.model';
import * as BgImgActions from './bg-img.actions';
import { BgImg } from './bg-img.reducer';

@Injectable()
export class BgImgEffects {

  checkLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgActions.checkLocalStorage),
    mergeMap(() => this.unsplash.getStored()),
    mergeMap(result => iif(() =>
      this.unsplash.storedIsValid(result),
      of(BgImgActions.gotData(result as BgImg)),
      of(BgImgActions.fetch()))
    ),
  ));

  fetch$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgActions.fetch),
    mergeMap(() => this.unsplash.fetch().pipe(
      catchError(error => this.unsplash.handleLoadError(error)),
    )),
    map(data => BgImgActions.gotData({ data: data as IUnsplashImgData, timestamp: new Date().getTime() })),
  ));

  fetchFailure$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgActions.fetchFailure),
    map(() => BgImgActions.getFallback()),
  ));

  getFallback$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgActions.getFallback),
    map(() => BgImgActions.gotData({ data: FALLBACK_BG_IMG_DATA, timestamp: new Date().getTime() })),
  ));

  constructor(
    private actions$: Actions,
    public unsplash: UnsplashService,
  ) {}
}
