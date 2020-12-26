import { createReducer, on } from '@ngrx/store';

import { IUnsplashImgData } from '../types/unsplash-img-data.model';
import * as BgImgActions from './bg-img.actions';

export const bgImgFeatureKey = 'bgImg';

export interface BgImg {
  data: IUnsplashImgData | null;
  timestamp: number | null;
}

export const bgImgInitialState: BgImg = {
  data: null,
  timestamp: null,
};

export const bgImgReducer = createReducer(
  bgImgInitialState,
  on(BgImgActions.gotData,
    (state, {data, timestamp}) => ({ data, timestamp })
  ),
);

