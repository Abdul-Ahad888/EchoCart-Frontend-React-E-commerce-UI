import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [messageToast, setMessageToast] = useState(false)

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const token = localStorage.getItem("authToken");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setMessageToast(true);
        setTimeout(() => setMessageToast(false), 3000);

      } else {
        alert(data.msg || "Failed To Delete Product");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong while deleting");
    }
  };

  useEffect(() => {
    const getAllProducts = () => {
      setLoading(true)

      fetch("https://echo-cart-back-end.vercel.app/api/v1/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.log("Network Response Error");
          }
          return res.json();
        })
        .then((data) => {
          setProducts(data.products);
          setLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        });
    };

    getAllProducts();
  }, []);

  // 🔹 Search filter
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Pagination logic
  const productsPerPage = 10;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const createProduct = () => {
    navigate('create-product')
  }

  return (
    <>

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: "9999" }}
        >
          <div
            className="spinner-border"
            style={{ width: "5rem", height: "5rem", color: "#de7127" }}
            role="status"
          >
            <span className="visually-hidden"></span>
          </div>
        </div>
      )}

      {messageToast && (
        <div role="alert" aria-live="assertive" aria-atomic="true" class="toast position-fixed d-block" style={{ bottom: "10px", right: "10px" }} data-bs-autohide="false">
          <div class="toast-header">
            <strong class="me-auto">EchoCart</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            Product Have Been Deleted.
          </div>
        </div>
      )}

      <div className="products-container p-4">
        {/* Top Bar */}
        <div className="products-header d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Products</h5>
          <div className="product-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search Products By ID / Name"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="btn-theme-outline py-1" onClick={createProduct}>Create Product</button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-borderless table-hover products-table">
            <thead>
              <tr>
                <th className="id-col">Product ID</th>
                <th className="image-col">Image</th>
                <th className="name-col">Product Name</th>
                <th className="stock-col">Stock</th>
                <th className="status-col">Status</th>
                <th className="price-col">Discount</th>
                <th className="price-col">Price</th>
                <th className="action-col"></th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product, idx) => {

                  let productDiscount = product.discountPercentage;
                  if (productDiscount <= 1) {
                    productDiscount = '-'
                  } else {
                    productDiscount = productDiscount + '%'
                  }

                  let productStatus;
                  if (product.stock === 0) {
                    productStatus = 'Out Of Stock'
                  } else if (product.stock <= 10) {
                    productStatus = 'Low Stock'
                  } else {
                    productStatus = 'In Stock'
                  }

                  return (
                    <tr key={idx}>
                      <td className="id-col"><small>{product.id}</small></td>
                      <td className="image-col text-center align-middle">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          style={{
                            width: "80px",
                            height: "80px",
                            maxWidth: "100px",
                            borderRadius: "6px",
                            objectFit: "cover"
                          }}
                        />
                      </td>
                      <td className="name-col text-capitalize">
                        {product.title}
                      </td>
                      <td className="stock-col">{product.stock}</td>
                      <td className="status-col">
                        <span className="status-wrapper position-relative" style={{ bottom: "1px", right: "5px" }}>
                          <span className={`status-dot ${productStatus === "In Stock" ? "bg-success" : productStatus === "Low Stock" ? "bg-warning" : "bg-danger"}`}></span>
                        </span>
                        <span>{productStatus}</span>
                      </td>
                      <td className="discount-col">{productDiscount}</td>
                      <td className="price-col">${product.price}</td>
                      <td className="action-col">
                        <i className="fa fa-pen-to-square" onClick={() => navigate(`/admin/products/edit-product/${product.id}`)}></i>
                        <i className="fa fa-trash" onClick={() => handleDelete(product.id)}></i>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="products-footer d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            Showing {filteredProducts.length === 0 ? 0 : indexOfFirst + 1} –{" "}
            {Math.min(indexOfLast, filteredProducts.length)} of{" "}
            {filteredProducts.length}
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
