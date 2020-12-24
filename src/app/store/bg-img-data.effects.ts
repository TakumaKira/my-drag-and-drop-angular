import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { iif, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { FALLBACK_BG_IMG_DATA } from '../constants/fallback-bg-img';
import { UnsplashService } from '../services/unsplash.service';
import { IStoredBgImgData } from '../types/stored-bg-img-data';
import { IUnsplashImgData } from '../types/unsplash-img-data.model';
import * as BgImgData from './bg-img-data.actions';

@Injectable()
export class BgImgDataEffects {

  checkLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgData.checkLocalStorage),
    map(() => this.unsplash.checkLocalStorage()),
    mergeMap(result => iif(() =>
      this.unsplash.isStored(result),
      of(BgImgData.gotBgImgData(result as IStoredBgImgData)),
      of(BgImgData.loadBgImgData()))
    ),
  ));

  loadBgImgData$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgData.loadBgImgData),
    mergeMap(() => this.unsplash.get().pipe(
      catchError(error => this.unsplash.handleLoadError(error)),
    )),
    map(data => BgImgData.gotBgImgData({ data: data as IUnsplashImgData, timestamp: new Date().getTime() })),
  ));

  loadBgImgDataFailure$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgData.loadBgImgDataFailure),
    map(() => BgImgData.getFallbackBgImgData()),
  ));

  getFallbackBgImgData$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgData.getFallbackBgImgData),
    map(() => BgImgData.gotBgImgData({ data: FALLBACK_BG_IMG_DATA, timestamp: new Date().getTime() })),
  ));

  gotBgImgData$ = createEffect(() => this.actions$.pipe(
    ofType(BgImgData.gotBgImgData),
    tap(({type, ...props}) => this.unsplash.setToLocalStorage(props)),
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
    public unsplash: UnsplashService,
  ) {}
}
