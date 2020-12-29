import * as fromCard from './card.actions';

describe('loadCards', () => {
  it('should return an action', () => {
    expect(fromCard.addCard({listId: '', cardId: ''}).type).toBe('[Card/API] Add Card');
  });
});
