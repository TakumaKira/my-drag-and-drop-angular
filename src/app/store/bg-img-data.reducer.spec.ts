import { bgImgDataReducer, initialState } from './bg-img-data.reducer';

describe('BgImgData Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = bgImgDataReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
