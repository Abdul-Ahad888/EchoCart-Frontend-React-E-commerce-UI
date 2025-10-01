import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from './context/CartContext'
import { Link } from 'react-router-dom'
import { getNames, getCode } from 'country-list'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";


const countryOptions = getNames().map(name => ({
    value: getCode(name),
    label: name
}))


export default function Checkout() {

    const { cartItems, delivery, discountPercent } = useContext(CartContext)

    const [err, setErr] = useState(false)
    const [selectCountry, setSelectCountry] = useState('')
    const [phoneNum, setPhoneNum] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [appartment, setAppartment] = useState('')
    const [address, setAddress] = useState('')
    const [zipCode, setZipCode] = useState('')

    const totalItemPrice = cartItems.reduce((sum, item) => sum + item.Product.price * item.quantity, 0).toFixed(2)
    const discount = (totalItemPrice * discountPercent) / 100;

    let deliveryPrice = 0
    if (delivery === "Standard Delivery - 2$") deliveryPrice = 2
    if (delivery === "Fast Delivery - 5$") deliveryPrice = 5

    const totalCost = (
        cartItems.reduce((sum, item) => sum + item.Product.price * item.quantity, 0) +
        deliveryPrice - discount
    ).toFixed(2)

    const handleCheckout = async () => {
        try {

            if (!selectCountry || !city || !address || !zipCode || !phoneNum) {
                setErr(true)
                return
            }
            setErr(false)

            if (!cartItems.length || !totalItemPrice) {
                window.alert('Please Add Some Items In Cart To Proceed!')
                return
            }


            const res = await fetch('https://echo-cart-back-end.vercel.app/api/v1/payment/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        name: item.Product.title,
                        price: item.Product.price,
                        quantity: item.quantity,
                    })),
                    discountPercent,
                    deliveryPrice,
                    country: selectCountry,
                    city,
                    state,
                    address,
                    appartment,
                    zipCode,
                    phone: phoneNum
                })
            })
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No URL returned", data);
            }
        } catch (err) {
            console.error("Checkout error:", err);
        }
    }

    return (
        <div className='container-fluid'>
            <div className="row">
                {/* LEFT SIDE */}
                <div className="col-12 col-lg-7 col-xl-8 col-xxl-9">
                    <div className='position-absolute' style={{ top: "4px", left: "10px" }}>
                        <Link to={'/cart'} className='text-black text-decoration-none border-bottom border-1 border-black pb-1'><i style={{ fontSize: "12px" }} className='fa fa-arrow-left-long me-2'></i><small style={{ fontSize: "12px" }}>Return To Cart</small></Link>
                    </div>
                    <div className="mt-5 mx-2 m-md-5">
                        <div className='border-bottom border-1 pb-4 '>
                            <h1>CHECKOUT</h1>
                            <h6 className='text-secondary'>Choose Delivery Address And Payment Method.</h6>
                        </div>

                        {/* Delivery Address */}
                        <div className='my-5'>
                            <h3>DELIVERY ADDRESS</h3>
                            <div className='row mt-4 mx-0 delivery-address-form'>
                                <form>
                                    <div className="col-12">
                                        {/* Country List */}
                                        <div className='country-list py-0'>
                                            <select className='w-100' value={selectCountry} onChange={(e) => setSelectCountry(e.target.value)}>
                                                <option value=''>Select Country</option>
                                                {countryOptions.map((country, index) => (
                                                    <option key={index} value={country.value}> {country.label}</option>
                                                ))}
                                            </select>
                                            <i className='fa fa-chevron-down'></i>
                                        </div>
                                    </div>

                                    <div className="col-12 py-2">
                                        <input type="text" className='w-100' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} required />
                                    </div>
                                    <div className="col-12 py-2">
                                        <input type="text" className='w-100' placeholder='State' value={state} onChange={(e) => setState(e.target.value)} />
                                    </div>
                                    <div className="col-12 py-2">
                                        <input type="text" className='w-100' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
                                    </div>

                                    {/* Phone No */}
                                    <div className='col-12'>
                                        <PhoneInput country={'pk'} value={phoneNum} onChange={(phone) => setPhoneNum(phone)}>
                                        </PhoneInput>
                                    </div>

                                    <div className="col-12 py-2">
                                        <input type="text" className='w-100' placeholder='Appartment, Suite, etc... (optional)' value={appartment} onChange={(e) => setAppartment(e.target.value)} />
                                    </div>
                                    <div className="col-12 py-2">
                                        <input type="text" className='w-100' placeholder='Zip Code' maxlength="10" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                                    </div>
                                </form>
                            </div>
                        </div>

                        {err && (
                            <div className='row border border-1 border-danger p-3 delivery-address-form mb-5 mx-0'>
                                <small className='text-danger'><i className='fa fa-circle-exclamation'></i> <span className='fw-bold'>ERROR</span> : All Required Fields Should Be Filled To Proceed!</small>
                            </div>
                        )}


                        {/* Payment Method */}
                        {/* <div className='my-5'>
                            <h3>PAYMENT METHOD</h3>
                            <button className='bg-transparent border-0 text-start w-100'>
                                <div className='mt-4 payment-method'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center'>
                                            <i className='fa fa-circle-dot fs-4 me-3'></i>
                                            <div>
                                                <div className='fs-4'>PAYPAL</div>
                                                <p className='m-0 text-secondary'>Add Your Paypal Here</p>
                                            </div>
                                        </div>
                                        <img style={{ width: "60px" }} src={paypal} alt="PayPal Logo" />
                                    </div>
                                </div>
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* RIGHT SIDE (Order Summary) */}
                <div className="col-12 col-lg-5 col-xl-4 col-xxl-3 p-0 d-flex">
                    <div className="checkout-summary px-5 pt-5 pb-4 d-flex flex-column justify-content-between">
                        <div>
                            <h2 className='fw-bold border-bottom border-2 pb-4'>Order Summary</h2>
                            <div className="d-flex justify-content-between mt-4 pt-4">
                                <span>Items ({cartItems.length})</span>
                                <span>${totalItemPrice}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <span>Shipping</span>
                                <span>{delivery}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-4 pb-5">
                                <span>Discount</span>
                                <span>-{discountPercent}%</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold border-top border-2 py-4">
                                <span>Total</span>
                                <span className='fw-bold'>${totalCost}</span>

                            </div>
                        </div>

                        {/* Place Order Button at Bottom */}
                        <div>
                            <button className="btn-stripe w-100 mt-3" onClick={handleCheckout}>Pay With Stripe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
