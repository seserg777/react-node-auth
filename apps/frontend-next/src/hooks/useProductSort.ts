// Hook for product sorting logic
import { useMemo } from 'react';
import type { Product } from '@/types/product';
import type { SortOption } from '@/components/ProductSort';

export function useProductSort(products: Product[], sortBy: SortOption) {
  return useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(String(a.price)) - parseFloat(String(b.price));
        case 'price-desc':
          return parseFloat(String(b.price)) - parseFloat(String(a.price));
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0; // Keep original order
      }
    });
  }, [products, sortBy]);
}

