// Product List page (Next.js)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductSort, { type SortOption } from '@/components/ProductSort';
import Pagination from '@/components/Pagination';
import { ErrorAlert } from '@/components/Alert';
import type { Product } from '@/types/product';
import { productAPI } from '@/lib/api';

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get page from URL query params, sort from state only
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Sync page with URL changes (browser back/forward)
  useEffect(() => {
    const newPage = parseInt(searchParams.get('page') || '1', 10);
    if (newPage !== page) setPage(newPage);
  }, [searchParams]);

  // Fetch products from API (with sorting)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getProducts({ 
          page, 
          limit: 12,
          sortBy: sortBy !== 'default' ? sortBy : undefined
        });
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
  }, [page, sortBy]); // Re-fetch when page OR sortBy changes

  // Build URL for pagination links (only page, no sort)
  const buildUrl = (pageNum: number) => {
    if (pageNum > 1) {
      return `/productlist?page=${pageNum}`;
    }
    return '/productlist';
  };

  // Handle sort change (state only, no URL update)
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

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
            <ProductSort 
              sortBy={sortBy} 
              onSortChange={handleSortChange}
              className="mt-3 mt-md-0"
            />
          </div>
        </div>

        {error && (
          <ErrorAlert 
            message={`Could not load products from server. ${error}`}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

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
              {products.map((product) => (
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              buildUrl={buildUrl}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
