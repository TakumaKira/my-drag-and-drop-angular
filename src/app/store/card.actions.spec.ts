import * as fromCard from './card.actions';

describe('loadCards', () => {
  it('should return an action', () => {
    expect(fromCard.loadCards({ cards: [] }).type).toBe('[Card/API] Load Cards');
  });
});
