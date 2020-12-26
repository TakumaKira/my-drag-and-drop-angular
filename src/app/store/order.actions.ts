import { createAction, props } from '@ngrx/store';

export const loadOrders = createAction(
  '[Order] Load Orders'
);

export const addList = createAction(
  '[Order] Add List',
  props<{ listId: string }>()
);

export const addCard = createAction(
  '[Order] Add Card',
  props<{ listId: string, cardId: string }>()
);

export const deleteList = createAction(
  '[Order] Delete List',
  props<{ listId: string }>()
);

export const deleteCard = createAction(
  '[Order] Delete Card',
  props<{ listId: string, cardId: string }>()
);

export const moveList = createAction(
  '[Order] Move List',
  props<{ from: number, to: number }>()
);

export const moveCard = createAction(
  '[Order] Move Card',
  props<{ from: [number, number], to: [number, number] }>()
);
