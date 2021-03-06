import { createAction, props } from '@ngrx/store';

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

export const updateMovingList = createAction(
  '[Order] Update Moving List',
  props<{ index: number }>()
);

export const moveList = createAction(
  '[Order] Move List',
  props<{ targetIndex: number }>()
);

export const updateMovingCard = createAction(
  '[Order] Update Moving Card',
  props<{ index: [number, number] }>()
);

export const moveCard = createAction(
  '[Order] Move Card',
  props<{ targetIndex: [number, number] }>()
);

export const finishMoving = createAction(
  '[Order] Finish Moving'
);
