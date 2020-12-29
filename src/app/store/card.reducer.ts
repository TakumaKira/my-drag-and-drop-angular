import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { NEW_CARD_CONTENTS } from '../constants/constants';
import * as CardActions from './card.actions';
import { Card } from './card.model';

export const cardsFeatureKey = 'cards';

export interface Cards extends EntityState<Card> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Card> = createEntityAdapter<Card>();

export const cardsInitialState: Cards = adapter.getInitialState({
  // additional entity state properties
});


export const cardsReducer = createReducer(
  cardsInitialState,
  on(CardActions.addCard,
    (state, {cardId: id}) => adapter.addOne({id, content: NEW_CARD_CONTENTS}, state)
  ),
  on(CardActions.updateCard,
    (state, {cardId: id, contents}) => adapter.updateOne({ id, changes: { content: contents } }, state)
  ),
  on(CardActions.deleteCard,
    (state, {cardId}) => adapter.removeOne(cardId, state)
  ),
  on(CardActions.deleteCards,
    (state, {cardIds}) => adapter.removeMany(cardIds, state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
