import * as fromBgImg from './bg-img.actions';

describe('fetch', () => {
  it('should return an action', () => {
    expect(fromBgImg.fetch().type).toBe('[BgImg] Fetch');
  });
});
