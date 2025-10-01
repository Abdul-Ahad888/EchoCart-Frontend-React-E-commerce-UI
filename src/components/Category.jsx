import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Category() {

    const [categories, setCategories] = useState([])
    // const [products, setProducts] = useState([])
    const scrollRef = useRef(null)

    useEffect(() => {

        fetch(`https://echo-cart-back-end.vercel.app/api/v1/products`)

            .then((res) => res.json())

            .then((data) => {
                // setProducts(data.products)

                const uniqueCategories = [...new Set(data.products.map(p => p.category.toLowerCase()))]
                setCategories(uniqueCategories)
            })

            .catch((err) => {
                console.error("error while fetching products", err)
            })
    }, [])


    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault()
                el.scrollLeft += e.deltaY
            }
        }

        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [])


    const iconMapping = {
        "beauty": "fa-solid fa-wand-magic-sparkles",
        "fragrances": "fa-solid fa-spray-can",
        "furniture": "fa-solid fa-couch",
        "groceries": "fa-solid fa-basket-shopping",
        "home decoration": "fa-solid fa-paint-roller",
        "kitchen accessories": "fa-solid fa-utensils",
        "laptops": "fa-solid fa-laptop",
        "mens shirts": "fa-solid fa-shirt",
        "mens shoes": "fa-solid fa-shoe-prints",
        "mens watches": "fa-solid fa-clock",
        "mobile accessories": "fa-solid fa-mobile",
        "motorcycle": "fa-solid fa-motorcycle",
        "skin care": "fa-solid fa-seedling",
        "smartphones": "fa-solid fa-mobile-screen",
        "sports accessories": "fa-solid fa-football",
        "sunglasses": "fa-solid fa-glasses",
        "tablets": "fa-solid fa-tablet",
        "tops": "fa-solid fa-tshirt",
        "vehicle": "fa-solid fa-car",
        "womens bags": "fa-solid fa-bag-shopping",
        "womens dresses": "fa-solid fa-female",
        "womens jewellery": "fa-solid fa-gem",
        "womens shoes": "fa-solid fa-shoe-prints",
        "womens watches": "fa-solid fa-clock"
    };

    return (
        <div>

            <div className='category'>
                <h2 className='fw-semibold mt-5'>Categories</h2>
                <div className="mb-5 cate-hori-scrl-box" ref={scrollRef}>
                    {categories.map((category) => (
                        <Link className='text-decoration-none' style={{ color: '#343a40' }} key={category} to={`/category/${category.toLowerCase().replace(/\s+/g, '-').trim()}`}>
                            <div className="d-inline-block">
                                <div className="text-center cate-cir-r">
                                    <div className='d-block'>
                                        <i className={`${iconMapping[category]} fs-1`}></i>
                                        <h6 className='fw-semibold'>{category}</h6>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    )
}
