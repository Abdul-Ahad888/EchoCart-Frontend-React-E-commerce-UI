import React, { useContext } from 'react';
import cart from '../../assets/empty-cart.png';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Cart({ closeCart, isCartVisible }) {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  return (
    <>
      {isCartVisible && <div className="cart-backdrop" onClick={closeCart}></div>}
      <div className={`cart-modal ${isCartVisible ? 'show' : ''}`}>
        <div className="cart-head">
          <h1 className="fw-bold d-inline-block">
            <Link to="/cart">CART</Link>
          </h1>
          <i className="fa fa-close float-end" onClick={closeCart}></i>
        </div>
        <div className="cart-body">

          {/* Empty Cart */}
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <div>
                <img src={cart} alt="Empty Cart" />
                <h3 className="py-2 fs-3 px-4">Your cart is empty. Find something you love.</h3>
                <button className="btn-theme-outline" onClick={closeCart}>
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;
              
              const discount = Math.floor(product.discountPercentage || 0);
              const discountedPrice = (
                product.price - (product.price * discount) / 100
              ).toFixed(2);

              const hasDiscount = discount > 1;

              return (
                <div className="cart-items" key={item.id}>

                  <Link to={`/product/${product.id}`} onClick={closeCart}>
                    <div className="cart-item">
                      <img src={product.thumbnail} alt={product.title} />
                      <div className="cart-items-text">
                        <p className="text-truncate">{product.title}</p>

                        {!hasDiscount && (
                          <div className="no-discount">
                            <p className="fw-semibold">${product.price}</p>
                          </div>
                        )}

                        {hasDiscount && (
                          <div className="discounted">
                            <p className="fw-semibold m-0" style={{ color: '#000' }}>
                              ${discountedPrice}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="cart-quantity mt-4">
                    <div className="cart-quantity-wrapper">
                      <input type="number" value={item.quantity} readOnly />
                      <button className="btn-plus" onClick={() => increaseQuantity(item.id)}>+</button>
                      <button className="btn-minus" onClick={() => decreaseQuantity(item.id)}>-</button>
                    </div>
                  </div>

                  <button
                    className="border-0 bg-transparent cart-item-delete"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              );
            })
          )}

        </div>
      </div>
    </>
  );
}
