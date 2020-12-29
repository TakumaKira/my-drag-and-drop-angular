import * as fromOrder from './order.actions';

describe('loadOrders', () => {
  it('should return an action', () => {
    expect(fromOrder.addList({listId: ''}).type).toBe('[Order] Add List');
  });
});
