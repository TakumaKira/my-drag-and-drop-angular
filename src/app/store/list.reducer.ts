import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { NEW_LIST_TITLE } from '../constants/constants';
import * as ListActions from './list.actions';
import { List } from './list.model';

export const listsFeatureKey = 'lists';

export interface Lists extends EntityState<List> {
  // additional entities state properties
}

export const adapter: EntityAdapter<List> = createEntityAdapter<List>();

export const listsInitialState: Lists = adapter.getInitialState({
  // additional entity state properties
});


export const listsReducer = createReducer(
  listsInitialState,
  on(ListActions.addList,
    (state, {listId: id}) => adapter.addOne({id, title: NEW_LIST_TITLE}, state)
  ),
  on(ListActions.updateListTitle,
    (state, {listId: id, title}) => adapter.updateOne({id, changes: { title }}, state)
  ),
  on(ListActions.deleteList,
    (state, {listId}) => adapter.removeOne(listId, state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
