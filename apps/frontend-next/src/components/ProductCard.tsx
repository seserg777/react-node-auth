// Product card component
'use client';

import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cartSlice';
import type { AppDispatch } from '@/lib/store';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: number) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }));
  };

  return (
    <div className="card h-100">
      {product.image && (
        <img 
          src={product.image} 
          className="card-img-top" 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        {product.category && (
          <span className="badge bg-secondary mb-2 align-self-start">
            {product.category}
          </span>
        )}
        {product.description && (
          <p className="card-text text-muted flex-grow-1">
            {product.description}
          </p>
        )}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="h5 mb-0 text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.inStock !== undefined && (
              <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
          <div className="d-grid gap-2">
            {onViewDetails && (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => onViewDetails(product.id)}
              >
                View Details
              </button>
            )}
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              disabled={product.inStock === false}
            >
              {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export type for reuse
export type { Product, ProductCardProps };

