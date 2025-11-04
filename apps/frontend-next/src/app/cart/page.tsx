// Shopping Cart page (Next.js)
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/features/cartSlice';
import type { RootState, AppDispatch } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(id);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon! Total: $' + totalPrice.toFixed(2));
  };

  const handleContinueShopping = () => {
    router.push('/productlist');
  };

  const formatPrice = (price: number | string) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5">Shopping Cart</h1>
            <p className="text-muted">
              {totalItems > 0 
                ? `You have ${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart` 
                : 'Your cart is empty'}
            </p>
          </div>
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="80" 
                    height="80" 
                    fill="currentColor" 
                    className="bi bi-cart-x text-muted mb-3" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793z"/>
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                  </svg>
                  <h3 className="text-muted mb-3">Your cart is empty</h3>
                  <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleContinueShopping}
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Cart Items ({totalItems})</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" style={{ width: '50%' }}>Product</th>
                          <th scope="col" className="text-center">Price</th>
                          <th scope="col" className="text-center">Quantity</th>
                          <th scope="col" className="text-center">Total</th>
                          <th scope="col" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => {
                          const itemPrice = parseFloat(formatPrice(item.price));
                          const itemTotal = itemPrice * item.quantity;
                          
                          return (
                            <tr key={item.id}>
                              {/* Product Info */}
                              <td>
                                <div className="d-flex align-items-center">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="img-thumbnail me-3"
                                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                  )}
                                  <div>
                                    <h6 className="mb-0">{item.name}</h6>
                                    <small className="text-muted">ID: {item.id}</small>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="text-center align-middle">
                                <strong>${itemPrice.toFixed(2)}</strong>
                              </td>

                              {/* Quantity Controls */}
                              <td className="text-center align-middle">
                                <div className="d-flex justify-content-center">
                                  <div className="btn-group btn-group-sm" role="group">
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-secondary"
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    >
                                      −
                                    </button>
                                    <input 
                                      type="number" 
                                      className="form-control form-control-sm text-center" 
                                      style={{ width: '60px' }}
                                      value={item.quantity}
                                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                      min="1"
                                    />
                                    <button 
                                      type="button" 
                                      className="btn btn-outline-secondary"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Item Total */}
                              <td className="text-center align-middle">
                                <strong className="text-primary">
                                  ${itemTotal.toFixed(2)}
                                </strong>
                              </td>

                              {/* Remove Button */}
                              <td className="text-center align-middle">
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRemove(item.id)}
                                  title="Remove from cart"
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    fill="currentColor" 
                                    className="bi bi-trash" 
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Continue Shopping Button */}
              <button 
                className="btn btn-outline-secondary mt-3"
                onClick={handleContinueShopping}
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  {/* Items Breakdown */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal ({totalItems} items):</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Shipping:</span>
                      <span className="text-success">FREE</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tax (estimated):</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong className="fs-5">Total:</strong>
                      <strong className="text-primary fs-4">
                        ${(totalPrice * 1.1).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3">
                    <div className="alert alert-info small mb-0">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-info-circle-fill me-2" 
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                      </svg>
                      <strong>Free shipping</strong> on all orders over $50
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-3 text-center">
                    <small className="text-muted d-block mb-2">We accept:</small>
                    <div className="d-flex justify-content-center gap-2">
                      <span className="badge bg-light text-dark border">💳 Visa</span>
                      <span className="badge bg-light text-dark border">💳 Mastercard</span>
                      <span className="badge bg-light text-dark border">💳 PayPal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="card shadow-sm mt-3">
                <div className="card-body">
                  <h6 className="card-title">Have a promo code?</h6>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter code"
                      disabled
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      disabled
                    >
                      Apply
                    </button>
                  </div>
                  <small className="text-muted">Coming soon!</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products Section (placeholder) */}
        {items.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h4 className="mb-3">You may also like</h4>
              <div className="alert alert-secondary">
                <p className="mb-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="currentColor" 
                    className="bi bi-lightbulb me-2" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
                  </svg>
                  Recommended products based on your cart (feature coming soon)
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

