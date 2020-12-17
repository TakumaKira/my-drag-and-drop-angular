import { createAction, props } from '@ngrx/store';

export const loadBgImgDatas = createAction(
  '[BgImgData] Load BgImgDatas'
);

export const loadBgImgDatasSuccess = createAction(
  '[BgImgData] Load BgImgDatas Success',
  props<{ data: any }>()
);

export const loadBgImgDatasFailure = createAction(
  '[BgImgData] Load BgImgDatas Failure',
  props<{ error: any }>()
);
