import { bgImgDataReducer, bgImgDataInitialState } from './bg-img-data.reducer';

describe('BgImgData Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = bgImgDataReducer(bgImgDataInitialState, action);

      expect(result).toBe(bgImgDataInitialState);
    });
  });
});
