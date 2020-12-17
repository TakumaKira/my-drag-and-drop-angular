import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { List } from './list.model';

export const loadLists = createAction(
  '[List/API] Load Lists',
  props<{ lists: List[] }>()
);

export const addList = createAction(
  '[List/API] Add List',
  props<{ listId: string }>()
);

export const upsertList = createAction(
  '[List/API] Upsert List',
  props<{ list: List }>()
);

export const addLists = createAction(
  '[List/API] Add Lists',
  props<{ lists: List[] }>()
);

export const upsertLists = createAction(
  '[List/API] Upsert Lists',
  props<{ lists: List[] }>()
);

export const updateListTitle = createAction(
  '[List/API] Update List Title',
  props<{ listId: string, title: string }>()
);

export const updateLists = createAction(
  '[List/API] Update Lists',
  props<{ lists: Update<List>[] }>()
);

export const deleteList = createAction(
  '[List/API] Delete List',
  props<{ listId: string }>()
);

export const deleteLists = createAction(
  '[List/API] Delete Lists',
  props<{ ids: string[] }>()
);

export const clearLists = createAction(
  '[List/API] Clear Lists'
);
