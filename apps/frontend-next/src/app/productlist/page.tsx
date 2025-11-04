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
import { useProductSort } from '@/hooks/useProductSort';
import type { Product } from '@/types/product';
import { productAPI } from '@/lib/api';

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get page and sort from URL query params
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sortFromUrl = (searchParams.get('sort') || 'default') as SortOption;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>(sortFromUrl);

  // Sync state with URL changes (browser back/forward)
  useEffect(() => {
    const newPage = parseInt(searchParams.get('page') || '1', 10);
    const newSort = (searchParams.get('sort') || 'default') as SortOption;
    
    if (newPage !== page) setPage(newPage);
    if (newSort !== sortBy) setSortBy(newSort);
  }, [searchParams]);

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

  // Use custom hook for sorting
  const sortedProducts = useProductSort(products, sortBy);

  // Build URL for pagination links
  const buildUrl = (pageNum: number, sort: SortOption = sortBy) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set('page', pageNum.toString());
    if (sort !== 'default') params.set('sort', sort);
    
    const queryString = params.toString();
    return queryString ? `/productlist?${queryString}` : '/productlist';
  };

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    router.push(buildUrl(page, newSort), { scroll: false });
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
