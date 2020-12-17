import { listsReducer, initialState } from './list.reducer';

describe('List Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = listsReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
