// Product List page (Next.js)
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';
import { productAPI } from '@/lib/api';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');

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

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
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

  const handleViewDetails = (productId: number) => {
    console.log('View product details:', productId);
    // TODO: Navigate to product details page
    alert(`View details for product ID: ${productId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="display-5">Product Catalog</h1>
            <p className="text-muted">
              {products.length > 0 ? 'Browse our selection of products' : 'Loading products from database...'}
            </p>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column align-items-md-end mt-3 mt-md-0">
              <div className="d-flex align-items-center">
                <label htmlFor="sortSelect" className="me-2 text-nowrap">
                  <i className="bi bi-sort-down me-1"></i>
                  Sort by:
                </label>
                <select
                  id="sortSelect"
                  className={`form-select form-select-sm ${sortBy !== 'default' ? 'border-primary' : ''}`}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{ width: 'auto', minWidth: '180px' }}
                >
                  <option value="default">Default</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
              {sortBy !== 'default' && (
                <small className="text-muted mt-1">
                  <i className="bi bi-check-circle-fill text-success me-1"></i>
                  Sorting applied across all pages
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> Could not load products from server. {error}
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
              {sortedProducts.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard 
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>

            {/* Empty state */}
            {products.length === 0 && !loading && (
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
