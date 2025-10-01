import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import profile from '../../assets/profile.png'
import CountryFlag from 'react-country-flag'
import { getName } from 'country-list'
import ProfileSideBar from './ProfileSideBar'
import axios from 'axios'

export default function Profile() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [selectedCountryCode, setSelectedCountryCode] = useState('')
    const [age, setAge] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [phoneNum, setPhoneNum] = useState('')

    const currency = 'PKR'
    const password = '**********'

    const [profileImage, setProfileImage] = useState(profile)


    // ⬇ move this outside useEffect so it's reusable
    const verifyUser = async () => {
        const token = localStorage.getItem('authToken')

        if (token) {
            try {
                const userData = await axios.get('https://echo-cart-back-end.vercel.app/api/v1/user/userDetails', {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const userDetails = userData.data.user
                setUsername(userDetails.username)
                setEmail(userDetails.email)
                setSelectedCountryCode(userDetails.selectCountry)
                setPhoneNum(userDetails.phoneNum)
                setDob(userDetails.dob)
                setAge(userDetails.age)
                setGender(userDetails.selectGender)
                setProfileImage(userDetails.profileImage || profile)

            } catch (err) {
                if (err.message === "Network Error") {
                    console.log("Network error: Backend not reachable.")
                    return
                }

                console.error("Token validation error:", err)
                localStorage.removeItem("authToken")
                window.location.href = "/login"
            }
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
      
        try {
          const token = localStorage.getItem('authToken');
          const res = await axios.post(
            'https://echo-cart-back-end.vercel.app/api/v1/user/upload-profile-image',
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
      
          const imageUrl = res.data.imageUrl;
          setProfileImage(imageUrl); // ✅ use cloudinary URL directly
          console.log('Image Uploaded');
        } catch (err) {
          console.log('Upload Error', err);
        }
      };      



    const handleLogout = () => {
        localStorage.removeItem("authToken")
        window.location.href = "/"
    }


    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <ProfileSideBar />
                    <div className="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div className="row">
                            <div className="col-12">
                                <div className='profile-head'>
                                    <h2><Link to='/'>Home</Link> <i className='fa fa-chevron-right fs-5 mx-3'></i> <span className='text-muted'>My Profile</span></h2>
                                </div>
                            </div>
                            <div className='col-12 col-xl-9 px-3 px-lg-4 mb-4'>
                                <div className="my-profile-header">
                                    Personal Information
                                </div>
                                <div className="profile-image">
                                    <img className='' src={profileImage} alt="" />
                                    <input type="file" onChange={handleImageUpload} style={{ display: "none" }} id='profileImageInput' />
                                    <button className='change-profile-image' onClick={() => document.getElementById('profileImageInput').click()}>Change Image</button>
                                </div>
                                <div className="profile-info">
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Username :</label>
                                        <input type="text" value={username} disabled />
                                        <i className='fa fa-user'></i>
                                    </div>
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Email :</label>
                                        <input type="text" value={email} disabled />
                                        <i className='fa fa-envelope'></i>
                                        {/* <div className='change-info-btn'>
                                            <button><small>Change Email Address</small></button>
                                        </div> */}
                                    </div>
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Password :</label>
                                        <input type="password" value={password} disabled />
                                        <i className='fa fa-lock'></i>
                                        <div className='change-info-btn'>
                                            <button><Link className='text-decoration-none' to={'/change-password'}><small>Change Password</small></Link></button>
                                        </div>
                                    </div>
                                    <div className='mt-2 country-input-field'>
                                        <label htmlFor="">Country :</label>
                                        <input type="text" value={getName(selectedCountryCode) || "Unknown"} disabled />
                                        <div>
                                            <CountryFlag countryCode={selectedCountryCode} svg />
                                        </div>
                                    </div>
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Phone No :</label>
                                        <input type="text" value={`+` + phoneNum} disabled />
                                        <i className='fa fa-square-phone'></i>
                                        {/* <div className='change-info-btn'>
                                            <button><small>Change Phone No</small></button>
                                        </div> */}
                                    </div>
                                    <div className='mt-4'>
                                        <label htmlFor="">Language :</label>
                                        <select name="" id="">
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                    <div className='mt-4 profile-gender'>
                                        <label htmlFor="">Gender :</label>
                                        <input type="text" value={gender} disabled />
                                        <div className='profile-gender-icon'>
                                            <i className={`fa fa-mars ${"Male" === gender ? 'active' : ''}`}></i>
                                            <div className='d-inline-block mx-2'>|</div>
                                            <i className={`fa fa-venus ${"Female" === gender ? 'active' : ''}`}></i>
                                        </div>
                                    </div>
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Date of Birth :</label>
                                        <input type="text" value={dob} disabled />
                                        <i className='fa fa-calendar-days'></i>
                                    </div>
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Age :</label>
                                        <input type="text" value={age} disabled />
                                        <i className='fa fa-child'></i>
                                    </div>
                                    <div className='mt-4 profile-input'>
                                        <label htmlFor="">Currency :</label>
                                        <input type="text" value={currency} disabled />
                                        <i className='fa fa-money-bill-wave'></i>
                                    </div>

                                    <div className='mt-4 text-end text-md-start'>
                                        <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
