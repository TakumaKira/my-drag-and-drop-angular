import { cardsReducer, initialState } from './card.reducer';

describe('Card Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = cardsReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
