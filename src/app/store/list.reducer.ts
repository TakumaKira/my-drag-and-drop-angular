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

const initialState: Lists = adapter.getInitialState({
  // additional entity state properties
});


export const listsReducer = createReducer(
  initialState,
  on(ListActions.addList,
    (state, {listId: id}) => adapter.addOne({id, title: NEW_LIST_TITLE}, state)
  ),
  on(ListActions.upsertList,
    (state, action) => adapter.upsertOne(action.list, state)
  ),
  on(ListActions.addLists,
    (state, action) => adapter.addMany(action.lists, state)
  ),
  on(ListActions.upsertLists,
    (state, action) => adapter.upsertMany(action.lists, state)
  ),
  on(ListActions.updateListTitle,
    (state, {listId: id, title}) => adapter.updateOne({id, changes: { title }}, state)
  ),
  on(ListActions.updateLists,
    (state, action) => adapter.updateMany(action.lists, state)
  ),
  on(ListActions.deleteList,
    (state, {listId}) => adapter.removeOne(listId, state)
  ),
  on(ListActions.deleteLists,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ListActions.loadLists,
    (state, action) => adapter.setAll(action.lists, state)
  ),
  on(ListActions.clearLists,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
