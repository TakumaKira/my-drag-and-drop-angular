import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Lists, listsFeatureKey } from './list.reducer';

export const selectListsState = createFeatureSelector<Lists>(listsFeatureKey);

export const selectListEntity = (id: string) => createSelector(
  selectListsState,
  lists => lists.entities[id]
);
