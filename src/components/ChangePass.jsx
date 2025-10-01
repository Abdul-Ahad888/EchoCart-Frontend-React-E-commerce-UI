import React, { useState, useEffect } from 'react';
import logo from '../assets/logotitle.png'
import changePassPic from '../assets/changepass.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function ChangePass() {

    const navigate = useNavigate()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [emptyError, setEmptyError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [currentPasswordError, setCurrentPasswordError] = useState(false)
    const [samePasswordError, setSamePasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [showModal, setShowModal] = useState(false)

    const [passwordView, setPasswordView] = useState('password')
    const [passwordIcon, setPasswordIcon] = useState('fa fa-eye-slash')
    const [passwordIconColor, setPasswordIconColor] = useState('#cfcfcf')

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


    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChangePass = async (e) => {
        e.preventDefault()

        setEmptyError(false);
        setPasswordError(false);
        setCurrentPasswordError(false);
        setConfirmPasswordError(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setEmptyError(true)
        }

        if (!passwordPattern.test(newPassword)) {
            setPasswordError(true)
            return
        } else {
            setPasswordError(false)
        }

        if (currentPassword === confirmPassword) {
            setSamePasswordError(true)
            return
        } else {
            setSamePasswordError(false)
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError(true)
            return
        } else {
            setConfirmPasswordError(false)
        }


        try {
            const token = localStorage.getItem('authToken')
            const res = await axios.post('https://echo-cart-back-end.vercel.app/api/v1/user/change-password',
                { currentPassword, newPassword },
                { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } })

            setShowModal(true)
        }

        catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                const message = err.response.data.msg;
                if (message === 'current password is incorrect') {
                    setCurrentPasswordError(true);
                    return
                } else {
                    alert(`${message}`);
                }
                console.error("Error while changing password:", err);
                alert("Something went wrong. Please try again later.");
            }
        }
    }

    // Modal To Navigate To The Home Page
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                navigate('/')
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showModal]);


    return (
        <div className='container'>
            <div className="row justify-content-center align-content-center vh-100">

                {showModal && (
                    <>
                        <div className="modal show d-block" style={{ backgroundColor: "#000000bb" }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="change-password-modal text-center">
                                    <img src={changePassPic} alt="" />
                                    <div className="modal-body">
                                        <h2 className="modal-title">Password Updated!</h2>
                                        <p>Your password has been changed successfully.</p>
                                    </div>
                                    <div className="modal-footer justify-content-between">
                                        <p>You will be redirected to the home page shortly.</p>
                                        <div className="spinner-border" style={{ color: "#de7127" }} role="status">
                                            <span className="visually-hidden">Redirecting...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className='acc-logo mx-2'>
                    <Link to='/'>
                        <img src={logo} className='img-fluid' alt="" />
                    </Link>
                </div>

                <div className="change-password-box">
                    <h1 className='display-5 text-center' style={{ color: "#de7127" }}>Change Password</h1>
                    <form action="" onSubmit={handleChangePass}>

                        <div className='input-group mt-4'>
                            <input type="text" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        {currentPasswordError && (
                            <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Incorrect Password!</small>
                        )}

                        <div className='input-group mt-4'>
                            <input type={passwordView} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <span className="acc-input-icon password-eye-icon" onClick={handlePasswordView}><i style={{ color: passwordIconColor }} className={passwordIcon}></i></span>
                        </div>
                        {passwordError && (
                            <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Password must be at least 8 characters long, include a lowercase letter, an uppercase letter, a digit, and a special character.</small>
                        )}
                        {samePasswordError && (
                            <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : New password should be diffrent from previous password.</small>
                        )}

                        <div className='input-group mt-4'>
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <span className="acc-input-icon"><i className='fa fa-lock'></i></span>
                        </div>
                        {confirmPasswordError && (
                            <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Password is not same.</small>
                        )}

                        {emptyError && (
                            <div className="">
                                <small className='text-danger mx-2'>
                                    <i className='fa fa-exclamation-circle'></i> Error: Please provide complete credentials.
                                </small>
                            </div>
                        )}

                        <button type='submit' className='btn-login w-100 mt-4'>Change Password</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
