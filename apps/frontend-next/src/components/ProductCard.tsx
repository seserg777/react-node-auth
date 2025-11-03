// Product card component
'use client';

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
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
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
            {onAddToCart && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onAddToCart(product)}
                disabled={product.inStock === false}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export type for reuse
export type { Product, ProductCardProps };

