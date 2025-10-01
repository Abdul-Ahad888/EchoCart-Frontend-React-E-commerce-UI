import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/logotitle.png";
import "../../style.css"
import { SearchContext } from '../../App';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

export default function Header({ toggleCart }) {

    const { setSearchQuery } = useContext(SearchContext)
    const { cartItems } = useContext(CartContext)

    const [localQuery, setLocalQuery] = useState('')
    const [username, setUsername] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [authStatus, setAuthStatus] = useState("loading"); // "loading", "authenticated", "unauthenticated"
    const [serverError, setServerError] = useState(false)
    const [animateCart, setAnimateCart] = useState(false)

    const navigate = useNavigate()


    // Search Bar
    const handleSearch = (e) => {
        e.preventDefault()
        setSearchQuery(localQuery)
        navigate('/search')
        setLocalQuery('')
    }


    useEffect(() => {
        if (cartItems.length > 0) {
            setAnimateCart(false);
            const trigger = setTimeout(() => {
                setAnimateCart(true);
            }, 10);

            const reset = setTimeout(() => {
                setAnimateCart(false);
            }, 400)

            return () => {
                clearTimeout(trigger);
                clearTimeout(reset);
            };
        }
    }, [cartItems.length]);


    // Token Validation
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('authToken')
            if (token) {
                try {
                    await axios.get("https://echo-cart-back-end.vercel.app/api/v1/user/protected", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                    const userDetails = await axios.get('https://echo-cart-back-end.vercel.app/api/v1/user/userDetails', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                    setProfileImage(userDetails.data.user.profileImage)
                    setUsername(userDetails.data.user.username)
                    setAuthStatus("authenticated")

                } catch (err) {
                    console.error("Token validation error:", err);
                    setServerError(true)

                    if (err.response?.status === 401 || err.response?.status === 403) {
                        localStorage.removeItem('authToken');
                        setAuthStatus("unauthenticated");
                    } else {
                        setAuthStatus("loading");
                    }
                }

            } else {
                setAuthStatus("unauthenticated")
            }
        }
        verifyUser()
    }, [])

    // Server Error Close
    const handleErrorClose = () => {
        setServerError(false)
    }

    // LogOut Button
    const HandleLogout = () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    }

    return (
        <>

            {/* Error Toast */}
            {serverError && (
                <div className='toast position-absolute z-3 bottom-0 end-0 px-2 m-4 d-block'>
                    <div class="toast-header">
                        <strong class="me-auto"><i className='fa fa-circle-exclamation text-danger'></i> Error</strong>
                        <button onClick={handleErrorClose} type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Oops! Something went wrong on our end. Please try reloading the page.
                    </div>
                </div>
            )}


            <nav className="navbar navbar-expand-lg d-none d-lg-block">
                <div className="container">
                    <div className="row w-100 align-items-center">

                        {/* Column 1: Logo */}
                        <div className="col-md-2 text-start">
                            <Link className="navbar-brand text-decoration-none" to='/'>
                                <img style={{ width: "120px" }} src={logo} alt="Echo Cart Logo" />
                            </Link>
                        </div>

                        {/* Column 2: Search Bar */}
                        <div className="col-md-8">
                            <form className="d-flex justify-content-center bg-transparent" onSubmit={handleSearch} role="search">
                                <div className="search-wrapper" style={{ position: 'relative', width: '100%' }}>
                                    <input className="header-search-bar w-100" type="search" placeholder="Search For Cart..." aria-label="Search" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
                                    <span className="animated-border"></span>
                                </div>
                            </form>
                        </div>

                        {/* Column 3: Account/Home Links */}
                        <div className="col-md-2 text-end">
                            <ul className="navbar-nav d-inline-flex mb-0">
                                {/* Account Dropdown */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link d-flex align-items-center dropdown-toggle" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {authStatus === "unauthenticated" && (
                                            <i style={{ color: "#591f27" }} className="fa fa-circle-user fs-2 me-2"></i>
                                        )}
                                        {authStatus === "authenticated" && (
                                            <img src={profileImage} className='me-2' style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "cover" }}
                                                alt="" />
                                        )}
                                        <div className="d-flex text-start flex-column">
                                            <small className="text-muted small">Account,</small>
                                            {authStatus === "authenticated" && (
                                                <small className="fw-bold me-auto profile-name-truncate text-uppercase">Hi, {username}</small>
                                            )}

                                            {authStatus === "unauthenticated" && (
                                                <small className="fw-bold me-auto">LogIn</small>
                                            )}

                                        </div>
                                    </a>

                                    {/* When User Is Signed In */}
                                    {authStatus === "authenticated" && (
                                        <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                                            <Link to='/profile/my-profile'><li><a className="dropdown-item"><i className='fa fa-user'></i>Profile</a></li></Link>
                                            {/* <Link to='/settings'><li><a className="dropdown-item"><i className='fa fa-gear'></i>Settings</a></li></Link> */}
                                            <li onClick={HandleLogout} style={{ cursor: "pointer" }}><a className="dropdown-item"><i className='fa fa-right-from-bracket'></i>Log Out</a></li>
                                        </ul>
                                    )}

                                    {/* When User Is Signed Out */}
                                    {authStatus === "unauthenticated" && (
                                        <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                                            <Link to='/signUp'><li><a className="dropdown-item"><i className='fa fa-user-plus'></i>SignUp</a></li></Link>
                                            <Link to='/login'><li><a className="dropdown-item"><i className='fa fa-right-to-bracket'></i>LogIn</a></li></Link>
                                        </ul>
                                    )}
                                </li>

                                {/* Cart Icon */}
                                <li className="nav-item ms-4" onClick={toggleCart}>
                                    <a className="nav-link text-dark d-flex align-items-center" href="#">
                                        <i
                                            style={{ color: "#000" }}
                                            className="fa fa-cart-shopping fs-2 mt-2 position-relative"
                                        >
                                            <p
                                                className={`position-absolute text-white rounded rounded-pill`}
                                                style={{ top: "-8px", right: "-8px", fontSize: "12px", padding: "5px 6px 5px 5px", backgroundColor: "#591f27" }}
                                            >
                                                <p className={`${animateCart ? 'cart-badge-animate' : ''} p-0 m-0 fw-bold`}>
                                                    {cartItems.length}
                                                </p>
                                            </p>
                                        </i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* For Responsive */}
            <div className='d-block d-lg-none'>
                <form className="d-flex justify-content-center bg-transparent header-search-bar" role="search" onSubmit={handleSearch}>
                    <input className="header-search-bar w-100 rounded rounded-2" style={{ border: "1px solid #591f27" }} type="search" placeholder="Search For Cart..." aria-label="Search" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
                </form>
            </div>

            <nav className='d-block d-lg-none nav-bottom-bg'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4">
                            {authStatus === "authenticated" && (
                                <Link to='/profile/my-profile' className='text-black nav-bot-res text-decoration-none'>
                                    <div className='text-center'>
                                        <img src={profileImage} className='me-2' style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                                            alt="" />
                                    </div>
                                </Link>
                            )}
                            {authStatus === "unauthenticated" && (
                                <Link to='/login' className='text-black nav-bot-res text-decoration-none'>
                                    <div className='text-center'>
                                        <i className='fa fa-user fs-2'></i>
                                    </div>
                                </Link>
                            )}
                        </div>
                        <div className="col-4">
                            <Link to="/" className='text-black nav-bot-res text-decoration-none'>
                                <div className='home text-center'>
                                    <i className='fa fa-house fs-2'></i>
                                </div>
                            </Link>
                        </div>
                        {/* <div className="col-3">
                            <Link to='categories' className='text-black text-decoration-none'>
                                <div className='text-center'>
                                    <i className='fa fa-bars'></i>
                                    <small className='d-block'>Categories</small>
                                </div>
                            </Link>
                        </div> */}
                        <div className="col-4">
                            <div to='cart' className='text-black nav-bot-res text-decoration-none' onClick={toggleCart}>
                                <div className='text-center'>
                                    <i className="fa fa-cart-shopping position-relative fs-2">
                                        <p className={`position-absolute text-white rounded rounded-pill ${animateCart ? "cart-badge-animate" : ""}`} style={{ backgroundColor: "#591f27", top: "-10px", right: "-10px", fontSize: "11px", padding: "4px" }}>{cartItems.length}</p>
                                    </i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

        </>
    );
}
