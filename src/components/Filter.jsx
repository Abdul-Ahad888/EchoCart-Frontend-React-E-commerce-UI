import React, { useEffect, useState } from 'react'
import ReactSlider from 'react-slider';

export default function Filter({ categoryData, setFilteredProducts }) {

    const [rangeValue, setRangeValue] = useState([0, 50000]);
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedDiscount, setSelectedDiscount] = useState('all')
    const [selectedWarranty, setselectedWarranty] = useState('all')
    const [selectedRating, setSelectedRating] = useState('all')



    // Brand Filter
    const handleBrandChange = (brand) => {
        setSelectedBrands((prevSelectedBrand) =>
            prevSelectedBrand.includes(brand) ? prevSelectedBrand.filter((item) => item !== brand) : [...prevSelectedBrand, brand]
        )
    }

    // Discount Filter

    const handleDiscount = (discount) => {
        setSelectedDiscount(discount)
    }

    // Warranty Filter

    const handlewarranty = (warranty) => {
        setselectedWarranty(warranty)
    }

    // Rating Filter

    const handleRating = (rating) => {
        setSelectedRating(rating)
    }

    const convertToMonths = (warranty) => {
        const lowerCaseWarranty = warranty.toLowerCase();
        if (lowerCaseWarranty.includes("year")) {
            const years = parseInt(lowerCaseWarranty);
            return years * 12;
        }
    }



    // Filtered Products
    useEffect(() => {

        const filtered = categoryData.filter((product) => {

            const discount = Math.floor(product.discountPercentage);
            const discountedPrice = (product.price - product.price * discount / 100).toFixed(2);

            const isPriceRange = (product.price >= rangeValue[0] && product.price <= rangeValue[1]) && (discountedPrice >= rangeValue[0] && discountedPrice <= rangeValue[1]);

            const isBrandSelected = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

            const isDiscount = selectedDiscount === 'all' || (discount > 0 && (
                (selectedDiscount === '5%' && discount <= 5) ||
                (selectedDiscount === '10%' && discount <= 10) ||
                (selectedDiscount === '25%' && discount <= 25) ||
                (selectedDiscount === '50%' && discount <= 50)
            ))

            const warrantyInMonths = convertToMonths(product.warrantyInformation)
            const isWarranty = selectedWarranty === 'all' ||
                (selectedWarranty === '1-12' && warrantyInMonths <= '12') ||
                (selectedWarranty === '2' && warrantyInMonths > '12' && warrantyInMonths <= '24') ||
                (selectedWarranty === '+3' && warrantyInMonths >= '36')

                const rating = Math.floor(product.averageRating || 0);
                const isRating = selectedRating === 'all' ||
                  (selectedRating === '4 rating' && rating >= 4) ||
                  (selectedRating === '3 rating' && rating >= 3 && rating < 4) ||
                  (selectedRating === '2 rating' && rating >= 2 && rating < 3) ||
                  (selectedRating === '1 rating' && rating >= 1 && rating < 2);
                
            return isPriceRange && isBrandSelected && isDiscount && isWarranty && isRating
        });

        setFilteredProducts(filtered)

    }, [categoryData, rangeValue, selectedBrands, selectedDiscount, selectedWarranty, selectedRating, setFilteredProducts])

    return (
        <div className="product-filter">
            <h2 className="">Filters</h2>

            <div className="mt-5 my-4">
                <h6 className='fw-semibold'>Price:</h6>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">{rangeValue[0]}</span>
                    <span className="fw-bold">{rangeValue[1]}</span>
                </div>

                {/* Range Slider */}
                <ReactSlider
                    className="price-horizontal-slider"
                    thumbClassName="price-thumb"
                    trackClassName="price-track"
                    min={0}
                    max={50000}
                    value={rangeValue}
                    onChange={(value) => setRangeValue(value)}
                    pearling
                    minDistance={500}
                />

                {/* Custom Labels */}
                <div className="d-flex justify-content-between mt-2">
                    <small className="slider-label">Min</small>
                    <small className="slider-label">Max</small>
                </div>
            </div>

            <div className="my-4">
                <h6 className='fw-semibold'>Brands:</h6>
                <hr className='mb-4' />
                {categoryData.some((prod) => prod.brand) ? (
                    [...new Set(categoryData.map((prod) => prod.brand))].map((brand, index) => (
                        <div class="form-check m-0" key={index}>
                            <input class="form-check-input" type="checkbox" id={brand} onChange={() => handleBrandChange(brand)} />
                            <label class="form-check-label" for={brand}>
                                <p>{brand}</p>
                            </label>
                        </div>
                    ))
                ) : (
                    <p>No Brands Available</p>
                )}
            </div>

            <div className="my-4">
                <h6 className='fw-semibold'>Discount:</h6>
                <hr />
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='discount' onClick={() => handleDiscount('all')} checked={selectedDiscount === 'all'} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>All</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='discount' onClick={() => handleDiscount('5%')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>5% off or less</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='discount' onClick={() => handleDiscount('10%')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>10% off or less</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='discount' onClick={() => handleDiscount('25%')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>25% off or less</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='discount' onClick={() => handleDiscount('50%')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>50% off or less</p>
                    </label>
                </div>
            </div>

            <div className="my-4">
                <h6 className='fw-semibold'>Warranty:</h6>
                <hr />
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='warranty' onChange={() => handlewarranty('all')} checked={selectedWarranty === 'all'} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>All</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='warranty' onChange={() => handlewarranty('1-12')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>1 - 12 months</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='warranty' onChange={() => handlewarranty('2')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>2 year</p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" name='warranty' onChange={() => handlewarranty('+3')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>+ 3 year</p>
                    </label>
                </div>
            </div>

            <div className="my-4">
                <h6 className='fw-semibold'>Customer Rating's:</h6>
                <hr />
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" id="flexCheckDefault" name={'rating'} checked={selectedRating === 'all'} onChange={() => handleRating('all')} />
                    <label class="form-check-label" for="flexCheckDefault" defaultChecked >
                        <p>
                            <span>All</span>
                        </p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" id="flexCheckDefault" name={'rating'} onChange={() => handleRating('4 rating')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                        </p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" id="flexCheckDefault" name={'rating'} onChange={() => handleRating('3 rating')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                        </p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" id="flexCheckDefault" name={'rating'} onChange={() => handleRating('2 rating')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                        </p>
                    </label>
                </div>
                <div class="form-check m-0">
                    <input class="form-check-input" type="radio" id="flexCheckDefault" name={'rating'} onChange={() => handleRating('1 rating')} />
                    <label class="form-check-label" for="flexCheckDefault">
                        <p>
                            <i className='fa-solid fa-star text-warning ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                            <i className='fa-regular fa-star text-secondary ms-2 me-2' style={{ fontSize: "15px" }}></i>
                        </p>
                    </label>
                </div>
            </div>
        </div>
    )
}