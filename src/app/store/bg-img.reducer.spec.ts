import { bgImgReducer, bgImgInitialState } from './bg-img.reducer';

describe('BgImg Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = bgImgReducer(bgImgInitialState, action);

      expect(result).toBe(bgImgInitialState);
    });
  });
});
