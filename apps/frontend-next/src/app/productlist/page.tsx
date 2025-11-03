// Product List page (Next.js)
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';
import { productAPI } from '@/lib/api';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getProducts({ page, limit: 12 });
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  // Fallback mock data if API fails
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro 15',
      description: 'High-performance laptop with 16GB RAM and 512GB SSD',
      price: 1299.99,
      category: 'Electronics',
      inStock: true,
      image: 'https://via.placeholder.com/300x200/0d6efd/ffffff?text=Laptop+Pro'
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 29.99,
      category: 'Accessories',
      inStock: true,
      image: 'https://via.placeholder.com/300x200/198754/ffffff?text=Mouse'
    },
    {
      id: 3,
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with multiple ports',
      price: 49.99,
      category: 'Accessories',
      inStock: false,
      image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=USB+Hub'
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches',
      price: 89.99,
      category: 'Accessories',
      inStock: true,
      image: 'https://via.placeholder.com/300x200/ffc107/000000?text=Keyboard'
    },
    {
      id: 5,
      name: '4K Monitor 27"',
      description: 'Ultra HD 4K monitor with HDR support',
      price: 399.99,
      category: 'Electronics',
      inStock: true,
      image: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=Monitor'
    },
    {
      id: 6,
      name: 'Webcam HD',
      description: '1080p webcam with built-in microphone',
      price: 79.99,
      category: 'Electronics',
      inStock: true,
      image: 'https://via.placeholder.com/300x200/fd7e14/ffffff?text=Webcam'
    }
  ]);

  const handleViewDetails = (productId: number) => {
    console.log('View product details:', productId);
    // TODO: Navigate to product details page
    alert(`View details for product ID: ${productId}`);
  };

  // Use mock data if real data fails to load
  const displayProducts = products.length > 0 ? products : (error ? mockProducts : []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5">Product Catalog</h1>
            <p className="text-muted">
              {products.length > 0 ? 'Browse our selection of products' : 'Loading products from database...'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-warning" role="alert">
            <strong>Warning:</strong> Could not load products from server. Showing sample data. {error}
          </div>
        )}

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {displayProducts.map((product) => (
            <div key={product.id} className="col">
              <ProductCard 
                product={product}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>

            {/* Empty state */}
            {displayProducts.length === 0 && !loading && (
              <div className="col-12 text-center py-5">
                <h3 className="text-muted">No products available</h3>
                <p>Check back later for new items</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="col-12">
                <nav aria-label="Product pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
