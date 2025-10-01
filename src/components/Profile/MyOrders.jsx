import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileSideBar from "./ProfileSideBar";
import { Link } from "react-router-dom";

const MyOrders = () => {
    const [detailBox, setDetailBox] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [copyTracking, setCopyTracking] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get("https://echo-cart-back-end.vercel.app/api/v1/order", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err.response?.data || err.message);
            }
        };

        fetchOrders();
    }, []);

    const copyTrackingNumber = (trackingNumber, e) => {
        navigator.clipboard.writeText(trackingNumber).then(() => {
            setCopyTracking(true);
            setPosition({ x: e.clientX, y: e.clientY });
            setTimeout(() => setCopyTracking(false), 1500);
        });
    };

    const handleDetailBox = (order = null) => {
        setSelectedOrder(order);
        setDetailBox(!detailBox);
    };

    useEffect(() => {
        if (detailBox) {
            document.body.style.overflow = 'auto'
        } else {
            document.body.style.overflow = 'hidden'
        }
    }, [detailBox])

    const handleRefund = () => {
        const isConfirmed = window.confirm("Are you sure you want to return your order?");
        if (isConfirmed) {
            console.log('order status canceled')
        } else { return }
    }

    const trackingNumber = 247289472874


    return (
        <>

            {copyTracking && (
                <div style={{ position: "fixed", top: `${position.y}px`, left: `${position.x}px`, background: "#2d2d2d", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", pointerEvents: "none", transform: "translate(-50%, -50%)", zIndex: 9999 }}> Copied! </div>
            )}

            {selectedOrder && (
                <div className="detail-dialoge-box" style={{ zIndex: detailBox ? '-2' : '99999', opacity: detailBox ? '0' : '1' }}>
                    <div className="mb-4">
                        <i className="fa fa-check border border-black border-2 rounded rounded-5 p-1 me-2"></i>
                        <span style={{ fontSize: '13px' }}>THANK YOU FOR ORDER</span>
                        <div className="float-end my-1 me-1" style={{ cursor: 'pointer' }}>
                            <i className="fa fa-close fs-5" onClick={() => handleDetailBox(null)}></i>
                        </div>
                    </div>

                    <div className="px-4 py-4 border-top border-start border-2 border-black">
                        <h5 className="mb-4">Order Details :</h5>
                        <p>Customer Name: {selectedOrder.customerName}</p>
                        <p>Transaction Number: {selectedOrder.transactionId}</p>
                        <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        <p>Items: {selectedOrder.quantity}</p>

                        <h5 className="my-4">Shipping Info :</h5>
                        <p>Address: {selectedOrder.address} / {selectedOrder.city}</p>
                        <p>Country: {selectedOrder.country}</p>
                        <p>Contact: {selectedOrder.phone}</p>

                        <h5 className="my-4">Amount :</h5>
                        <p>${selectedOrder.amount}</p>

                        <h5 className='d-inline-block'>Order Status :</h5>
                        <div className={`d-inline-block float-end mt-1 badge ${selectedOrder.status === 'delivered' ? 'bg-success' : selectedOrder.status === 'processing' ? 'bg-secondary' : 'bg-danger'}`}>
                            <small className="fw-bold">{selectedOrder.status}</small>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid">
                <div className="row">
                    <ProfileSideBar />
                    <div className="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div className='profile-head'>
                            <h2><Link to='/'>Home</Link> <i className='fa fa-chevron-right fs-5 mx-3'></i> <span className='text-muted'>My Orders</span></h2>
                        </div>

                        <div className="my-orders">
                            <div className="orders-tabs">

                                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li class="nav-item my-1" role="presentation">
                                        <button class="nav-link active" id="pills-all-orders-tab" data-bs-toggle="pill" data-bs-target="#pills-all-orders" type="button" role="tab" aria-controls="pills-all-orders" aria-selected="true">All Orders</button>
                                    </li>
                                    <li class="nav-item my-1" role="presentation">
                                        <button class="nav-link" id="pills-delivered-tab" data-bs-toggle="pill" data-bs-target="#pills-delivered" type="button" role="tab" aria-controls="pills-delivered" aria-selected="false">Delivered</button>
                                    </li>
                                    <li class="nav-item my-1" role="presentation">
                                        <button class="nav-link" id="pills-processing-tab" data-bs-toggle="pill" data-bs-target="#pills-processing" type="button" role="tab" aria-controls="pills-processing" aria-selected="false">Processing</button>
                                    </li>
                                    <li class="nav-item my-1" role="presentation">
                                        <button class="nav-link" id="pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#pills-cancel" type="button" role="tab" aria-controls="pills-cancel" aria-selected="false">Canceled</button>
                                    </li>
                                </ul>

                                <div class="tab-content" id="pills-tabContent">
                                    <div class="tab-pane fade show active" id="pills-all-orders" role="tabpanel" aria-labelledby="pills-all-orders-tab" tabindex="0">
                                        <div className="all-orders">
                                            <div className="row">
                                                {orders.map((order) => (
                                                    <div className="col-12 col-lg-6 col-xl-4 mt-4 px-0 px-md-2">
                                                        <div className="all-order-container">
                                                            <div className="fw-semibold order-number">
                                                                {order.transactionId}
                                                            </div>
                                                            <div className="order-tracking">
                                                                <span className='text-secondary fw-normal'>Tracking number:</span><div
                                                                    className="float-end fw-semibold text-decoration-underline"
                                                                    style={{ cursor: "pointer", position: "relative" }}
                                                                    onClick={(e) => copyTrackingNumber(trackingNumber, e)}
                                                                >
                                                                    {trackingNumber}
                                                                </div>
                                                            </div>
                                                            <div className="order-quantity fw-semibold">
                                                                <span className='text-secondary fw-normal'>Quantity:</span>{order.quantity}
                                                            </div>
                                                            <div className="order-amount fw-semibold">
                                                                <span className='text-secondary fw-normal'>Total Amount:</span>${order.amount}
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="order-details">
                                                                    {/* {(orderStatus === 'Delivered' || orderStatus === 'Canceled') && ( */}
                                                                    <button onClick={() => handleDetailBox(order)}>Details</button>
                                                                    {/* )} */}
                                                                    {/* {orderStatus === 'Processing' && (
                                                                        <button onClick={handleRefund}>Refund / Return</button>
                                                                    )} */}
                                                                </div>
                                                                <div className='order-status mt-3'>
                                                                    <div className={`text-success fw-semibold text-white 
                                                            ${order.status === 'delivered' ? 'badge bg-success' : order.status === 'processing' ? 'badge bg-secondary' : 'badge bg-danger'}`}><small className='fw-bold'>{order.status}</small></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="pills-delivered" role="tabpanel" aria-labelledby="pills-delivered-tab" tabindex="0">
                                        <div className="delivered-orders">
                                            <div className="row">
                                                {orders.filter(order => order.status === 'delivered').map((order) => (
                                                    <div className="col-12 col-lg-6 col-xl-4 mt-4 px-0 px-md-2">
                                                        <div className="delivered-order-container">
                                                            <div className="fw-semibold order-number">
                                                                {order.transactionId}
                                                            </div>
                                                            <div className="order-tracking">
                                                                <span className='text-secondary fw-normal'>Tracking number:</span><div
                                                                    className="float-end fw-semibold text-decoration-underline"
                                                                    style={{ cursor: "pointer", position: "relative" }}
                                                                    onClick={(e) => copyTrackingNumber(trackingNumber, e)}>
                                                                    {trackingNumber}
                                                                </div>
                                                            </div>
                                                            <div className="order-quantity fw-semibold">
                                                                <span className='text-secondary fw-normal'>Quantity:</span>{order.quantity}
                                                            </div>
                                                            <div className="order-amount fw-semibold">
                                                                <span className='text-secondary fw-normal'>Total Amount:</span>${order.amount}
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="order-details">
                                                                    {/* {(orderStatus === 'Delivered' || orderStatus === 'Canceled') && ( */}
                                                                    <button onClick={() => handleDetailBox(order)}>Details</button>
                                                                    {/* )} */}
                                                                    {/* {orderStatus === 'Processing' && (
                                                                        <button onClick={handleRefund}>Refund / Return</button>
                                                                    )} */}
                                                                </div>
                                                                <div className='order-status mt-3'>
                                                                    <div className={`text-success fw-semibold text-white badge bg-success`}><small className='fw-bold'>{order.status}</small></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="pills-processing" role="tabpanel" aria-labelledby="pills-processing-tab" tabindex="0">
                                        <div className="processing-orders">
                                            <div className="row">
                                                {orders.filter(order => order.status === 'processing').map((order) => (
                                                    <div className="col-12 col-lg-6 col-xl-4 mt-4 px-0 px-md-2">
                                                        <div className="processing-order-container">
                                                            <div className="fw-semibold order-number">
                                                                {order.transactionId}
                                                            </div>
                                                            <div className="order-tracking">
                                                                <span className='text-secondary fw-normal'>Tracking number:</span><div
                                                                    className="float-end fw-semibold text-decoration-underline"
                                                                    style={{ cursor: "pointer", position: "relative" }}
                                                                    onClick={(e) => copyTrackingNumber(trackingNumber, e)}>
                                                                    {trackingNumber}
                                                                </div>
                                                            </div>
                                                            <div className="order-quantity fw-semibold">
                                                                <span className='text-secondary fw-normal'>Quantity:</span>{order.quantity}
                                                            </div>
                                                            <div className="order-amount fw-semibold">
                                                                <span className='text-secondary fw-normal'>Total Amount:</span>${order.amount}
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="order-details">
                                                                    {/* {(orderStatus === 'Delivered' || orderStatus === 'Canceled') && ( */}
                                                                    <button onClick={() => handleDetailBox(order)}>Details</button>
                                                                    {/* )} */}
                                                                    {/* {orderStatus === 'Processing' && (
                                                                        <button onClick={handleRefund}>Refund / Return</button>
                                                                    )} */}
                                                                </div>
                                                                <div className='order-status mt-3'>
                                                                    <div className={`text-success fw-semibold text-white badge bg-secondary`}><small className='fw-bold'>{order.status}</small></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="pills-cancel" role="tabpanel" aria-labelledby="pills-cancel-tab" tabindex="0">
                                        <div className="canceled-orders">
                                            <div className="row">
                                                {orders.filter(order => order.status === 'canceled').map((order) => (
                                                    <div className="col-12 col-lg-6 col-xl-4 mt-4 px-0 px-md-2">
                                                        <div className="canceled-order-container">
                                                            <div className="fw-semibold order-number">
                                                                {order.transactionId}
                                                            </div>
                                                            <div className="order-tracking">
                                                                <span className='text-secondary fw-normal'>Tracking number:</span><div
                                                                    className="float-end fw-semibold text-decoration-underline"
                                                                    style={{ cursor: "pointer", position: "relative" }}
                                                                    onClick={(e) => copyTrackingNumber(trackingNumber, e)}>
                                                                    {trackingNumber}
                                                                </div>
                                                            </div>
                                                            <div className="order-quantity fw-semibold">
                                                                <span className='text-secondary fw-normal'>Quantity:</span>{order.quantity}
                                                            </div>
                                                            <div className="order-amount fw-semibold">
                                                                <span className='text-secondary fw-normal'>Total Amount:</span>${order.amount}
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="order-details">
                                                                    {/* {(orderStatus === 'Delivered' || orderStatus === 'Canceled') && ( */}
                                                                    <button onClick={() => handleDetailBox(order)}>Details</button>
                                                                    {/* )} */}
                                                                    {/* {orderStatus === 'Processing' && (
                                                                        <button onClick={handleRefund}>Refund / Return</button>
                                                                    )} */}
                                                                </div>
                                                                <div className='order-status mt-3'>
                                                                    <div className={`text-success fw-semibold text-white badge bg-danger`}><small className='fw-bold'>{order.status}</small></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default MyOrders;
