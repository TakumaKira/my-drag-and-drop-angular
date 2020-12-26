import { orderReducer, orderInitialState } from './order.reducer';

describe('Order Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = orderReducer(orderInitialState, action);

      expect(result).toBe(orderInitialState);
    });
  });
});
