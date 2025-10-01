import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../components/context/CartContext'

export default function ProductCard({ product }) {

    // Add To Cart
    const { addToCart } = useContext(CartContext)

    // Removing After Decimal Number From Discount.
    const discount = Math.floor(product.discountPercentage);
    // Discounted Price Formula And Decimal Is Fixed To (2). 
    const discountedPrice = (product.price - product.price * discount / 100).toFixed(2)

    let display;
    let discountDisplay;
    let actPriceDisplay;

    if (discount <= 1) {
        display = "none"
        discountDisplay = "none"
        actPriceDisplay = "block"
    } else {
        display = "flex"
        discountDisplay = "block"
        actPriceDisplay = "none"
    }

    return (

        <div key={product.id}>
            <Link className='text-decoration-none' to={`/product/${product.id}`}>
                <div style={{ '--content': `"${discount}%"`, '--display': display }} className="card border-0 p-2 prod-card-deg" >
                    <button className='border-0 bg-transparent' onClick={(e) => {
                        e.preventDefault(); 
                        addToCart(product)
                    }}>
                        <div className='prod-add'>
                            <i className='fa fa-cart-plus'></i>
                        </div>
                    </button>

                    <div className="prod-img-container">
                        <img className='prod-img' src={product.thumbnail} alt={product.title} />
                    </div>

                    <div className="p-2">
                        <small className='text-truncate d-block'>{product.title}</small>

                        <div style={{ display: actPriceDisplay }} className='no-discount mt-3'>
                            <h5 className='fw-semibold'>$ {product.price}</h5>
                        </div>

                        <div style={{ display: discountDisplay }} className="discounted mt-3">
                            <h5 className='fw-semibold m-0' style={{ color: "#de7127" }}>$ {discountedPrice}</h5>
                            <small className='text-black text-decoration-line-through'>$ {product.price}</small>
                        </div>
                    </div>
                </div>
            </Link>
        </div>

    )
}
