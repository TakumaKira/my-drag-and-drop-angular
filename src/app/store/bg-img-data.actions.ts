import { createAction, props } from '@ngrx/store';
import { IStoredBgImgData } from '../types/stored-bg-img-data';

export const checkLocalStorage = createAction(
  '[BgImgData] Check Local Storage',
);

export const loadBgImgData = createAction(
  '[BgImgData] Load BgImgData',
);

export const loadBgImgDataFailure = createAction(
  '[BgImgData] Load BgImgData Failure',
  props<{ error: any }>()
);

export const getFallbackBgImgData = createAction(
  '[BgImgData] Get Fallback BgImgData',
);

export const gotBgImgData = createAction(
  '[BgImgData] Got BgImgData',
  props<IStoredBgImgData>()
);
