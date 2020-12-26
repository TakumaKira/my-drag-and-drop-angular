import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Order, orderFeatureKey } from './order.reducer';

export const selectOrderState = createFeatureSelector<Order>(orderFeatureKey);

export const selectOrderLists = createSelector(
  selectOrderState,
  order => order.lists
);
