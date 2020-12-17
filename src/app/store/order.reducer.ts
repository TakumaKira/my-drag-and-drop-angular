import { createReducer, on } from '@ngrx/store';
import copy from 'fast-copy';

import * as OrderActions from './order.actions';

export const orderFeatureKey = 'order';

export interface Order {
  lists: OrderList[];
}
export interface OrderList {
  listId: string;
  cardIds: string[];
}

export const initialState: Order = {
  lists: [],
};


export const orderReducer = createReducer(
  initialState,
  on(OrderActions.addList,
    (state, {listId}) => {
      state = copy(state);
      state.lists.push({listId, cardIds: []});
      return state;
    }
  ),
  on(OrderActions.addCard,
    (state, action) => {
      const listIndex = state.lists.findIndex(list => list.listId === action.listId);
      state = copy(state);
      state.lists[listIndex].cardIds.push(action.cardId);
      return state;
    }
  ),
  on(OrderActions.deleteList,
    (state, {listId}) => {
      const listIndex = state.lists.findIndex(list => list.listId === listId);
      state = copy(state);
      state.lists.splice(listIndex, 1);
      return state;
    }
  ),
  on(OrderActions.deleteCard,
    (state, action) => {
      const listIndex = state.lists.findIndex(list => list.listId === action.listId);
      const cardIndex = state.lists[listIndex].cardIds.findIndex(cardId => cardId === action.cardId);
      state = copy(state);
      state.lists[listIndex].cardIds.splice(cardIndex, 1);
      return state;
    }
  ),
  on(OrderActions.moveList,
    (state, action) => {
      state = copy(state);
      const moved = state.lists.splice(action.from, 1)[0];
      state.lists.splice(action.to, 0, moved);
      return state;
    }
  ),
  on(OrderActions.moveCard,
    (state, action) => {
      state = copy(state);
      const moved = state.lists[action.from[0]].cardIds.splice(action.from[1], 1)[0];
      state.lists[action.to[0]].cardIds.splice(action.to[1], 0, moved);
      return state;
    }
  ),
);

