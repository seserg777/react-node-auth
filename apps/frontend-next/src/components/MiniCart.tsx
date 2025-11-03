// Mini cart component (icon with modal)
'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/features/cartSlice';
import type { RootState, AppDispatch } from '@/lib/store';

export default function MiniCart() {
  const [showModal, setShowModal] = useState(false);
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      dispatch(clearCart());
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Cart Icon */}
      <div className="position-relative" style={{ cursor: 'pointer' }}>
        <button 
          className="btn btn-outline-light position-relative"
          onClick={() => totalItems > 0 && setShowModal(true)}
          disabled={totalItems === 0}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            fill="currentColor" 
            className="bi bi-cart3" 
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg>
          
          {/* Badge with item count */}
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
              <span className="visually-hidden">items in cart</span>
            </span>
          )}
        </button>
      </div>

      {/* Cart Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                
                <div className="modal-body">
                  {items.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="list-group">
                      {items.map((item) => (
                        <div key={item.id} className="list-group-item">
                          <div className="row align-items-center">
                            {item.image && (
                              <div className="col-3">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="img-fluid rounded"
                                  style={{ maxHeight: '60px', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                            <div className={item.image ? 'col-9' : 'col-12'}>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-0">{item.name}</h6>
                                  <small className="text-muted">
                                    ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)} each
                                  </small>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRemove(item.id)}
                                  title="Remove from cart"
                                >
                                  ×
                                </button>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center">
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
                                <strong className="text-primary">
                                  ${(parseFloat(String(item.price)) * item.quantity).toFixed(2)}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {items.length > 0 && (
                  <div className="modal-footer flex-column">
                    <div className="d-flex justify-content-between w-100 mb-2">
                      <strong>Total:</strong>
                      <strong className="text-primary fs-5">
                        ${totalPrice.toFixed(2)}
                      </strong>
                    </div>
                    
                    <div className="d-grid gap-2 w-100">
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          alert('Checkout functionality to be implemented');
                          setShowModal(false);
                        }}
                      >
                        Proceed to Checkout
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleClearCart}
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </>
  );
}

