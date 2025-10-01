import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function ProfileSideBar() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const location = useLocation();

    const handleProfileSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen)
    }

    const token = localStorage.getItem('authToken')
    let role = null

    if (token) {
        try {
            const decoded = jwtDecode(token)
            role = decoded.role
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <button className='profile-side-bar-toggle' onClick={handleProfileSideBar} style={{
                left: isSideBarOpen ? 'calc(100% - 32px)' : '0px',
                borderRadius: isSideBarOpen ? '0px 0px 0px 10px' : '0px 15px 15px 0px',
                top: isSideBarOpen ? '0px' : '220px',
                backgroundColor: isSideBarOpen ? '' : '#591f27'
            }}>
                <i className={isSideBarOpen ? 'fa fa-angles-left' : 'fa fa-angles-right'}></i>
            </button>
            <div className="col-12 col-md-4 col-lg-3 col-xl-2 profile-side-bar-container" style={{ left: isSideBarOpen ? "0%" : "-100%" }}>
                <div className="profile-side-bar">
                    <h1 className='fw-bold px-4 mx-2'>Profile</h1>
                    <Link to='/profile/my-profile' className='text-decoration-none'>
                        <div className={`profile-tab ${location.pathname === '/profile/my-profile' ? 'active' : ''}`}>
                            <i className='fa fa-user mx-1'></i> My Profile
                        </div>
                    </Link>

                    <Link to='/profile/my-orders' className='text-decoration-none'>
                        <div className={`profile-tab ${location.pathname === '/profile/my-orders' ? 'active' : ''}`}>
                            <i className='fa fa-shopping-basket mx-1'></i> My Orders
                        </div>
                    </Link>

                    <Link to='/profile/wishlist' className='text-decoration-none'>
                        <div className={`profile-tab ${location.pathname === '/profile/wishlist' ? 'active' : ''}`}>
                            <i className='fa fa-heart mx-1'></i> Wishlist
                        </div>
                    </Link>

                    <Link to='/profile/reviews' className='text-decoration-none'>
                        <div className={`profile-tab ${location.pathname === '/profile/reviews' ? 'active' : ''}`}>
                            <i className='fa fa-star mx-1'></i> Reviews
                        </div>
                    </Link>

                    <Link to='/profile/coupons' className='text-decoration-none'>
                        <div className={`profile-tab ${location.pathname === '/profile/coupons' ? 'active' : ''}`}>
                            <i className='fa fa-ticket mx-1'></i> Coupons
                        </div>
                    </Link>

                    {(role === 'owner') && (
                        <Link to='/owner/dashboard' className='text-decoration-none'>
                            <div className={`profile-tab`}>
                                <i className='fa fa-crown mx-1'></i> Owner Dashboard
                            </div>
                        </Link>
                    )}

                    {(role === 'admin') && (
                        <Link to='/admin/dashboard' className='text-decoration-none'>
                            <div className={`profile-tab`}>
                                <i className='fa fa-shield-halved mx-1'></i> Admin Dashboard
                            </div>
                        </Link>
                    )}

                </div>
            </div>
        </>
    )
}
