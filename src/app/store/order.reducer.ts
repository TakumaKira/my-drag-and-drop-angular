import { createReducer, on } from '@ngrx/store';
import copy from 'fast-copy';

import * as OrderActions from './order.actions';

export const orderFeatureKey = 'order';

export interface Order {
  lists: OrderList[];
  draggingList: number | null;
  draggingCard: [number, number] | null;
}
export interface OrderList {
  listId: string;
  cardIds: string[];
}

export const orderInitialState: Order = {
  lists: [],
  draggingList: null,
  draggingCard: null,
};


export const orderReducer = createReducer(
  orderInitialState,
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
  on(OrderActions.updateMovingList,
    (state, {index}) => {
      state = copy(state);
      state.draggingList = index;
      return state;
    }
  ),
  on(OrderActions.moveList,
    (state, {index}) => {
      state = copy(state);
      const draggingList = state.draggingList as number;
      const moved = state.lists.splice(draggingList, 1)[0];
      state.lists.splice(index, 0, moved);
      return state;
    }
  ),
  on(OrderActions.updateMovingCard,
    (state, {index}) => {
      state = copy(state);
      state.draggingCard = index;
      return state;
    }
  ),
  on(OrderActions.moveCard,
    (state, {index}) => {
      state = copy(state);
      const draggingCard = state.draggingCard as [number, number];
      const moved = state.lists[draggingCard[0]].cardIds.splice(draggingCard[1], 1)[0];
      state.lists[index[0]].cardIds.splice(index[1], 0, moved);
      return state;
    }
  ),
  on(OrderActions.finishMoving,
    (state, action) => {
      state = copy(state);
      state.draggingList = null;
      state.draggingCard = null;
      return state;
    }
  ),
);

