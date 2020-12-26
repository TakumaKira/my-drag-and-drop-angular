import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Card } from './card.model';

export const loadCards = createAction(
  '[Card/API] Load Cards',
  props<{ cards: Card[] }>()
);

export const addCard = createAction(
  '[Card/API] Add Card',
  props<{ listId: string, cardId: string }>()
);

export const upsertCard = createAction(
  '[Card/API] Upsert Card',
  props<{ card: Card }>()
);

export const addCards = createAction(
  '[Card/API] Add Cards',
  props<{ cards: Card[] }>()
);

export const upsertCards = createAction(
  '[Card/API] Upsert Cards',
  props<{ cards: Card[] }>()
);

export const updateCard = createAction(
  '[Card/API] Update Card',
  props<{ cardId: string, contents: string }>()
);

export const updateCards = createAction(
  '[Card/API] Update Cards',
  props<{ cards: Update<Card>[] }>()
);

export const deleteCard = createAction(
  '[Card/API] Delete Card',
  props<{ listId: string, cardId: string }>()
);

export const deleteCards = createAction(
  '[Card/API] Delete Cards',
  props<{ cardIds: string[] }>()
);

export const clearCards = createAction(
  '[Card/API] Clear Cards'
);
