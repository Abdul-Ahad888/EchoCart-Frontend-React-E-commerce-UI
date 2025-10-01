import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import Filter from './Filter';

export default function CategoryDetail() {
  const { categoryName } = useParams()
  const [allCategoryProducts, setAllCategoryProdcuts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filterDisplay, setFilterDisplay] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 16

  useEffect(() => {
    fetch(`https://echo-cart-back-end.vercel.app/api/v1/products`)
      .then((res) => res.json())
      .then((data) => {

        const decodedCategory = categoryName.replace(/-/g, ' ');
        const filtered = data.products.filter(
          (p) => p.category.toLowerCase() === decodedCategory.toLowerCase()
        );


        const updatedProducts = filtered.map((product) => {
          const reviews = product.reviews || []
          const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

          return {
            ...product,
            averageRating: parseFloat(avgRating.toFixed(1))
          }
        })

        setAllCategoryProdcuts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setCurrentPage(1);
      })
      .catch((err) => console.error('error while fetching data', err));
  }, [categoryName]);



  // Pagination 
  const indexOfLastProduct = productsPerPage * currentPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
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

  useEffect(() => {
    return (() => {
      document.body.style.overflow = 'auto'
    })
  }, [])



  return (
    <>
      <div className="container">

        {/* Breadcrumb */}
        <div className="mt-5 d-inline-block">
          <nav style={{ '--bs-breadcrumb-divider': "'>'" }} aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-black text-decoration-none fw-normal">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-capitalize" aria-current="page">
                {categoryName}
              </li>
            </ol>
          </nav>
        </div>

        <div className="float-end mt-5">
          <p><span style={{ color: "#de7127" }}>{filteredProducts.length}</span> Items found</p>
        </div>


        <div className="row my-5">
          {/* Filter Section */}
          <div className={`col-12 col-lg-3 filter-container ${filterDisplay ? "show" : ""}`}>
            {/* Close Button */}
            <div className="d-flex justify-content-end">
              <button className="btn btn-close" onClick={Handlefilter}></button>
            </div>
            <Filter categoryData={allCategoryProducts} setFilteredProducts={setFilteredProducts} />
          </div>

          {/* Product Cards Section */}
          <div className="col-12 col-lg-9">
            <h2 className='d-inline-block text-capitalize fw-normal mb-4'>{categoryName}</h2>
            <div className='d-inline-block d-lg-none float-end filter-icon'>
              <button onClick={Handlefilter}>
                <i className='bi bi-filter fs-3'></i>
              </button>
            </div>
            <span className='d-block border-bottom mb-5'></span>
            <div className="row">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <li className="list-group-item text-center">Filtered Products Not Found</li>
              )}
            </div>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mt-5">
              <li className="page-item">
                <button className="page-link" aria-label="Previous" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}>
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {renderPagination().map((number) => (
                <li className="page-item" key={number}>
                  <button className={`page-link ${currentPage === number ? 'active' : ''}`} onClick={() => handlePageChange(number)}>
                    {number}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}>
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </>
  );
}
