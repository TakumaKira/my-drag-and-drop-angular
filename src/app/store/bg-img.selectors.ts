import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BgImg, bgImgFeatureKey } from './bg-img.reducer';

export const selectBgImgState = createFeatureSelector<BgImg>(bgImgFeatureKey);

export const selectBgImgData = createSelector(
  selectBgImgState,
  bgImg => bgImg.data
);
