import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from './ProductCard'

export default function RelatedProduct() {

    const { id } = useParams()

    const [currentProduct, setCurrentProduct] = useState(null)
    const [relatedProduct, setRelatedProduct] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Fetching Products
    useEffect(() => {
        setIsLoading(true)

        fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/${id}`)

            .then((res) => res.json())
            .then((productData) => {
                setCurrentProduct(productData)
                return fetch(`https://echo-cart-back-end.vercel.app/api/v1/products`)
            })

            .then((res) => res.json())
            .then((allProductsData) => {
                setAllProducts(allProductsData.products)
            })

            .catch((err) => console.error("Error While Fetching Data", err))

            .finally(() => setIsLoading(false))

    }, [id])


    // Filtering Data
    useEffect(() => {

        if (currentProduct && allProducts.length > 0) {

            const filteredProducts = allProducts.filter((product) => {
                const currentCategory = currentProduct.category || "";
                const productCategory = product.category || "";

                return productCategory === currentCategory && parseInt(product.id) !== parseInt(id);
            });


            setRelatedProduct(filteredProducts)
        }

    }, [currentProduct, allProducts])

    return (
        <div>
            <div className="container">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
                        <div className="loadmore-spinner"></div>
                    </div>
                ) : (
                    <div className="related-products mt-5">
                        <h3 className="my-5">Related Products:</h3>
                        <div className="row">
                            {relatedProduct.length > 0 ? (
                                relatedProduct.map((product) => (
                                    <div className="col-5-prod-per-row" key={product.id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            ) : (
                                <p>No related products found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
