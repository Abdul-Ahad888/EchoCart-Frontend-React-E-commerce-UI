import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './context/CartContext';

export default function Login() {

  const navigate = useNavigate()
  
  const {loadCart} = useContext(CartContext)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [emptyError, setEmptyError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const [passwordView, setPasswordView] = useState('password')
  const [passwordIcon, setPasswordIcon] = useState('fa fa-eye-slash')
  const [passwordIconColor, setPasswordIconColor] = useState('#cfcfcf')

  const [sideBarIcon, setSideBarIcon] = useState('fa fa-angles-down');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loader, setLoader] = useState(false)

    const handleSideBar = () => {
    if (sideBarIcon === 'fa fa-angles-down') {
      setSideBarIcon('fa fa-angles-up')
    }
    else {
      setSideBarIcon('fa fa-angles-down')
    }
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handlePasswordView = () => {
    // Password View
    if (passwordView === 'password') {
      setPasswordView('text')
    } else {
      setPasswordView('password')
    }
    // Password Icon
    if (passwordIcon === 'fa fa-eye-slash') {
      setPasswordIcon('fa fa-eye')
    } else {
      setPasswordIcon('fa fa-eye-slash')
    }
    // Password Icon Color
    if (passwordIconColor === '#cfcfcf') {
      setPasswordIconColor('#de7127')
    } else {
      setPasswordIconColor('#cfcfcf')
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()

    setEmptyError(false)
    setEmailError(false)
    setPasswordError(false)

    if (!loginEmail || !loginPassword) {
      setEmptyError(true)
    }

    try {

      const res = await axios.post('https://echo-cart-back-end.vercel.app/api/v1/user/login', {
        email: loginEmail,
        password: loginPassword
      })

      if (res.data.data.token) {
        localStorage.setItem('authToken', res.data.data.token)
      }


      console.log("User Logged In Successfully")
      setLoader(true)
      loadCart()

      setTimeout(() => {
        navigate('/')
        setLoader(false)
      }, 2000);
    }

    catch (err) {
      console.log(err.response ? err.response.data.msg : 'An error occurred while logging in');

      if (err.response && err.response.data && err.response.data.msg === "Email Not Found") {
        setEmailError(true)
        return
      }
      else {
        setEmailError(false)
      }

      if (err.response && err.response.data && err.response.data.msg === "Incorrect Password") {
        setPasswordError(true)
        return
      }
      else {
        setPasswordError(false)
      }
    }
  }

  return (
    <div className="container-fluid">

      {loader && (
        <div className="modal show d-block" style={{ backgroundColor: "#000000bb" }} tabIndex="-1" role="dialog">
          <div className="spinner-border position-absolute start-50 z-3 border-5 top-50" style={{ color: "#de7127", height: "120px", width: "120px", translate: "-50% -50%" }} role="status">
            <span className="visually-hidden">Redirecting...</span>
          </div>
        </div>
      )}

      <button className='create-acc-side-bar-button d-block d-xl-none' onClick={handleSideBar}><i className={sideBarIcon}></i></button>
      <div className="row">
        <div className="col-12 col-xl-4 g-0">
          <div className='create-acc-side-bar-container' style={{ top: isSidebarOpen ? '0%' : '-100%' }}>
            <div className='create-acc-side-bar-container-text'>
              <h1 className='my-2'>Don't Have An Account? <br /> Create One Now</h1>
              <p className='my-3'>Join us today and be a part of our growing community.</p>
              <Link to='/signup'>
                <button className='btn-theme-outline w-100 text-white mt-2'>Create Account</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-8">
          <div className="login-container">
            <div className='acc-logo'>
              <Link to='/'>
                <img src={logo} className='img-fluid' alt="" />
              </Link>
            </div>
            <div className="login-box">
              <h1 className='display-5 text-center'>Sign In</h1>
              <form onSubmit={handleSignIn}>
                <div className='input-group mt-4'>
                  <input type="text" placeholder="Enter your email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  <span className="acc-input-icon"><i className='fa fa-envelope'></i></span>
                </div>
                {emailError && (
                  <small className='text-danger mx-2 mt-2'>
                    <i className='fa fa-exclamation-circle'></i> Error: Email Not Found.
                  </small>
                )}

                <div className='input-group mt-4'>
                  <input type={passwordView} placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  <span className="acc-input-icon password-eye-icon" onClick={handlePasswordView}><i style={{ color: passwordIconColor }} className={passwordIcon}></i></span>
                </div>
                {passwordError && (
                  <small className='text-danger mx-2 mt-2'>
                    <i className='fa fa-exclamation-circle'></i> Error: Incorrect Password!
                  </small>
                )}

                <div className="text-end">
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>

                {emptyError && (
                  <div className="mb-2">
                    <small className='text-danger mx-2 mt-2'>
                      <i className='fa fa-exclamation-circle'></i> Error: Please provide complete credentials.
                    </small>
                  </div>
                )}

                <button className='btn-login w-100'>Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
