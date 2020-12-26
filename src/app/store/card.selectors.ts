import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Cards, cardsFeatureKey } from './card.reducer';

export const selectCardsState = createFeatureSelector<Cards>(cardsFeatureKey);

export const selectCardEntity = (id: string) => createSelector(
  selectCardsState,
  cards => cards.entities[id]
);
