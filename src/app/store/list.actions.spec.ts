import * as fromList from './list.actions';

describe('loadLists', () => {
  it('should return an action', () => {
    expect(fromList.addList({ listId: '' }).type).toBe('[List/API] Add List');
  });
});
