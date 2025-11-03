// Product type definitions
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string; // API returns string from DECIMAL field
  image?: string;
  category?: string;
  inStock?: boolean;
  stockQuantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryResponse {
  categories: string[];
}

