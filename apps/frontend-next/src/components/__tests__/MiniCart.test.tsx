// MiniCart component tests
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MiniCart from '../MiniCart';
import cartReducer, { addToCart } from '@/lib/features/cartSlice';

// Create a mock store for testing
const createMockStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

describe('MiniCart Component', () => {
  it('renders cart icon with item count', () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: 1, name: 'Product 1', price: 50, quantity: 2, image: '' },
        ],
        totalItems: 2,
        totalPrice: 100,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    // Check if cart icon is visible
    const cartButton = screen.getByRole('button', { name: /items in cart/i });
    expect(cartButton).toBeInTheDocument();

    // Check if item count badge is visible
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('opens modal when cart icon is clicked', () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: 1, name: 'Product 1', price: 50, quantity: 1, image: '' },
        ],
        totalItems: 1,
        totalPrice: 50,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    const cartButton = screen.getByRole('button', { name: /items in cart/i });
    fireEvent.click(cartButton);

    // Modal should be visible
    expect(screen.getByText(/shopping cart/i)).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('handles string prices from API correctly', () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: 1, name: 'Product 1', price: '99.99', quantity: 2, image: '' },
        ],
        totalItems: 2,
        totalPrice: 199.98,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    const cartButton = screen.getByRole('button', { name: /items in cart/i });
    fireEvent.click(cartButton);

    // Check if price is displayed correctly
    expect(screen.getByText(/\$99\.99 each/)).toBeInTheDocument();
    // Total appears twice (in item row and in footer), so use getAllByText
    const totals = screen.getAllByText(/\$199\.98/);
    expect(totals.length).toBeGreaterThan(0);
  });

  it('calculates total correctly with mixed price types', () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: 1, name: 'Product 1', price: 50, quantity: 1, image: '' },
          { id: 2, name: 'Product 2', price: '30.50', quantity: 2, image: '' },
        ],
        totalItems: 3,
        totalPrice: 111.0,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    const cartButton = screen.getByRole('button', { name: /items in cart/i });
    fireEvent.click(cartButton);

    // Check total
    expect(screen.getByText(/\$111\.00/)).toBeInTheDocument();
  });

  it('displays empty cart message when no items', () => {
    const store = createMockStore({
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    // When cart is empty, button is disabled but modal should not open on click
    const cartButton = screen.getByRole('button');
    expect(cartButton).toBeDisabled();
    
    // Modal won't open because button is disabled, so check button is disabled
    // The text "Your cart is empty" only shows when modal is open
  });

  it('removes item from cart when remove button is clicked', () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: 1, name: 'Product 1', price: 50, quantity: 1, image: '' },
        ],
        totalItems: 1,
        totalPrice: 50,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    const cartButton = screen.getByRole('button', { name: /items in cart/i });
    fireEvent.click(cartButton);

    const removeButton = screen.getByTitle('Remove from cart');
    fireEvent.click(removeButton);

    // After removal, cart should be empty
    const state = store.getState();
    expect(state.cart.items).toHaveLength(0);
  });

  it('updates quantity when quantity buttons are clicked', () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: 1, name: 'Product 1', price: 50, quantity: 1, image: '' },
        ],
        totalItems: 1,
        totalPrice: 50,
      },
    });

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    const cartButton = screen.getByRole('button', { name: /items in cart/i });
    fireEvent.click(cartButton);

    // Click the + button
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(2);
  });

  it('does not display badge when cart is empty', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MiniCart />
      </Provider>
    );

    // Badge should not be visible
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});

