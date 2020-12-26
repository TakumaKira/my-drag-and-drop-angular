import { listsReducer, listsInitialState } from './list.reducer';

describe('List Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = listsReducer(listsInitialState, action);

      expect(result).toBe(listsInitialState);
    });
  });
});
