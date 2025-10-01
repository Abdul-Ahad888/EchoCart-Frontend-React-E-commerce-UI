import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileSideBar from './ProfileSideBar'
import { WishlistContext } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'

export default function Wishlist() {

  const { wishlist, removeWishlist } = useContext(WishlistContext)
  const { addToCart } = useContext(CartContext)

  const [animate, setAnimate] = useState(null)
  const [wishlistToast, setWishlistToast] = useState(null)

  const navigate = useNavigate()

  const handleRemoveFromWishlist = (productId) => {
    setAnimate(productId)
    setWishlistToast('removed')
    setTimeout(() => {
      removeWishlist(productId)
    }, (400))
    setTimeout(() => {
      setWishlistToast(null)
    }, (2500))
  }

  const handleNavigate = () => {
    navigate("/")
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <ProfileSideBar />
          <div className="col-12 col-md-8 col-lg-9 col-xl-10">
            <div className='profile-head'>
              <h2><Link to='/'>Home</Link> <i className='fa fa-chevron-right fs-5 mx-3'></i> <span className='text-muted'> Wishlist</span></h2>
            </div>

            {/* Toast When Product Add To Wishlist */}
            <div key={wishlistToast} style={{ bottom: "10px", right: "10px" }} className={`z-3 toast position-fixed align-items-center border-0 ${wishlistToast ? 'd-block profile-wishlist-toast' : 'd-none profile-wishlist-toast'}`} role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body">
                  {wishlistToast === 'removed' && "Product Removed From Wishlist"}
                </div>
              </div>
            </div>
            <div className="row">
              {
                wishlist.length > 0 ? (
                  wishlist.map(item => {

                    const discount = Math.floor(item.product.discountPercentage);
                    const discountedPrice = (item.product.price - item.product.price * discount / 100).toFixed(2)

                    let display;
                    let discountDisplay;
                    let actPriceDisplay;

                    if (discount <= 1) {
                      display = "none"
                      discountDisplay = "none"
                      actPriceDisplay = "block"
                    } else {
                      display = "block"
                      discountDisplay = "block"
                      actPriceDisplay = "none"
                    }


                    return (
                      <div className={`col-12 col-xl-6 col-xxl-4 ${animate === item.productId ? 'slideOut' : ''}`} key={item.id}>
                        <div className="row">
                          <div className="col-6 my-2">
                            <div className="prod-img-container">
                              <img className='prod-img' src={item.product.thumbnail} alt={item.product.title} />
                            </div>
                          </div>
                          <div className="col-6 my-2 px-1 position-relative">
                            <div className="prod-wishlist">
                              <p style={{ fontSize: "16px" }} className='fw-semibold truncate-2-lines'>{item.product.title}</p>
                              <div className='mt-4'>
                                <small className='fw-semibold'>Added On :</small> <small className='float-end' style={{ position: "relative", top: "4px", fontSize: "12px" }}>
                                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                                    year: "2-digit",
                                    month: "short",
                                    day: "numeric"
                                  })}
                                </small>
                              </div>
                              <div className='mt-2'>
                                <small className='fw-semibold'>Unit Price :</small>
                                <div className='d-inline-block float-end'>

                                  <div style={{ display: actPriceDisplay }} className='no-discount'>
                                    <small className='fw-semibold'>$ {item.product.price}</small>
                                  </div>

                                  <div style={{ display: discountDisplay }} className="discounted">
                                    <small className='d-block text-decoration-line-through'>${item.product.price}</small>
                                    <small className='d-block fw-semibold'>${discountedPrice}</small>
                                  </div>

                                </div>
                              </div>
                              <div className='mt-4'>
                                <small className='fw-semibold'>Discount :</small> <small className='float-end' style={{ position: "relative", top: "2px" }}>{discount}%</small>
                              </div>
                              <div className='mt-2'>
                                <small className='fw-semibold'>Stock :</small> <small className='float-end' style={{ position: "relative", top: "2px" }}>{item.product.stock}</small>
                              </div>

                              <div className='position-absolute' style={{ bottom: "10px", width: "88%" }}>
                                <div className="mt-5">
                                  <button className='w-100 btn-theme-fill py-1 rounded rounded-3' onClick={() => addToCart(item.product)}>Add To Cart</button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <small style={{ fontSize: "11px" }}>
                                    <Link className='text-decoration-none border-bottom border-1 border-black pb-1 ms-1 text-black' to={`/product/${item.productId}`}>
                                      View Product Page <i className='bi bi-arrow-right'></i>
                                    </Link>
                                  </small>
                                  <button className='border-0 bg-transparent' onClick={() => handleRemoveFromWishlist(item.productId)}>
                                    <i className='fa fa-trash'></i>
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="row align-content-center text-center" style={{ height: "80vh" }}>
                    <div className="position-relative">
                      <h4 className='d-inline' style={{ fontFamily: "cursive" }}> <span>Psst… it looks empty. Don’t be shy,</span> <button className='btn btn-theme-outline py-1' onClick={() => handleNavigate()}>add a product!</button></h4>
                    </div>
                  </div>
                )}

            </div>

          </div>
        </div>
      </div>
    </>
  )
}
