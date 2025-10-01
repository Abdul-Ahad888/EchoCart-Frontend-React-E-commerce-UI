import React, { useEffect, useState } from 'react'
import slider1 from '../assets/slider1.jpg'
import slider2 from '../assets/slider2.jpg'
import slider3 from '../assets/slider3.jpg'
import slider4 from '../assets/slider4.jpg'
import slider5 from '../assets/slider5.jpg'
import Category from '../components/Category'
import ProductCard from './ProductCard'

export default function Home() {

  const [products, setProducts] = useState([])
  const [visibleProductsCounts, setVisibleProductsCounts] = useState(20)
  const [error, setError] = useState(null)
  const [loadMore, setLoadMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const apiUrl = 'https://echo-cart-back-end.vercel.app/api/v1/products'
    fetch(apiUrl)

      .then((responce) => {
        if (!responce.ok) {
          console.log('Network Responce Is Not Ok')
        }
        return responce.json()
      })

      .then((data) => {
        setProducts(data.products)
        setLoading(false)
      })

      .catch((error) => {
        setError(error.message)
        setLoading(false)
      });

  }, [])

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);


  // This Function Adds 20 More Products When Click On Load More Button
  const handleLoadMore = () => {
    setLoadMore(true)
    setTimeout(() => {
      setVisibleProductsCounts((prevCount) => prevCount + 20)
      setLoadMore(false)
    }, 2000)
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  return (
    <div>

      {loading && (
        <div
          className="modal show d-block position-absolute top-0 start-0"
          style={{ backgroundColor: "#fff", zIndex: "99999999999" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="spinner-border position-absolute start-50 z-3 border-5 top-50"
            style={{
              color: "#de7127",
              height: "120px",
              width: "120px",
              translate: "-50% -50%",
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="container my-4">
        <div className="row">

          <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="3" aria-label="Slide 4"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="4" aria-label="Slide 5"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={slider1} className="d-block img-fluid" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider2} className="d-block img-fluid" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider3} className="d-block img-fluid" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider4} className="d-block img-fluid" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider5} className="d-block img-fluid" alt="..." />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          {loading ? (

            <div className="text-center pt-5 my-5">
              <div className='loadmore-spinner'></div>
            </div>

          ) : (
            <>
              <Category />

              <div className="pop-prods">
                <h2 className='fw-semibold my-5'>Top Selling Products</h2>

                <div className="row">
                  {products.slice(0, visibleProductsCounts).map((product) => (
                    <div className="col-5-prod-per-row" key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}

                  {visibleProductsCounts < products.length && (
                    <div className="text-center my-5">
                      {loadMore ? (
                        <div className="loadmore-spinner"></div>
                      ) : (
                        <button className="btn-theme-outline" onClick={handleLoadMore}>
                          <span>Load More</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div >
  )
}
