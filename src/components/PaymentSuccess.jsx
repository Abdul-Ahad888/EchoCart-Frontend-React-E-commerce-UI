import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CartContext } from './context/CartContext'

export default function PaymentSuccess() {

    const { clearCart } = useContext(CartContext)

    const [session, setSession] = useState(null)
    const [loader, setLoader] = useState(true)

    const sesUrl = new URLSearchParams(useLocation().search)
    const sessionId = sesUrl.get('session_id')

    const token = localStorage.getItem('authToken')

    useEffect(() => {
        if (sessionId) {
            fetch(`https://echo-cart-back-end.vercel.app/api/v1/payment/checkout-session/${sessionId}`,{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Payment success response:", data);
                    setSession(data.session);
                    setLoader(false);
                    clearCart();
                })                        
                .catch(() => {
                    setLoader(false)
                })
        } else {
            setLoader(false)
        }
    }, [sessionId])

    if (loader) {
        return (
        <div className="modal show d-block" style={{ backgroundColor: "#000000bb" }} tabIndex="-1" role="dialog">
            <div className="spinner-border position-absolute start-50 z-3 border-5 top-50" style={{ color: "#de7127", height: "120px", width: "120px", translate: "-50% -50%" }} role="status">
                <span className="visually-hidden">Redirecting...</span>
            </div>
        </div>
        )
    }

    if (!sessionId || !session) {
        return (
            <div className='text-center mt-5'>
                <h4>No Transaction Found!</h4>
            </div>
        )
    }

    const transactionId = session.payment_intent
    const customerName = session.customer_details.name
    const customerEmail = session.customer_details.email
    const date = new Date(session.created * 1000).toLocaleDateString()
    const totalAmount = (session.amount_total / 100).toFixed(2)

    return (
        <>
            <div className='payment-success-container'>
                <div className="payment-success">
                    <div className='pb-4 border-bottom border-2'>
                        <i className='fa fa-circle-check display-2'></i>
                        <h5 className='text-muted mt-3'>Payment Success!</h5>
                        <small className='text-muted'>Thank You For Your Purchase.</small>
                    </div>

                    <div className='mt-5 text-muted d-flex justify-content-between'>
                        <small>Customer Name:</small>
                        <small>{customerName}</small>
                    </div>

                    <div className='mt-3 text-muted d-flex justify-content-between'>
                        <small>Customer Email:</small>
                        <small>{customerEmail}</small>
                    </div>

                    <div className='mt-3 text-muted d-flex justify-content-between'>    
                        <small>Date:</small>
                        <small>{date}</small>
                    </div>

                    <div className='mt-3 text-muted d-flex justify-content-between'>
                        <small>Transaction ID:</small>
                        <small>{transactionId}</small>
                    </div>

                    <div className='mt-3 text-muted d-flex justify-content-between'>
                        <small>Amount:</small>
                        <h6 className='text-black fw-bold'>$ {totalAmount}</h6>
                    </div>

                    <div className="d-flex justify-content-evenly mt-4">
                        <div>
                            <Link to='/' className='text-dark' style={{ fontSize: "12px" }}>Go To Home</Link>
                        </div>

                        <div>
                            <Link to='/profile/my-orders' className='text-dark' style={{ fontSize: "12px" }}>View Order Details</Link>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}
