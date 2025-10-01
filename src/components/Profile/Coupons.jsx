import React, { useState } from 'react';
import ProfileSideBar from './ProfileSideBar';
import { Link } from 'react-router-dom';

export default function Coupons() {
  const [coupons, setCoupons] = useState([
    {
      valid: "JAN 2028",
      discount: "30",
      code: "SAVE30",
      bgColor: "#CA192E",
      flipColor: "#a51526",
      textShadow: "-1px -1px 0 #CA192E, 1px -1px 0 #CA192E, -3px  3px 0 #CA192E, 3px  3px 0 #CA192E",
      flipped: false
    },
    {
      valid: "JULY 2029",
      discount: "32",
      code: "ECHO-CART",
      bgColor: "#FEB900",
      flipColor: "rgb(245, 175, 0)",
      textShadow: "-1px -1px 0 #FEB900, 1px -1px 0 #FEB900, -3px  3px 0 #FEB900, 3px  3px 0 #FEB900",
      flipped: false
    },
    {
      valid: "JULY 2029",
      discount: "14",
      code: "EC-14",
      bgColor: "#05858E",
      flipColor: "rgb(4, 108, 116)",
      textShadow: "-1px -1px 0 #05858E, 1px -1px 0 #05858E, -3px  3px 0 #05858E, 3px  3px 0 #05858E",
      flipped: false
    }
  ]);

  const handleFlip = (index) => {
    setCoupons((prevCoupons) =>
      prevCoupons.map((coupon, i) =>
        i === index ? { ...coupon, flipped: !coupon.flipped } : coupon
      )
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <ProfileSideBar />
          <div className="col-12 col-md-8 col-lg-9 col-xl-10">
            <div className='profile-head'>
              <h2><Link to='/'>Home</Link> <i className='fa fa-chevron-right fs-5 mx-3'></i> <span className='text-muted'>Coupons / Promo Codes</span></h2>
            </div>
            <div className="row">
              {coupons.map((coupon, index) => (
                <div key={index} className="col-12 col-xxl-8">
                  <div className="coupon-container">
                    <div className="row">
                      <div className="col-4 col-sm-4 col-md-4 col-lg-3 g-0">
                        <div className="coupon-discount">
                          <div className='coupon-discount-text'>
                            <small>SHOPPING COUPON</small>
                            <h1 className='display-1' style={{textShadow: `${coupon.textShadow}`}}>{coupon.discount} %</h1>
                          </div>
                        </div>
                      </div>
                      <div className="col-8 col-sm-8 col-md-8 col-lg-9 g-0">
                        <div className={`coupon ${coupon.flipped ? 'flipped' : ''}`} style={{backgroundColor : `${coupon.bgColor}`}}>
                          <div className="coupon-front">
                            <small className="fw-semibold">ECHOCART.COM</small>
                            <h1 className="display-1">COUPON</h1>
                            <h6>VALID UNTIL <span className="fw-semibold">{coupon.valid}</span></h6>
                            <button onClick={() => handleFlip(index)} style={{backgroundColor : `${coupon.bgColor}`}}>Get Discount</button>
                          </div>
                          <div className="coupon-back" style={{backgroundColor : `${coupon.flipColor}`}}>
                            <h3>COUPON CODE</h3>
                            <h2 className="code">{coupon.code}</h2>
                            <p>Use this code at checkout</p>
                            <button onClick={() => handleFlip(index)} style={{backgroundColor : `${coupon.flipColor}`}}>Go Back</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
