// ProductCard component tests
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../ProductCard';
import cartReducer from '@/lib/features/cartSlice';
import type { Product } from '@/types/product';

// Create a mock store for testing
const createMockStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  category: 'Test Category',
  inStock: true,
  image: 'https://example.com/image.jpg',
};

describe('ProductCard Component', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  it('renders product information correctly', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays "Add to Cart" button when product is in stock', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });

  it('displays "Out of Stock" button when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    
    render(
      <Provider store={store}>
        <ProductCard product={outOfStockProduct} />
      </Provider>
    );

    const outOfStockButton = screen.getByRole('button', { name: /out of stock/i });
    expect(outOfStockButton).toBeInTheDocument();
    expect(outOfStockButton).toBeDisabled();
  });

  it('calls onViewDetails when View Details button is clicked', () => {
    const mockOnViewDetails = jest.fn();
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
      </Provider>
    );

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(1);
  });

  it('adds product to cart when Add to Cart button is clicked', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].id).toBe(1);
    expect(state.cart.items[0].name).toBe('Test Product');
    expect(state.cart.totalQuantity).toBe(1);
  });

  it('renders product image with correct src', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('does not render View Details button if onViewDetails is not provided', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const viewDetailsButton = screen.queryByRole('button', { name: /view details/i });
    expect(viewDetailsButton).not.toBeInTheDocument();
  });
});

