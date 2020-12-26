import { createAction, props } from '@ngrx/store';

import { BgImg } from './bg-img.reducer';

export const checkLocalStorage = createAction(
  '[BgImg] Check Local Storage',
);

export const fetch = createAction(
  '[BgImg] Fetch',
);

export const fetchFailure = createAction(
  '[BgImg] Fetch Failure',
  props<{ error: any }>()
);

export const getFallback = createAction(
  '[BgImg] Get Fallback',
);

export const gotData = createAction(
  '[BgImg] Got Data',
  props<BgImg>()
);
