import { createAction, props } from '@ngrx/store';

export const addList = createAction(
  '[List/API] Add List',
  props<{ listId: string }>()
);

export const updateListTitle = createAction(
  '[List/API] Update List Title',
  props<{ listId: string, title: string }>()
);

export const deleteList = createAction(
  '[List/API] Delete List',
  props<{ listId: string }>()
);
