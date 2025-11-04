// useProductSort hook tests
import { renderHook } from '@testing-library/react';
import { useProductSort } from '../useProductSort';
import type { Product } from '@/types/product';

describe('useProductSort Hook', () => {
  const mockProducts: Product[] = [
    { id: 1, name: 'Zebra Product', price: 100, inStock: true },
    { id: 2, name: 'Apple Product', price: 50, inStock: true },
    { id: 3, name: 'Mango Product', price: '75.50', inStock: true },
    { id: 4, name: 'Banana Product', price: '25.99', inStock: false },
  ];

  it('returns products in original order when sortBy is default', () => {
    const { result } = renderHook(() => useProductSort(mockProducts, 'default'));

    expect(result.current).toEqual(mockProducts);
    expect(result.current[0].name).toBe('Zebra Product');
  });

  it('sorts products by name ascending (A-Z)', () => {
    const { result } = renderHook(() => useProductSort(mockProducts, 'name-asc'));

    expect(result.current[0].name).toBe('Apple Product');
    expect(result.current[1].name).toBe('Banana Product');
    expect(result.current[2].name).toBe('Mango Product');
    expect(result.current[3].name).toBe('Zebra Product');
  });

  it('sorts products by name descending (Z-A)', () => {
    const { result } = renderHook(() => useProductSort(mockProducts, 'name-desc'));

    expect(result.current[0].name).toBe('Zebra Product');
    expect(result.current[1].name).toBe('Mango Product');
    expect(result.current[2].name).toBe('Banana Product');
    expect(result.current[3].name).toBe('Apple Product');
  });

  it('sorts products by price ascending (low to high)', () => {
    const { result } = renderHook(() => useProductSort(mockProducts, 'price-asc'));

    expect(result.current[0].price).toBe('25.99'); // Banana
    expect(result.current[1].price).toBe(50);      // Apple
    expect(result.current[2].price).toBe('75.50'); // Mango
    expect(result.current[3].price).toBe(100);     // Zebra
  });

  it('sorts products by price descending (high to low)', () => {
    const { result } = renderHook(() => useProductSort(mockProducts, 'price-desc'));

    expect(result.current[0].price).toBe(100);     // Zebra
    expect(result.current[1].price).toBe('75.50'); // Mango
    expect(result.current[2].price).toBe(50);      // Apple
    expect(result.current[3].price).toBe('25.99'); // Banana
  });

  it('handles string prices correctly', () => {
    const productsWithStringPrices: Product[] = [
      { id: 1, name: 'Product A', price: '99.99', inStock: true },
      { id: 2, name: 'Product B', price: '10.50', inStock: true },
      { id: 3, name: 'Product C', price: '150.00', inStock: true },
    ];

    const { result } = renderHook(() => useProductSort(productsWithStringPrices, 'price-asc'));

    expect(parseFloat(String(result.current[0].price))).toBe(10.50);
    expect(parseFloat(String(result.current[1].price))).toBe(99.99);
    expect(parseFloat(String(result.current[2].price))).toBe(150.00);
  });

  it('handles mixed number and string prices', () => {
    const mixedProducts: Product[] = [
      { id: 1, name: 'A', price: 100, inStock: true },
      { id: 2, name: 'B', price: '50.50', inStock: true },
      { id: 3, name: 'C', price: 75, inStock: true },
    ];

    const { result } = renderHook(() => useProductSort(mixedProducts, 'price-asc'));

    expect(result.current[0].price).toBe('50.50');
    expect(result.current[1].price).toBe(75);
    expect(result.current[2].price).toBe(100);
  });

  it('does not mutate original products array', () => {
    const originalProducts = [...mockProducts];
    const { result } = renderHook(() => useProductSort(mockProducts, 'price-asc'));

    expect(mockProducts).toEqual(originalProducts);
    expect(result.current).not.toBe(mockProducts); // Different reference
  });

  it('returns empty array when given empty products', () => {
    const { result } = renderHook(() => useProductSort([], 'price-asc'));

    expect(result.current).toEqual([]);
  });

  it('memoizes result and only recalculates when inputs change', () => {
    const { result, rerender } = renderHook(
      ({ products, sortBy }) => useProductSort(products, sortBy),
      { initialProps: { products: mockProducts, sortBy: 'price-asc' as const } }
    );

    const firstResult = result.current;

    // Rerender with same props
    rerender({ products: mockProducts, sortBy: 'price-asc' as const });
    expect(result.current).toBe(firstResult); // Same reference (memoized)

    // Rerender with different sortBy
    rerender({ products: mockProducts, sortBy: 'price-desc' as const });
    expect(result.current).not.toBe(firstResult); // Different reference (recalculated)
  });
});

