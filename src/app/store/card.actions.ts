import { createAction, props } from '@ngrx/store';

export const addCard = createAction(
  '[Card/API] Add Card',
  props<{ listId: string, cardId: string }>()
);

export const updateCard = createAction(
  '[Card/API] Update Card',
  props<{ cardId: string, contents: string }>()
);

export const deleteCard = createAction(
  '[Card/API] Delete Card',
  props<{ listId: string, cardId: string }>()
);

export const deleteCards = createAction(
  '[Card/API] Delete Cards',
  props<{ cardIds: string[] }>()
);
