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
        <div className="loader">
        <div className="position-relative">
            <h5 className="text-white z-3 position-absolute text-center shine-text"
                style={{top: "130px", width: "1000px", transform: "translate(-50%, 0%)"}}>
                EchoCart
            </h5>
            <figure className="iconLoaderProgress">
                <svg className="iconLoaderProgressFirst" width="240" height="240">
                    <circle cx="120" cy="120" r="100"></circle>
                </svg>

                <svg className="iconLoaderProgressSecond" width="240" height="240">
                    <circle cx="120" cy="120" r="100"></circle>
                </svg>
            </figure>
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
                <img src={slider1} className="d-block" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider2} className="d-block" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider3} className="d-block" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider4} className="d-block" alt="..." />
              </div>
              <div className="carousel-item">
                <img src={slider5} className="d-block" alt="..." />
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
