import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../App'
import ProductCard from './ProductCard'
import { useNavigate } from 'react-router-dom'
import Filter from './Filter'

export default function SearchProducts() {
  const navigate = useNavigate()
  const { searchQuery } = useContext(SearchContext)
  const [products, setProducts] = useState([])
  const [searchFilteredProducts, setSearchFilteredProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filterDisplay, setFilterDisplay] = useState('')

  const [loading, setLoading] = useState(false);

  // Fetching All Products
  useEffect(() => {
    fetch('https://echo-cart-back-end.vercel.app/api/v1/products')
      .then((res) => res.json())
      .then((data) => {
        const updatedProducts = data.products.map((product) => {
          const reviews = product.reviews || []
          const avgRating =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0

          return {
            ...product,
            averageRating: parseFloat(avgRating.toFixed(1)),
          }
        })
        setProducts(updatedProducts)
        setSearchFilteredProducts(updatedProducts)
        setFilteredProducts(updatedProducts)
      })
      .catch((err) => {
        console.log('Error while fetching products:', err)
      })
  }, [])

  // Filtering Products By Search Query
  useEffect(() => {
    if (!searchQuery) {
      navigate('/')
    } else {
      setLoading(true)
      const matched = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchFilteredProducts(matched)
      setFilteredProducts(matched)
      setTimeout(() => setLoading(false), 500)
    }
  }, [searchQuery, products, navigate])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 16
  const indexOfLastProduct = productsPerPage * currentPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  const Handlefilter = () => {
    setFilterDisplay((prevFilter) => {
      if (!prevFilter) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
      return !prevFilter
    })
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          {/* Sidebar for Filters */}
          {searchFilteredProducts.length > 0 && (
            <div className={`col-12 col-lg-3 filter-container ${filterDisplay ? "show" : ""}`}>
              <div className="d-flex justify-content-end">
                <button className="btn btn-close" onClick={Handlefilter}></button>
              </div>
              <Filter categoryData={searchFilteredProducts} setFilteredProducts={setFilteredProducts} />
            </div>
          )}

          <div className={searchFilteredProducts.length > 0 ? 'col-lg-9' : 'col-12'}>
            <div className="my-5">
              <h5>
                Search Results:{''}
                <span className="text-bold text-black fs-4">{`"${searchQuery}"`}</span>
              </h5>
              <small className="text-muted fw-semibold">
                <span>{filteredProducts.length}</span> items found
              </small>
              <div className='d-inline-block d-lg-none float-end filter-icon'>
                <button onClick={Handlefilter}>
                  <i className='bi bi-filter fs-3'></i>
                </button>
              </div>
            </div>

            {loading ? (
                <div className="spinner-border position-absolute start-50 z-3 border-5" style={{ color: "#de7127", height: "100px", width: "100px", translate: "-50% -50%", top: "50%" }} role="status">
                  <span className="visually-hidden">Redirecting...</span>
                </div>
            ) : currentProducts.length > 0 ? (
              <div className="row">
                {currentProducts.map((product) => (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center my-5">
                <h5>No Products Found...</h5>
                <small className="text-muted">
                  No products found with{' '}
                  <span className="text-bold text-black fs-5">{`"${searchQuery}"`}</span> search
                  result.
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mt-5">
              <li className="page-item">
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {renderPagination().map((number) => (
                <li className="page-item" key={number}>
                  <button
                    className={`page-link ${currentPage === number ? 'active' : ''}`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button
                  className="page-link"
                  aria-label="Next"
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}
