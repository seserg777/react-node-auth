// Product List page (Next.js)
'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { type Product } from '@/components/ProductCard';

export default function ProductListPage() {
  // Mock data - в реальном приложении будет из API или базы данных
  const [products] = useState<Product[]>([
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5">Product Catalog</h1>
            <p className="text-muted">Browse our selection of products</p>
          </div>
        </div>

        {/* Product Grid */}
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
        {products.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted">No products available</h3>
            <p>Check back later for new items</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
