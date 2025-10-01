import React, { useEffect, useState } from 'react'
import ProfileSideBar from './ProfileSideBar'
import { Link } from 'react-router-dom'

export default function Reviews() {
    const [email, setEmail] = useState('')
    const [reviews, setReviews] = useState([])

    const [expanded, setExpanded] = useState({})
    const [manage, setManage] = useState(false)

    const [editComment, setEditComment] = useState('')
    const [editRating, setEditRating] = useState(5)
    const [editingIndex, setEditingIndex] = useState(null)

    const [reviewBoxRating, setReviewBoxRating] = useState(5)


    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) return

        const userDetails = async () => {
            try {
                const res = await fetch('https://echo-cart-back-end.vercel.app/api/v1/user/userDetails', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) return console.log('Failed To Fetch User Data')
                const userData = await res.json()
                setEmail(userData.user.email)
            } catch (err) {
                console.error('Error fetching user details:', err)
            }
        }
        userDetails()
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/reviews/${email}`)
                const data = await res.json()
                setReviews(data.reviews || [])
            } catch {
                console.log('Failed To Load Reviews')
            }
        }
        if (email) fetchReviews()
    }, [email])

    const editReview = async (review, index) => {

        if (!editComment.trim()) {
            alert("Review comment cannot be empty");
            return;
        }    

        try {
            const res = await fetch(
                `https://echo-cart-back-end.vercel.app/api/v1/products/${review.productId}/reviews`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reviewerEmail: review.reviewerEmail,
                        comment: editComment,
                        rating: editRating,
                    }),
                }
            )

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                console.log('Edit Failed', data.msg || res.status)
                return
            }

            setReviews(prev =>
                prev.map((r, i) =>
                    i === index ? { ...r, comment: editComment, rating: editRating, date: new Date().toISOString() } : r
                )
            )
            setEditingIndex(null)
        } catch {
            console.log('Failed To Edit Review')
        }
    }

    const deleteReview = async (review, index) => {

        const confirm = window.confirm('Are You Sure You Want To Delete Review')
        if (!confirm) return

        try {
            const res = await fetch(
                `https://echo-cart-back-end.vercel.app/api/v1/products/${review.productId}/reviews`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewerEmail: review.reviewerEmail }),
                }
            )

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                console.log('Delete Failed', data.msg || res.status)
                return
            }

            setReviews(prev => prev.filter((_, i) => i !== index))
            if (editingIndex === index) setEditingIndex(null)

        } catch {
            console.log('Failed To Delete Review')
        }
    }

    const startEditing = (index, review) => {
        setEditingIndex(index)
        setEditRating(review.rating)
        setEditComment(review.comment)
        setReviewBoxRating(review.rating);
    }

    const toggleReadMore = index => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }))
    }

    const toggleManage = () => setManage(m => !m)

    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
    }))
    const totalReviews = reviews.length || 1

    const handleReviewBoxRating = (rating) => {
        setReviewBoxRating(rating);
        setEditRating(rating)
    };

    // Function to dynamically set star classes
    const getReviewStarClass = (index) => {
        return index <= reviewBoxRating ? "fa-solid fa-star text-dark" : "fa-regular fa-star text-secondary";
    };


    return (
        <div className="container-fluid">
            <div className="row">
                <ProfileSideBar />
                <div className="col-12 col-md-8 col-lg-9 col-xl-10">
                    <div className="profile-head">
                        <h2>
                            <Link to="/">Home</Link>{' '}
                            <i className="fa fa-chevron-right fs-5 mx-3"></i>{' '}
                            <span className="text-muted">Reviews</span>
                        </h2>
                    </div>

                    <div className="row profile-reviews">
                        {reviews.length === 0 ? (
                            <div className="d-flex justify-content-center align-items-center text-center" style={{ height: '80vh' }}>
                                <h3>Your opinion matters — start the conversation!</h3>
                            </div>
                        ) : (
                            <>
                                <div className="reviews-header my-4">
                                    <p className="fw-bold p-0 m-0 mx-4">{reviews.length} Reviews Yet !</p>
                                    <div className="mx-4">
                                        <i className="bi bi-star-fill text-black me-3 fs-4"></i>
                                        <i className="bi bi-star-fill text-black me-3 fs-4"></i>
                                        <i className="bi bi-star-fill text-black me-3 fs-4"></i>
                                        <i className="bi bi-star-fill text-black me-3 fs-4"></i>
                                        <i className="bi bi-star-fill text-black me-3 fs-4"></i>
                                    </div>
                                    <div className="mt-4 mx-4">
                                        {ratingCounts.map((rc, i) => (
                                            <div key={i} className="d-flex align-items-center mb-2">
                                                <p className="fw-bold mb-0 me-2" style={{ minWidth: '70px' }}>
                                                    {rc.star} {rc.star === 1 ? 'Star' : 'Stars'}
                                                </p>
                                                <div className="progress" style={{ width: '60%', height: '3px' }}>
                                                    <div
                                                        className="progress-bar bg-black"
                                                        style={{ width: `${(rc.count / totalReviews) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <p className="mb-0 ms-3">{rc.count}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-end my-3">
                                    <button className="btn-theme-fill py-1" onClick={toggleManage}>
                                        Manage <i className="fa fa-pen-to-square ms-1"></i>
                                    </button>
                                </div>

                                {reviews.map((rev, index) => {
                                    const isExpanded = expanded[index]
                                    const isLong = rev.comment.length > 120

                                    return (
                                        <div key={`${rev.productId}-${rev.reviewerEmail}-${index}`} className="col-12 col-xl-6 col-xxl-4">
                                            <div className="px-3 pt-4 mb-4 review-profile-box">
                                                <h5 className="fw-bold pb-2" style={{ borderBottom: '1px solid rgba(202, 202, 202, 0.27)' }}>
                                                    {rev.productTitle}
                                                </h5>

                                                <p className="mb-2 mt-3">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <i
                                                            key={star}
                                                            className={`me-2 ${rev.rating >= star ? 'fa-solid fa-star text-dark' : 'fa-regular fa-star text-secondary'
                                                                }`}
                                                        />
                                                    ))}
                                                    <span className="mx-1 fs-6">({rev.rating})</span>
                                                </p>

                                                <small className="text-secondary">
                                                    {new Date(rev.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </small>

                                                <div className="review-profile-box-content">
                                                    <p className="mt-4">
                                                        {isExpanded ? rev.comment : rev.comment.slice(0, 120)}
                                                        {!isExpanded && isLong && '...'}
                                                        {isLong && (
                                                            <div className="d-inline-block">
                                                                <button
                                                                    className="border-0 bg-transparent text-decoration-underline"
                                                                    onClick={() => toggleReadMore(index)}
                                                                >
                                                                    {isExpanded ? 'readless' : 'readmore'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </p>
                                                </div>

                                                <div className={`review-profile-box-manage ${manage ? 'show' : ''}`}>
                                                    {editingIndex !== index && (
                                                        <>

                                                            <button className="edit" onClick={() => startEditing(index, rev)}>
                                                                <i className="fa fa-pencil"></i>
                                                            </button>
                                                            <button className="delete" onClick={() => deleteReview(rev, index)}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                {editingIndex === index && (
                                                    <>
                                                        <div className='text-center border-bottom border-top border-1 py-2 fs-5 fw-bold'>
                                                            Edit Your Review
                                                        </div>
                                                        <div className="my-3 p-3 edit-review-form">
                                                            <div className="review-stars text-center fs-5 my-3">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <i
                                                                        key={star}
                                                                        className={getReviewStarClass(star)}
                                                                        onClick={() => handleReviewBoxRating(star)}
                                                                        style={{ cursor: "pointer", margin: "5px" }}
                                                                    ></i>
                                                                ))}
                                                            </div>
                                                            <textarea
                                                                className="form-control mb-4"
                                                                value={editComment}
                                                                onChange={e => setEditComment(e.target.value)} />
                                                            <button className="btn btn-theme-fill py-1 me-2" onClick={() => editReview(rev, index)}>
                                                                Save
                                                            </button>
                                                            <button className="btn btn-theme-outline py-1" onClick={() => setEditingIndex(null)}>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
