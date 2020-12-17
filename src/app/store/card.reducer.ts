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

export const initialState: Cards = adapter.getInitialState({
  // additional entity state properties
});


export const cardsReducer = createReducer(
  initialState,
  on(CardActions.addCard,
    (state, {cardId: id}) => adapter.addOne({id, content: NEW_CARD_CONTENTS}, state)
  ),
  on(CardActions.upsertCard,
    (state, action) => adapter.upsertOne(action.card, state)
  ),
  on(CardActions.addCards,
    (state, action) => adapter.addMany(action.cards, state)
  ),
  on(CardActions.upsertCards,
    (state, action) => adapter.upsertMany(action.cards, state)
  ),
  on(CardActions.updateCard,
    (state, {cardId: id, contents}) => adapter.updateOne({ id, changes: { content: contents } }, state)
  ),
  on(CardActions.updateCards,
    (state, action) => adapter.updateMany(action.cards, state)
  ),
  on(CardActions.deleteCard,
    (state, action) => adapter.removeOne(action.cardId, state)
  ),
  on(CardActions.deleteCards,
    (state, action) => adapter.removeMany(action.cardIds, state)
  ),
  on(CardActions.loadCards,
    (state, action) => adapter.setAll(action.cards, state)
  ),
  on(CardActions.clearCards,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
