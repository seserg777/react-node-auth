// Cart slice tests
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  initializeCart,
} from '../cartSlice';

describe('cartSlice', () => {
  const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 50.0,
    image: 'https://example.com/image.jpg',
  };

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addToCart', () => {
    it('should add a new product to the cart', () => {
      const state = cartReducer(initialState, addToCart(mockProduct));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...mockProduct, quantity: 1 });
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(50.0);
    });

    it('should increment quantity if product already exists', () => {
      const stateWithProduct = {
        items: [{ ...mockProduct, quantity: 1 }],
        totalItems: 1,
        totalPrice: 50.0,
      };

      const state = cartReducer(stateWithProduct, addToCart(mockProduct));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBe(100.0);
    });

    it('should handle multiple different products', () => {
      const product2 = { id: 2, name: 'Product 2', price: 30.0 };
      
      let state = cartReducer(initialState, addToCart(mockProduct));
      state = cartReducer(state, addToCart(product2));

      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBe(80.0);
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from the cart', () => {
      const stateWithProduct = {
        items: [{ ...mockProduct, quantity: 1 }],
        totalItems: 1,
        totalPrice: 50.0,
      };

      const state = cartReducer(stateWithProduct, removeFromCart(1));

      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should not affect other products', () => {
      const product2 = { id: 2, name: 'Product 2', price: 30.0, quantity: 1 };
      const stateWithProducts = {
        items: [{ ...mockProduct, quantity: 1 }, product2],
        totalItems: 2,
        totalPrice: 80.0,
      };

      const state = cartReducer(stateWithProducts, removeFromCart(1));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(30.0);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const stateWithProduct = {
        items: [{ ...mockProduct, quantity: 1 }],
        totalItems: 1,
        totalPrice: 50.0,
      };

      const state = cartReducer(
        stateWithProduct,
        updateQuantity({ id: 1, quantity: 3 })
      );

      expect(state.items[0].quantity).toBe(3);
      expect(state.totalItems).toBe(3);
      expect(state.totalPrice).toBe(150.0);
    });

    it('should remove product if quantity is 0 or less', () => {
      const stateWithProduct = {
        items: [{ ...mockProduct, quantity: 1 }],
        totalItems: 1,
        totalPrice: 50.0,
      };

      const state = cartReducer(
        stateWithProduct,
        updateQuantity({ id: 1, quantity: 0 })
      );

      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', () => {
      const stateWithProducts = {
        items: [
          { ...mockProduct, quantity: 2 },
          { id: 2, name: 'Product 2', price: 30.0, quantity: 1 },
        ],
        totalItems: 3,
        totalPrice: 130.0,
      };

      const state = cartReducer(stateWithProducts, clearCart());

      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('initializeCart', () => {
    it('should initialize cart from empty state', () => {
      const state = cartReducer(initialState, initializeCart());
      
      // Should remain empty if no localStorage data
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('total calculations', () => {
    it('should correctly calculate totals with multiple products and quantities', () => {
      let state = initialState;
      
      // Add first product (50 x 2 = 100)
      state = cartReducer(state, addToCart({ id: 1, name: 'Product 1', price: 50 }));
      state = cartReducer(state, addToCart({ id: 1, name: 'Product 1', price: 50 }));
      
      // Add second product (30 x 3 = 90)
      state = cartReducer(state, addToCart({ id: 2, name: 'Product 2', price: 30 }));
      state = cartReducer(state, addToCart({ id: 2, name: 'Product 2', price: 30 }));
      state = cartReducer(state, addToCart({ id: 2, name: 'Product 2', price: 30 }));

      expect(state.totalItems).toBe(5);
      expect(state.totalPrice).toBe(190);
    });
  });
});

