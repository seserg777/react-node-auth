// Product Detail page (Next.js)
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ErrorAlert, SuccessAlert } from '@/components/Alert';
import { addToCart } from '@/lib/features/cartSlice';
import type { AppDispatch } from '@/lib/store';
import type { Product } from '@/types/product';
import { productAPI } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productId = parseInt(params.id as string, 10);
        
        if (isNaN(productId)) {
          setError('Invalid product ID');
          return;
        }

        const data = await productAPI.getProductById(productId);
        setProduct(data.product);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 999)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }));
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  const formatPrice = (price: number | string) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/productlist" className="text-decoration-none">Products</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product?.name || 'Product Details'}
            </li>
          </ol>
        </nav>

        {error && (
          <ErrorAlert 
            message={error}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        {addedToCart && (
          <SuccessAlert 
            message={`Added ${quantity} item(s) to cart!`}
            dismissible
            onDismiss={() => setAddedToCart(false)}
          />
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        )}

        {!loading && product && (
          <div className="row">
            {/* Product Image */}
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <img 
                  src={product.image || 'https://via.placeholder.com/500x500?text=No+Image'} 
                  className="card-img-top" 
                  alt={product.name}
                  style={{ height: '500px', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="col-md-6">
              <h1 className="display-5 mb-3">{product.name}</h1>
              
              {product.category && (
                <div className="mb-3">
                  <span className="badge bg-secondary fs-6">
                    {product.category}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <span className="display-4 text-primary fw-bold">
                  ${formatPrice(product.price)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.inStock ? (
                  <div className="alert alert-success d-inline-flex align-items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      fill="currentColor" 
                      className="bi bi-check-circle-fill me-2" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <strong>In Stock</strong>
                    {product.stockQuantity && product.stockQuantity > 0 && (
                      <span className="ms-2">({product.stockQuantity} available)</span>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-danger d-inline-flex align-items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      fill="currentColor" 
                      className="bi bi-x-circle-fill me-2" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                    </svg>
                    <strong>Out of Stock</strong>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="mb-4">
                  <label className="form-label fw-bold">Quantity:</label>
                  <div className="d-flex align-items-center">
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        style={{ width: '80px' }}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stockQuantity || 999}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={product.stockQuantity ? quantity >= product.stockQuantity : false}
                      >
                        +
                      </button>
                    </div>
                    <span className="ms-3 text-muted">
                      Total: <strong className="text-primary fs-5">
                        ${(parseFloat(formatPrice(product.price)) * quantity).toFixed(2)}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-2 mb-4">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="currentColor" 
                    className="bi bi-lightning-fill me-2" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z"/>
                  </svg>
                  Buy Now
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="currentColor" 
                    className="bi bi-cart-plus-fill me-2" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0"/>
                  </svg>
                  Add to Cart
                </button>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Product Description</h5>
                    <p className="card-text text-muted">{product.description}</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title">Product Information</h5>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Product ID:</td>
                        <td>{product.id}</td>
                      </tr>
                      {product.category && (
                        <tr>
                          <td className="fw-bold">Category:</td>
                          <td>{product.category}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="fw-bold">Availability:</td>
                        <td>
                          <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                      {product.stockQuantity !== undefined && (
                        <tr>
                          <td className="fw-bold">Stock Quantity:</td>
                          <td>{product.stockQuantity}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-4">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => router.back()}
                >
                  ← Back to Products
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !product && !error && (
          <div className="text-center py-5">
            <h3 className="text-muted">Product not found</h3>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/productlist')}
            >
              Browse Products
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

