import React, { useEffect, useState } from "react";
import logo from "../../assets/logotitle.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {

    const [profileImage, setProfileImage] = useState('')
    const [username, setUsername] = useState('')
    const [productsOpen, setProductsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const token = localStorage.getItem('authToken')

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const details = () => {
            fetch('https://echo-cart-back-end.vercel.app/api/v1/user/protected', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetch('https://echo-cart-back-end.vercel.app/api/v1/user/userDetails', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        console.log('Network Responce Is Not Ok')
                    }
                    return res.json()
                })
                .then((data) => {
                    setProfileImage(data.user.profileImage)
                    setUsername(data.user.username)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        details()
    }, [])


    // Logout
    const HandleLogout = () => {
        localStorage.removeItem('authToken')
        navigate('/')
        window.location.reload()
    }


    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleProducts = () => setProductsOpen(!productsOpen);



    return (
        <div className="dashboard-layout">

            {/* Sidebar */}

            <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <Link to='/' className="mx-auto">
                    <img style={{ width: collapsed ? "70px" : "100px", transition: "0.3s" }} src={logo} alt="ECHO CART" />
                </Link>

                <button className="admin-sidebar-toggle-resp" onClick={toggleSidebar}>
                    <i className='fa fa-angle-double-left'></i>
                </button>

                <ul className="menu">
                    <li className={`${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                        <Link to={'dashboard'}>
                            <i className="fa fa-tachometer"></i>
                            {!collapsed && <span>Dashboard</span>}
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/admin/users' ? 'active' : ''}`}>
                        <Link to={'users'}>
                            <i className="fa fa-users"></i>
                            {!collapsed && <span>Users</span>}
                        </Link>
                    </li>

                    {/* Products Main Tab */}
                    <li className={`${location.pathname.startsWith("/admin/products") ? "active" : ""}`}>
                        <div className="d-flex align-items-center justify-between" style={{ cursor: "pointer" }} onClick={toggleProducts}>
                            <Link to="/admin/products" className="d-flex align-items-center ">
                                <i className="fa fa-box"></i>
                                {!collapsed && <span>Products</span>}
                                {!collapsed && (
                                    <i className={`fa fa-angle-${productsOpen ? "up" : "down"} dropdown-arrow`}></i>
                                )}
                            </Link>
                        </div>
                    </li>

                    {/* Products Submenu */}
                    {!collapsed && productsOpen && (
                        <ul className="submenu">
                            <li className={`${location.pathname === "/admin/products/create-product" ? "active" : ""}`}>
                                <Link to="/admin/products/create-product">
                                    <i className="fa fa-chevron-right"></i>
                                    <span>Create Product</span>
                                </Link>
                            </li>
                        </ul>
                    )}

                    {/* <li className={``}>
                        <Link to={'setting'}>
                            <i className="fa fa-cog"></i>
                            {!collapsed && <span>Settings</span>}
                        </Link>
                    </li> */}
                </ul>

                <ul className="menu bottom">
                    <li onClick={HandleLogout}>
                        <i className="fa fa-power-off"></i>
                        {!collapsed && <span className="ms-2">Logout</span>}
                    </li>
                </ul>
            </div>

            <div className="main-area">
                {/* Navbar */}
                <div className="admin-navbar">
                    <div className="admin-dash-head">
                        <button className="border-0 bg-transparent toggle-btn mx-0 px-0" onClick={toggleSidebar}>
                            <i className={`fa ${collapsed ? "fa-angle-double-left" : "fa-bars"} icon-toggle`}></i>
                        </button>
                        <h2 className="font-bold d-inline-block ms-2 ms-sm-4">Admin DashBoard</h2>
                    </div>
                    <div>
                        <ul>
                            <li className="nav-item dropdown list-unstyled text-secondary" style={{ position: 'relative', top: "5px", right: "10px" }}>
                                <a className="nav-link d-flex align-items-center dropdown-toggle" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={profileImage} className='me-2' style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "cover" }}
                                        alt="" />
                                    <div className="d-flex text-start flex-column">
                                        <small className="text-secondary small">Account,</small>
                                        <small className="fw-bold me-auto profile-name-truncate text-uppercase" style={{ color: "#000" }}>Hi, {username}</small>
                                    </div>
                                </a>


                                <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                                    <Link to='/profile/my-profile'><li><a className="dropdown-item"><i className='fa fa-user'></i>Profile</a></li></Link>
                                    <li onClick={HandleLogout} style={{ cursor: "pointer" }}><a className="dropdown-item"><i className='fa fa-right-from-bracket'></i>Log Out</a></li>
                                </ul>

                            </li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <Outlet />
                </div>

            </div>
        </div >
    );
}
