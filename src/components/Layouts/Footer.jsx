import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logotitle.png'
import hbl from '../../assets/hbl.png'
import jazzcash from '../../assets/jazzcash.png'
import mastercard from '../../assets/MasterCard.png'
import payoneer from '../../assets/payoneer.png'
import visa from '../../assets/Visa.png'
import nationalbank from '../../assets/nationalbank.png'

export default function Footer() {
  return (
    <div>

      {/* Top Footer */}
      <div className="top-footer">
        <div className="container">
          <div className="d-inline-block">
            <h6 className='text-white mt-2'>Get Connected With Us On Social Media.</h6>
          </div>
          <div className="d-inline-block float-lg-end footer-icon">
            <i style={{ padding: "8px 12px" }} className='me-2 mt-2 mt-lg-0 fs-5 border border-2 rounded rounded-circle text-white fa fa-facebook'></i>
            <i style={{ padding: "8px 10px" }} className='me-2 mt-2 mt-lg-0 fs-5 border border-2 rounded rounded-circle text-white fa fa-instagram'></i>
            <i style={{ padding: "8px 8px" }} className='me-2 mt-2 mt-lg-0 fs-5 border border-2 rounded rounded-circle text-white fa fa-twitter'></i>
            <i style={{ padding: "8px 10px" }} className='me-2 mt-2 mt-lg-0 fs-5 border border-2 rounded rounded-circle text-white fa fa-linkedin'></i>
            <i style={{ padding: "8px 10px" }} className='me-2 mt-2 mt-lg-0 fs-5 border border-2 rounded rounded-circle text-white fa fa-whatsapp'></i>
            <i style={{ padding: "8px 10px" }} className='me-2 mt-2 mt-lg-0 fs-5 border border-2 rounded rounded-circle text-white fa fa-github'></i>
          </div>
        </div>
      </div>

      {/* Middle Footer */}
      <div className="middle-footer">
        <div className="container">
          <div className="row">

            <div className="col-12 col-lg-4 mt-4">
              <img style={{ width: "160px" }} src={logo} alt="" />
              <p className='text-white mt-2'>EchoCart Is An Ecommerce Website Providing You Products More Then Your Needs. What Are You Waiting For Its Simple Select Your Product Click Add To Cart And Proceed To Payment, Thats It.</p>
            </div>

            <div className="col-12 col-lg-2 mt-4">
              <h5 style={{ color: "#fff" }}><span style={{ borderBottom: "2px solid #de7127" }} className='py-2'>Usefull</span> Links</h5>
              <ul className='list-unstyled'>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-4 pt-3 text-white'>About Us</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>Digital Payments</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>Terms & Conditions</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>Privacy Policy</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>Online Shopping App</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>EchoCart Blog</li></Link>
              </ul>
            </div>

            <div className="col-12 col-lg-2 mt-4">
              <h5 style={{ color: "#fff" }}><span style={{ borderBottom: "2px solid #de7127" }} className='py-2'>Customer</span> Care</h5>
              <ul className='list-unstyled'>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-4 pt-3 text-white'>Help Center</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>Returns & Refunds</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>Contact Us</li></Link>
                <Link to='/' className='text-decoration-none'><li style={{ fontSize: "14px" }} className='mt-3 text-white'>EchoCart Shop</li></Link>
              </ul>
            </div>

            <div className="col-12 col-lg-2 mt-4">
              <h5 style={{ color: "#fff" }}><span style={{ borderBottom: "2px solid #de7127" }} className='py-2'>Head</span> Quater</h5>
              <p className='text-white mt-4 pt-3' style={{ fontSize: "14px" }}>EchoCart Private limited. <br /> Sector 5, Street 28, Plot 42, Branch 1,Sindh, Karachi, Pakistan</p>
            </div>

            <div className="col-12 col-lg-2 mt-4">
              <h5 style={{ color: "#fff" }}><span style={{ borderBottom: "2px solid #de7127" }} className='py-2'>Conta</span>ct Us</h5>
              <div className="mt-4 pt-3">
                <div>
                  <small className='text-white'>main branch: </small>
                  <a href="/" className='text-white' style={{ fontSize: "14px" }}>Shop # 12, Sindh, Karachi, Pakistan</a>
                </div>
                <div className='mt-3'>
                  <small className='text-white'>mail: </small>
                  <a href="/" className='text-white' style={{ fontSize: "14px" }}>shopechocart@gmail.com</a>
                </div>
                <div className='mt-3'>
                  <small className='text-white'>Ph #: </small>
                  <a href="/" className='text-white' style={{ fontSize: "14px" }}>111 222 111 444</a>
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12 col-lg-4 mt-4">
                <h5 style={{ color: "#fff" }}><span style={{ borderBottom: "2px solid #de7127" }} className='py-2'>Payment</span> Methods</h5>
                <div className="mt-3">
                  <img src={hbl} className='me-3 mt-3' style={{ width: "60px" }} alt="" />
                  <img src={jazzcash} className='me-3 mt-3' style={{ width: "50px" }} alt="" />
                  <img src={visa} className='me-3 mt-3' style={{ width: "50px" }} alt="" />
                  <img src={mastercard} className='me-3 mt-3' style={{ width: "50px" }} alt="" />
                  <img src={payoneer} className='me-3 mt-3' style={{ width: "60px" }} alt="" />
                  <img src={nationalbank} className='me-3 mt-3' style={{ width: "50px" }} alt="" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bottom-footer">
        <div className="container">
          <div className="text-end">
            <p className='text-white mt-3'>&copy; 2024 All Rights Are Reserved By <span className='fw-bold py-1' style={{ color: "#de7127", borderBottom: "2px solid #311115" }}>ECHOCART</span></p>
          </div>
        </div>
      </div>

    </div>
  )
}
