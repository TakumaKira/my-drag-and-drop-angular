import * as fromList from './list.actions';

describe('loadLists', () => {
  it('should return an action', () => {
    expect(fromList.loadLists({ lists: [] }).type).toBe('[List/API] Load Lists');
  });
});
