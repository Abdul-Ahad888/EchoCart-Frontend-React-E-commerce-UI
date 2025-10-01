import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cart from '../assets/empty-cart.png'
import { CartContext } from './context/CartContext'

export default function () {

    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, delivery, setDelivery, discountPercent, setDiscountPercent } = useContext(CartContext)

    const navigate = useNavigate()

    const [couponCode, setCoupunCode] = useState('')
    // const [delivery, setDelivery] = useState('Standard Delivery - 2$')
    const [isApplied, setIsApplied] = useState(false)
    // const [discountPercent, setDiscountPercent] = useState(0)
    const [couponLoading, setCouponLoading] = useState(false)
    const [inputDisable, setInputDisable] = useState(false)



    const scrollVisibleAtCart = true;
    if (scrollVisibleAtCart) {
        document.body.classList.remove('no-scroll')
    }
    else {
        document.body.classList.add('no-scroll')
    }


    const shopCode = "ECHO-CART"
    const save30 = "SAVE30"
    const ec14 = "EC-14"

    const handlePromoCode = () => {
        if (couponCode === '') {
            alert("Coupon Code Must Be Filled!")
            return
        }
        setCouponLoading(true)
        setInputDisable(true)
        setTimeout(() => {
            setInputDisable(false)
            if (shopCode === couponCode) {
                setIsApplied(true)
                setDiscountPercent(32)
                setCouponLoading(false)
                return
            }
            if (save30 === couponCode) {
                setIsApplied(true)
                setDiscountPercent(30)
                setCouponLoading(false)
                return
            }
            if (ec14 === couponCode) {
                setIsApplied(true)
                setDiscountPercent(14)
                setCouponLoading(false)
                return
            }
            else {
                alert("Invalid Promo Code!")
                setCouponLoading(false)
            }
        }, 2000);

    }

    // Calculating All Items Price
    const totalItemPrice = cartItems.reduce((sum, item) => sum + (item.product?.price || 0)* item.quantity, 0).toFixed(2)

    // Delivery Price Management
    let deliveryPrice = 0

    if (delivery === "Standard Delivery - 2$") {
        deliveryPrice = 2
    }

    if (delivery === "Fast Delivery - 5$") {
        deliveryPrice = 5
    }

    // Discount calculation
    const discount = (totalItemPrice * discountPercent) / 100;

    // Total cost calculation
    const totalCost = (cartItems.reduce((sum, item) => sum + item.product?.price * item.quantity, 0) + deliveryPrice - discount).toFixed(2);

    // HandleCheckOut
    const handleCheckOut = async () => {

        const token = localStorage.getItem('authToken')

        try {
          if (!cartItems.length || !totalItemPrice) {
            window.alert('Please Add Some Items In Cart To Proceed!')
            return
          }
      
          let deliveryPrice = 0;
          if (delivery === "Standard Delivery - 2$") deliveryPrice = 2;
          if (delivery === "Fast Delivery - 5$") deliveryPrice = 5;
      
          const res = await fetch('https://echo-cart-back-end.vercel.app/api/v1/payment/checkout', {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
             },
            body: JSON.stringify({
              items: cartItems.map(item => ({
                id: item.product?.id,
                title: item.product?.title,
                price: item.product?.price,
                quantity: item.quantity,
              })),
              deliveryPrice,
              discountPercent,
            }),
          });
          
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
          } else {
            console.error("No URL returned", data);
          }
        } catch (err) {
          console.error("Checkout error:", err);
        }
      };
      
      
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-xl-9">
                    <div className='cart'>
                        <div className='cart-title'>
                            <h1>SHOPPING CART</h1>
                        </div>
                        <div class="cart-container">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>

                                {cartItems.length === 0 ? (
                                    <div className="empty-cart-message h-50 p-5">
                                        <div className='text-center'>
                                            <img src={cart} alt="" />
                                            <h3 className="py-2">Your Cart Is Empty</h3>
                                            <button className="btn-theme-outline" onClick={() => navigate('/')}>
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    cartItems.map((item) => {

                                        const totalPrice = ((item.product.price || 0) * item.quantity).toFixed(2)

                                        return (
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div class="item-container">
                                                            <img src={item.product?.thumbnail} className="me-4" alt="Cart" />
                                                            <div className="item-info">
                                                                <p className="item-title">{item.product?.title}</p>
                                                                <p className="item-brand">{item.product?.brand}</p>
                                                                <button className='item-remove' onClick={() => removeFromCart(item.id)}>Remove</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cart-quantity-c mt-4">
                                                            <div className="cart-quantity-wrapper-c">
                                                                <input type="number" value={item.quantity} />
                                                                <button className="btn-plus" onClick={() => increaseQuantity(item.id)}>+</button>
                                                                <button className="btn-minus" onClick={() => decreaseQuantity(item.id)}>-</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='cart-price'>{item.product?.price}</td>
                                                    <td className='cart-total-price'>{totalPrice}</td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                )}

                            </table>
                            <Link to={'/'}>
                                <div className='go-back'>
                                    <button><i className='fa fa-arrow-left'></i> Continue Shopping</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-3 g-0">
                    <div className="cart-checkout">
                        <div className="cart-checkout-title">
                            <h1>Order Details</h1>
                        </div>
                        <div className="cart-checkout-body">
                            <div className="cart-checkout-items">
                                <h6 className='d-inline-block'>ITEMS ({cartItems.length})</h6>
                                <h6 className='float-end'>${totalItemPrice}</h6>
                            </div>
                            <div className="cart-checkout-ship">
                                <h6>SHIPPING :</h6>
                                <select name="" id="" onClick={(e) => setDelivery(e.target.value)}>
                                    <option value="Standard Delivery - 2$">Standard Delivery - $2</option>
                                    <option value="Fast Delivery - 5$">Fast Delivery - $5</option>
                                </select>
                            </div>
                            <div className="cart-checkout-promo">
                                <h6>COUPON CODE :</h6>
                                <small>Do You Have Any Discount Code? Once Can Be Applied Per Order, Enter Below To Proceed.</small>
                                <input type="text" placeholder='Enter Your Code' disabled={isApplied || inputDisable} onKeyDown={(e) => { if (e.key === 'Enter') { handlePromoCode() } }} onChange={(e) => setCoupunCode(e.target.value)} />
                                {isApplied &&
                                    <div className='coupon-code-off'><i className='fa fa-check'></i>{discountPercent}% OFF</div>
                                }
                                <button disabled={isApplied} onClick={handlePromoCode}>{isApplied ? "Applied" : couponLoading ? <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> : "Apply"}</button>
                            </div>
                        </div>

                        <div className="cart-checkout-total-price">
                            <div className='mb-4'>
                                <h5 className='d-inline-block fs-6'>Shipping :</h5>
                                <h5 className='d-inline-block fs-6 float-end'>{delivery}</h5>
                            </div>

                            <div className='mb-4'>
                                <h5 className='d-inline-block fs-6'>Discount :</h5>
                                <h5 className='d-inline-block fs-6 float-end'>{discountPercent}%</h5>
                            </div>

                            <div className='total-cost-container'>
                                <h5 className='d-inline-block'>Total Cost :</h5>
                                <h5 className='float-end total-cost'>${totalCost}</h5>
                            </div>
                        </div>

                        <div>
                            <button className="btn-stripe w-100 mt-3" onClick={handleCheckOut}>Pay With Stripe</button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
