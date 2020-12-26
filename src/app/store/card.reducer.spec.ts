import { cardsReducer, cardsInitialState } from './card.reducer';

describe('Card Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = cardsReducer(cardsInitialState, action);

      expect(result).toBe(cardsInitialState);
    });
  });
});
