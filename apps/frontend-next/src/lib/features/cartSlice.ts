// Redux slice for shopping cart management
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number | string; // API returns string from DECIMAL field
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
    return sum + (price * item.quantity);
  }, 0);
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    // Update item quantity
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      
      if (item) {
        if (action.payload.quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(i => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    
    // Initialize cart from localStorage (client-side only)
    initializeCart: (state) => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            state.items = parsedCart.items || [];
            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;
          } catch (error) {
            console.error('Failed to parse cart from localStorage:', error);
            localStorage.removeItem('cart');
          }
        }
      }
    }
  }
});

// Middleware to save cart to localStorage
export const cartMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Save cart to localStorage after any cart action
  if (action.type?.startsWith('cart/') && typeof window !== 'undefined') {
    const state = store.getState();
    localStorage.setItem('cart', JSON.stringify({
      items: state.cart.items
    }));
  }
  
  return result;
};

export const { addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = cartSlice.actions;
export default cartSlice.reducer;

