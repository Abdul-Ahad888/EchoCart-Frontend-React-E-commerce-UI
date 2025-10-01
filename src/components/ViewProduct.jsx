import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RelatedProduct from './RelatedProduct'
import { CartContext } from './context/CartContext'
import { WishlistContext } from './context/WishlistContext'

export default function ViewProduct() {

    const { addToCart } = useContext(CartContext)
    const { wishlist, addToWishlist, removeWishlist } = useContext(WishlistContext)

    const { id } = useParams()
    const [product, setProduct] = useState('')
    const [error, setError] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [review, setReview] = useState([])
    const [tags, setTags] = useState([])
    const [prodFav, setProdFav] = useState(false)
    const [productRating, setProductRating] = useState('')
    const [reviewBox, setReviewBox] = useState(false)
    const [reviewBoxRating, setReviewBoxRating] = useState(5)
    const [comment, setComment] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const [wishlistToast, setWishlistToast] = useState(null)

    useEffect(() => {
        if (product?.id) {
            const isFav = wishlist.some(item => item.productId === product.id);
            setProdFav(isFav);
        }
    }, [wishlist, product?.id]);



    useEffect(() => {
        fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/${id}`)

            .then((responce) => {
                if (!responce.ok) {
                    console.log('Network Responce Is Not Ok')
                }
                return responce.json()
            })

            .then((data) => {
                setProduct(data)
                setReview(data.reviews)
            })

            .catch((err) => {
                setError(err.message)
            })
    }, [id])


    useEffect(() => {
        const token = localStorage.getItem("authToken")
        if (!token) return
        const fetchUserDetails = async () => {
            try {

                const res = await fetch("https://echo-cart-back-end.vercel.app/api/v1/user/userDetails", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    console.error("Failed to fetch user details")
                    return
                }

                const data = await res.json()
                setUsername(data.user.username)
                setEmail(data.user.email)
            } catch (err) {
                console.error("Error fetching user details:", err)
            }
        }
        fetchUserDetails()
    }, [])


    // Tag's
    useEffect(() => {
        setTags(product.tags || [])
    }, [product.tags])

    useEffect(() => {

        if (review.length > 0) {
            const avgRating = review.reduce((sum, r) => sum + r.rating, 0) / review.length
            setProductRating(parseFloat(avgRating.toFixed(1)))
        } else {
            setProductRating(0)
        }

    }, [review])


    if (error) {
        return <div className="text-center my-5 text-danger">Error: {error}</div>;
    }


    // Removing After Decimal Number From Discount.
    const discount = Math.floor(product.discountPercentage);
    // Discounted Price Formula And Decimal Is Fixed To (2). 
    const discountedPrice = (product.price - product.price * discount / 100).toFixed(2)

    let discountDisplay;
    let actPriceDisplay;

    if (discount <= 1) {
        discountDisplay = "none"
        actPriceDisplay = "block"
    } else {
        discountDisplay = "block"
        actPriceDisplay = "none"
    }

    // Stocks Managment
    let badge;
    let stockBadge;

    if (product.stock === 0) {
        badge = "badge bg-danger";
        stockBadge = "Out of Stock";
    } else if (product.stock < 10) {
        badge = "badge bg-warning";
        stockBadge = "Low Stock";
    } else {
        badge = "badge bg-primary";
        stockBadge = "In Stock";
    }


    // Rating Managment
    let rating = Math.floor(productRating || 0);
    let rating1, rating2, rating3, rating4, rating5;

    if (productRating > 0.1 && productRating < 2) {
        rating1 = "fa-solid fa-star text-warning"
        rating2 = "fa-regular fa-star text-secondary"
        rating3 = "fa-regular fa-star text-secondary"
        rating4 = "fa-regular fa-star text-secondary"
        rating5 = "fa-regular fa-star text-secondary"
    }
    else if (productRating >= 2 && productRating < 3) {
        rating1 = "fa-solid fa-star text-warning"
        rating2 = "fa-solid fa-star text-warning"
        rating3 = "fa-regular fa-star text-secondary"
        rating4 = "fa-regular fa-star text-secondary"
        rating5 = "fa-regular fa-star text-secondary"
    }
    else if (productRating >= 3 && productRating < 4) {
        rating1 = "fa-solid fa-star text-warning"
        rating2 = "fa-solid fa-star text-warning"
        rating3 = "fa-solid fa-star text-warning"
        rating4 = "fa-regular fa-star text-secondary"
        rating5 = "fa-regular fa-star text-secondary"
    }
    else if (productRating >= 4 && productRating < 5) {
        rating1 = "fa-solid fa-star text-warning"
        rating2 = "fa-solid fa-star text-warning"
        rating3 = "fa-solid fa-star text-warning"
        rating4 = "fa-solid fa-star text-warning"
        rating5 = "fa-regular fa-star text-secondary"
    }
    else {
        rating1 = "fa-solid fa-star text-warning"
        rating2 = "fa-solid fa-star text-warning"
        rating3 = "fa-solid fa-star text-warning"
        rating4 = "fa-solid fa-star text-warning"
        rating5 = "fa-solid fa-star text-warning"
    }


    function getStarClasses(productRating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (productRating >= i) {
                stars.push("fa-solid fa-star text-warning");
            } else {
                stars.push("fa-regular fa-star text-secondary");
            }
        }
        return stars;
    }

    // Quantity
    if (quantity > product.stock) {
        setQuantity(product.stock)
    }

    // Review Box Rating
    const handleReviewBoxRating = (rating) => {
        setReviewBoxRating(rating);
    };

    // Function to dynamically set star classes
    const getReviewStarClass = (index) => {
        return index <= reviewBoxRating ? "fa-solid fa-star text-warning" : "fa-regular fa-star text-secondary";
    };

    // Open Review Box 
    const handleReviewBox = () => {
        setReviewBox(!reviewBox)

        if (reviewBox) {
            document.body.style.overflow = 'auto'
        } else {
            document.body.style.overflow = 'hidden'
        }
    }

    // Post Review
    const handlePostReview = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("authToken")
            if (!token) return

            const res = await fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/${id}/reviews`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reviewerName: username,
                        reviewerEmail: email,
                        comment: comment,
                        rating: reviewBoxRating,
                    })
                })

            const data = await res.json()
            if (!res.ok) {
                console.log("failed to post review")
                return
            }

            setReview(data.reviews || [])
            setComment('')
            handleReviewBox()

        } catch (err) {
            console.log(err)
        }
    }

    // Add To Favourite Button
    const handleAddToFav = async () => {
        const token = localStorage.getItem("authToken")
        if (!token) {
            setProdFav(false)
            return
        }
        if (prodFav) {
            setProdFav(false);
            await removeWishlist(product.id);
            setWishlistToast('removed')
            setTimeout(() => {
                setWishlistToast(null)
            }, (5000))
        } else {
            setProdFav(true);
            await addToWishlist(product);
            setWishlistToast('added')
            setTimeout(() => {
                setWishlistToast(null)
            }, (5000))
        }
    };


    return (
        <>
            {/* Toast When Product Add To Wishlist */}
            <div key={wishlistToast} style={{ bottom: "10px", right: "10px" }} className={`z-3 toast position-fixed align-items-center border-0 ${wishlistToast ? 'd-block wishlist-toast' : 'd-none wishlist-toast'}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {wishlistToast === 'added' && "Product Added To Wishlist"}
                        {wishlistToast === 'removed' && "Product Removed From Wishlist"}
                    </div>
                </div>
            </div>

            {/* ReviewBox */}
            {<div className={`${reviewBox ? 'detail-overlay show' : 'detail-overlay hide'}`}></div>}


            {/* Main Content */}
            <div className="container">
                <div className="row my-5">

                    {/* BreadCrum */}
                    <div className="my-4">
                        <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to='/' className='text-black text-decoration-none fw-normal'>Home</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    {product.title}
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {/* Product ShowCase & Previewer */}
                    <div className="col-12 col-md-5">
                        <div className="text-center prod-img-box">

                            <div className="prod-preview">
                                <div class="tab-content" id="pills-tabContent">
                                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0"><img className='img-fluid' src={product.thumbnail} alt={product.title} /></div>
                                    <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0"><img className='img-fluid' src={product.images} alt={product.title} /></div>
                                </div>
                            </div>

                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <div className="prod-showcase-img">
                                    <li class="custom-nav-item" role="presentation">
                                        <button class="custom-nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><img className='img-fluid' src={product.thumbnail} alt={product.title} /></button>
                                    </li>
                                </div>
                                {/* <div className="prod-showcase-img">
                                    <li class="custom-nav-item" role="presentation">
                                        <button class="custom-nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"><img className='img-fluid' src={product.images} alt={product.title} /></button>
                                    </li>
                                </div> */}
                            </ul>

                        </div>
                    </div>

                    {/* Product Details & Description */}
                    <div className="col-12 col-md-7">
                        <div className='highlighted'>
                            <h1 className='fw-bold display-5 d-inline-block'>{product.title}</h1>

                            <hr className='my-4' />
                            <div className="prod-fav float-end mx-2">
                                <button onClick={handleAddToFav} style={{
                                    borderColor: prodFav ? "#af0012" : "#d4d4d4",
                                    color: prodFav ? "#af0012" : "#d4d4d4",
                                }}>
                                    <i className="fa fa-heart"></i>
                                </button>
                            </div>

                            <div className="actPriceDisplay" style={{ display: actPriceDisplay }}>
                                <h1>$ {product.price}</h1>
                            </div>

                            <div className="discountedPriceDisplay" style={{ display: discountDisplay }}>
                                <h6><span className='text-decoration-line-through fw-semibold'>$ {product.price}</span> <span style={{ fontSize: "12px" }} className='ms-1'>{discount}% OFF</span></h6>
                                <h2 style={{ color: "#de7127" }}>$ {discountedPrice}</h2>
                            </div>
                        </div>

                        <div className='details'>

                            {product.brand && (
                                <div className='mt-4'>
                                    <h6 className='m-0 fw-semibold'>Brand: <p className='d-inline-block'>{product.brand}</p></h6>
                                </div>
                            )}

                            <div className='description mt-1'>
                                <p>{product.description} shop it now from EchoCart, your one-stop shop for authentic products.</p>
                            </div>

                            <div className='policies'>
                                <h6 className='m-0 fw-semibold'>Warranty: <p className='d-inline-block'>{product.warrantyInformation}</p></h6>
                                <h6 className='m-0 fw-semibold'>Weight: <p className='d-inline-block'>{product.weight} (Unit)</p></h6>
                                <h6 className='m-0 fw-semibold'>Return Policy: <p className='d-inline-block'>{product.returnPolicy}</p></h6>
                                <h6 className='m-0 fw-semibold'>Shipping Info: <p className='d-inline-block'>{product.shippingInformation}</p></h6>
                            </div>

                            <div className="quantity mt-4">
                                <small className='d-block'>Quantity :</small>
                                <div className="quantity-wrapper">
                                    <input
                                        type="number"
                                        value={quantity}
                                        min="1"
                                        max={product.stock}
                                        onChange={(e) => {
                                            let val = Number(e.target.value);
                                            if (val < 1) val = 1;
                                            if (val > product.stock) val = product.stock;
                                            setQuantity(val);
                                        }} />
                                    <button className="btn-plus" onClick={() => setQuantity(quantity + 1)}>+</button>
                                    <button className="btn-minus" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                                </div>
                            </div>

                            <div className="stock-status mt-4">
                                <p className='d-inline-block me-3'>Stock : <span className='fw-bold me-2'>{product.stock}</span> |</p>
                                <p className={`'d-inline-block' ${badge}`}>{stockBadge}</p>
                            </div>

                            <div className='tags mt-4'>
                                <small className='d-block mb-1 fw-normal'>Tags :</small>
                                {tags.map((tag, index) => (
                                    <div key={index} className="me-2 mb-2 d-inline-block">
                                        <div className='badge bg-secondary p-2'>{tag}</div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className='buy-button d-inline-block w-50'>
                                <div className="me-2">
                                    <button className='btn-theme-fill w-100'>Buy Now</button>
                                </div>
                            </div> */}

                            <div className="cart-button d-inline-block w-50">
                                <div className="me-2">
                                    <button className='btn-theme-outline w-100' onClick={() => addToCart(product, quantity)}><i className='fa fa-cart-plus me-2' style={{ color: "#de7127" }}></i>Add To Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <RelatedProduct></RelatedProduct>

                    {/* Reviews */}
                    <div className="review mt-5">
                        <h3>Reviews :</h3>

                        <div className='overall-rating mt-5'>
                            <h5>Overall Rating :</h5>
                            <p className='fw-bold fs-4 d-inline-block'>({rating})</p>
                            <div className='d-inline-block fs-5 ms-2'>
                                <i className={`${rating1}`}></i>
                                <i className={`${rating2}`}></i>
                                <i className={`${rating3}`}></i>
                                <i className={`${rating4}`}></i>
                                <i className={`${rating5}`}></i>
                            </div>
                        </div>

                        {review.length === 0 ? (
                            <div className="text-muted mt-4">
                                <p>No reviews yet. Be the first to write one!</p>
                            </div>
                        ) : (
                            review.map((rw, index) => {
                                const reviewRatingClasses = getStarClasses(rw?.rating || 0);
                                return (
                                    <div className="position-relative review-item d-block d-lg-flex align-items-center justify-content-between mt-4 px-2 px-lg-4 pt-4 pb-3" key={index}>
                                        {/* Left Section: Icon, Name, and Rating */}
                                        <div className="d-flex align-items-center">
                                            <div className="reviewer-name-icon text-center">
                                                {rw.reviewerName.charAt(0)}
                                            </div>
                                            <div className="review-rating ms-3">
                                                <div>
                                                    {reviewRatingClasses.map((starClass, idx) => (
                                                        <i key={idx} className={starClass}></i>
                                                    ))}
                                                </div>
                                                <div className="reviewer-name">
                                                    <p className="fw-semibold mt-1">{rw.reviewerName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="divider mx-3 d-none d-lg-block"></div>

                                        {/* Right Section: Comment and Email */}
                                        <div className="review-right w-100 d-block d-lg-flex justify-content-between">
                                            <div className="review-comment">
                                                <p className="mb-0 fw-bold">{rw.comment}</p>
                                                <p className="mb-0">{rw.reviewerEmail}</p>
                                            </div>
                                            <div className="text-muted" style={{ position: "absolute", top: "20px", right: "20px" }}>
                                                <p className="mb-0">{new Date(rw.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>


                    {/* Write a Review */}
                    <div className="my-5 text-center">
                        <h5>Review This Product</h5>
                        <p>Share your thoughts with other customers.</p>
                        <button className='btn-theme-outline px-5' onClick={handleReviewBox}>Write a review</button>
                    </div>
                    {reviewBox && (
                        <div className='review-dialoge-box-container'>
                            <div className='review-dialoge-box-close-btn'>
                                <i className='fa fa-close' onClick={handleReviewBox}></i>
                            </div>
                            <h5>Write a review!</h5>
                            <p>Share your thoughts with other customers</p>
                            <div className='review-dialoge-box'>
                                <form action="" onSubmit={handlePostReview}>
                                    <div className="review-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={getReviewStarClass(star)}
                                                onClick={() => handleReviewBoxRating(star)}
                                                style={{ cursor: "pointer", fontSize: "24px", margin: "5px" }}
                                            ></i>
                                        ))}
                                    </div>
                                    <input type="text" placeholder='Your Name' value={username} required disabled />
                                    <input type="email" placeholder='Your Email Address' value={email} required disabled />
                                    <textarea name="" id="" rows={6} placeholder='Write your message' value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                                    <div className='text-end'>
                                        <button>Post</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}


                </div>
            </div >
        </>
    )
}
