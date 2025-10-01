import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import { getNames, getCode } from 'country-list'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const countryOptions = getNames().map(name => ({
    value: getCode(name),
    label: name
}))

export default function Signup() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('') //name
    const [dob, setDob] = useState(''); // date of birth
    const [selectGender, setSelectGender] = useState('') // gender
    const [email, setEmail] = useState('') //email
    const [password, setPassword] = useState('') //password
    const [confirmPassword, setConfirmPassword] = useState('')
    const [selectCountry, setSelectCountry] = useState('') // country code
    const [age, setAge] = useState('') //age in numeric
    const [phoneNum, setPhoneNum] = useState('') // phone num
    const [year, setYear] = useState('')
    const [maxYear, setMaxYear] = useState('')
    const [isValid, setIsValid] = useState(false);

    const [createdUsername, setCreatedUsername] = useState('')

    const [emptyError, setEmptyError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [emailExistError, setEmailExistError] = useState(false)
    const [dobError, setDobError] = useState(false)
    const [genderError, setGenderError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [sideBarIcon, setSideBarIcon] = useState('fa fa-angles-down');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false)

    const getMaxDay = (month, year) => {
        return new Date(year, month, 0).getDate(); // Get last day of month
    };

    const handleSideBar = () => {
        if (sideBarIcon === 'fa fa-angles-down') {
            setSideBarIcon('fa fa-angles-up')
        }
        else {
            setSideBarIcon('fa fa-angles-down')
        }
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        const today = new Date();
        const maxYearValue = today.getFullYear();
        setMaxYear(maxYearValue)

        let day = value.slice(0, 2);
        let month = value.slice(2, 4);
        let yearValue = value.slice(4, 8);

        // **Auto-fix Single-Digit Day & Month**
        if (day.length === 1 && parseInt(day, 10) > 3) {
            day = `0${day}`;
        }
        if (month.length === 1 && parseInt(month, 10) > 1) {
            month = `0${month}`;
        }

        // Month Validation
        if (month.length === 2 && parseInt(month, 10) > 12) {
            month = "12";
        }

        // Day Validation (Based on Month & Year)
        if (day.length === 2 && parseInt(day, 10) > 31) day = "31";
        if (month.length === 2 && month !== "00") {
            const maxDay = getMaxDay(parseInt(month, 10), parseInt(yearValue, 10) || maxYearValue);
            if (parseInt(day, 10) > maxDay) day = maxDay.toString().padStart(2, "0");
        }

        // Year Validation
        if (yearValue.length === 4) {
            const yearNum = parseInt(yearValue, 10);
            if (yearNum > maxYearValue || yearNum < 1900) {
                yearValue = maxYearValue.toString(); // Default to maxYear if out of range
            }
            setYear(yearValue)

        }

        // **Assemble formatted value**
        value = day;
        if (month) value += "/" + month;
        if (yearValue) value += "/" + yearValue;

        setDob(value);

        // Validate the date when the user fills it completely
        if (day.length === 2 && month.length === 2 && yearValue.length === 4) {
            const fullDate = new Date(`${yearValue}-${month}-${day}`);
            if (
                fullDate.getDate() === parseInt(day, 10) &&
                fullDate.getMonth() + 1 === parseInt(month, 10) &&
                fullDate.getFullYear() === parseInt(yearValue, 10)
            ) {
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        } else {
            setIsValid(false);
        }
    };

    // Calculating Age
    useEffect(() => {
        const ageValue = maxYear - year
        setAge(ageValue)
    }, [year])


    // Select Gender
    const handleGenderSelect = (gender) => {
        setSelectGender(gender)
    }

    // SignUp Button
    const handleCreateAccount = async (e) => {
        e.preventDefault()

        setEmailExistError(false)
        setEmptyError(false)

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const usernamePattern = /^[a-zA-Z0-9]+$/;

        try {

            if (!email || !password || !username || !selectGender || !selectCountry || !dob) {
                setEmptyError(true)
            }

            if (username.length <= 4 || !usernamePattern.test(username)) {
                setUsernameError(true)
                return;
            } else {
                setUsernameError(false)
            }

            if (isValid === false) {
                setDobError(true)
                return;
            } else {
                setDobError(false)
            }

            if (selectGender === '') {
                setGenderError(true)
                return;
            } else {
                setGenderError(false)
            }

            if (!emailPattern.test(email)) {
                setEmailError(true)
                return;
            } else {
                setEmailError(false)
            }

            if (!passwordPattern.test(password)) {
                setPasswordError(true)
                return;
            } else {
                setPasswordError(false)
            }

            if (password !== confirmPassword) {
                setConfirmPasswordError(true)
                return;
            } else {
                setConfirmPasswordError(false)
            }

            const res = await axios.post('https://echo-cart-back-end.vercel.app/api/v1/user/register', {

                username,
                email,
                selectGender,
                dob,
                selectCountry,
                age,
                phoneNum,
                password

            })

            setCreatedUsername(username)
            setShowModal(true)

            console.log('Registered', res.data)

        }

        catch (err) {
            console.error('Registration failed', err.response?.data || err.message);

            if (err.response && err.response.data && err.response.data.msg === "Email already in use") {
                setEmailExistError(true);
                return
            } else {
                setEmailExistError(false);
            }

        }
    }

    // Modal To Navigate To The Login Page
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                navigate('/login')
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showModal]);


    return (
        <div>
            <div className="container-fluid">
                <button className='login-acc-side-bar-button d-block d-xl-none' onClick={handleSideBar}><i className={sideBarIcon}></i></button>
                <div className="row">

                    {showModal && (
                        <div className="modal show d-block" style={{ backgroundColor: "#000000bb" }} tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content text-center rounded-0 border border-3 border-white">
                                    <div className="modal-header rounded-0 border-0 justify-content-center" style={{ backgroundColor: "#de7127", padding: "50px 0px" }}>
                                        <i className='fa fa-check text-white border border-4 border-white fs-1 rounded rounded-circle' style={{ backgroundColor: "#de7127", padding: "18px 22px 18px 20px" }}></i>
                                    </div>
                                    <div className="modal-body py-5">
                                        <h4 className="modal-title">You Account Has Been Created!</h4>
                                        <div className='mt-5'>
                                            <p>Well done, <strong className='text-capitalize'>{createdUsername}</strong>!<br />
                                                Your account is ready — exciting things await you.</p>

                                        </div>
                                    </div>
                                    <div className="modal-footer justify-content-between">
                                        <p>You will be redirected to the login page shortly.</p>
                                        <div className="spinner-border" style={{ color: "#de7127" }} role="status">
                                            <span className="visually-hidden">Redirecting...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-12 col-xl-4 g-0">
                        <div className='login-acc-side-bar-container' style={{ top: isSidebarOpen ? '0%' : '-100%' }}>
                            <div className='login-acc-side-bar-container-text'>
                                <h1 className='my-2'>Welcome Back!</h1>
                                <p className='my-4'>To Keep Connected With Us Please Login With Your Own Profile, Click Down The Button Below To Access Login Page.</p>
                                <Link to='/login'>
                                    <button className='btn-theme-outline w-100 text-white mt-2'>Log In</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-8">
                        <div className="signup-container">
                            <div className='acc-logo'>
                                <Link to='/'>
                                    <img src={logo} className='img-fluid' alt="" />
                                </Link>
                            </div>
                            <div className="signup-box">
                                <h1 className='display-5 text-center'>Create Account</h1>
                                <form onSubmit={handleCreateAccount}>

                                    {/* Username */}
                                    <div className='input-group mt-4'>
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your user name" />
                                        <span className="acc-input-icon"><i className='fa fa-user'></i></span>
                                    </div>
                                    {usernameError && (
                                        <small className='text-danger mx-2 mt-2'>
                                            <i className='fa fa-exclamation-circle'></i> Error: Username must be alphanumeric and more than 4 characters.
                                        </small>
                                    )}

                                    {/* Date OF Birth */}
                                    <div className='input-group mt-4'>
                                        <input
                                            type="text"
                                            placeholder="DD/MM/YYYY"
                                            value={dob}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className="dob-input" />
                                        <span className="acc-input-icon"><i className='fa fa-calendar-days'></i></span>
                                    </div>
                                    {dobError && (
                                        <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Please enter your correct date of birth.</small>
                                    )}

                                    {/* Country List */}
                                    <div className='country-list mt-4'>
                                        <select value={selectCountry} onChange={(e) => setSelectCountry(e.target.value)} name="" id="" >
                                            <option value=''>Select Country</option>
                                            {countryOptions.map((country, index) => (
                                                <option key={index} value={country.value}> {country.label}</option>
                                            ))}
                                        </select>
                                        <i className='fa fa-chevron-down'></i>
                                    </div>

                                    {/* Phone No */}
                                    <div className='input-group mt-4'>
                                        <PhoneInput country={'pk'} value={phoneNum} onChange={(phone) => setPhoneNum(phone)}>
                                            <span className="acc-input-icon"><i className='fa fa-square-phone'></i></span>
                                        </PhoneInput>
                                        <span className="acc-input-icon"><i className='fa fa-square-phone'></i></span>
                                    </div>
                                    <small className='float-end text-secondary' style={{ fontSize: "10px" }}>Optional</small>

                                    {/* Gender */}
                                    <div className="gender mt-4">
                                        <div className="row">
                                            <div className="col-4">
                                                <div className={`gender-male ${selectGender === 'Male' ? 'selected' : ''}`} onClick={() => handleGenderSelect('Male')}>Male <i className='fa fa-mars'></i></div>
                                            </div>
                                            <div className="col-4">
                                                <div className={`gender-female ${selectGender === 'Female' ? 'selected' : ''}`} onClick={() => handleGenderSelect('Female')}>FeMale <i className='fa fa-venus'></i></div>
                                            </div>
                                            <div className="col-4">
                                                <div className={`gender-other ${selectGender === 'Other' ? 'selected' : ''}`} onClick={() => handleGenderSelect('Other')}>Other <i className='fa fa-venus-mars'></i></div>
                                            </div>
                                            {genderError && (
                                                <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Please select a gender.</small>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className='input-group mt-4'>
                                        <input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <span className="acc-input-icon"><i className='fa fa-envelope'></i></span>
                                    </div>
                                    {emailError && (
                                        <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Please enter a valid email address.</small>
                                    )}
                                    {emailExistError && (
                                        <small className='text-danger mx-2 mt-2'>
                                            <i className='fa fa-exclamation-circle'></i> Error: This email is already in use.
                                        </small>
                                    )}

                                    {/* Password */}
                                    <div className='input-group mt-4'>
                                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <span className="acc-input-icon"><i className='fa fa-lock'></i></span>
                                    </div>
                                    {passwordError && (
                                        <small className='text-danger mx-2 mt-2'> <i className='fa fa-exclamation-circle'></i> Error : Password must be at least 8 characters long, include a lowercase letter, an uppercase letter, a digit, and a special character.</small>
                                    )}

                                    {/* Confirm Password */}
                                    <div className='input-group mt-4'>
                                        <input type="password" placeholder="ReEnter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

                                    <button className='btn-signup mt-4 w-100'>Sign Up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
