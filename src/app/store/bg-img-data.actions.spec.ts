import * as fromBgImgData from './bg-img-data.actions';

describe('loadBgImgDatas', () => {
  it('should return an action', () => {
    expect(fromBgImgData.loadBgImgData().type).toBe('[BgImgData] Load BgImgDatas');
  });
});
