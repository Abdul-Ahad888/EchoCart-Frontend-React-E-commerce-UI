import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState("");
    const [categories, setCategories] = useState([]);

    const [tags, setTags] = useState([]);
    const [weight, setWeight] = useState("");
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("0");
    const [warrenty, setWarrenty] = useState("");
    const [shipping, setShipping] = useState("");
    const [returnPolicy, setReturnPolicy] = useState("");
    const [description, setDescription] = useState("");
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [brandName, setBrandName] = useState("");

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    const [imagesFiles, setImagesFiles] = useState([]);

    const [messageToast, setMessageToast] = useState(false);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(true);
    const [productCreationloader, setProductCreationloader] = useState(false);

    const token = localStorage.getItem("authToken");


    // 🔹 Fetch product data for edit
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                console.log(data)
                if (res.ok) {
                    setProductName(data.title);
                    setDescription(data.description);
                    setCategory(data.category);
                    setBrandName(data.brand);
                    setPrice(data.price);
                    setDiscount(data.discountPercentage);
                    setStock(data.stock);
                    setWeight(data.weight);
                    setWarrenty(data.warrantyInformation);
                    setShipping(data.shippingInformation);
                    setReturnPolicy(data.returnPolicy);
                    setTags(data.tags || []);
                    setThumbnailUrl(data.thumbnail);
                    setThumbnailPreview(data.thumbnail);

                } else {
                    console.log("Error fetching product", data.msg);
                }
            } catch (err) {
                console.error("Error loading product", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch(`https://echo-cart-back-end.vercel.app/api/v1/products`);
                const data = await res.json();
                const uniqueCategories = [
                    ...new Set(data.products.map((p) => p.category.toLowerCase())),
                ];
                setCategories(uniqueCategories);
            } catch (err) {
                console.error("error while fetching categories", err);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id, token]);


    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file)); // show preview
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "," || tags.length > 4) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag) && tags.length < 5) {
                setTags([...tags, newTag]);
            }
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleNumberChange = (e, setter, max) => {
        let value = e.target.value;
        if (value === "") {
            setter("");
            return;
        }
        value = Number(value);
        if (value > max) value = max;
        if (value < 0) value = 0;
        setter(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!productName.trim()) newErrors.productName = "Product name is required";
        if (!brandName.trim()) newErrors.brandName = "Brand name is required";
        if (!category) newErrors.category = "Category is required";
        if (!description.trim()) newErrors.description = "Description cannot be empty";
        if (!price || price <= 0) newErrors.price = "Price must be greater than 0";
        if (discount < 0 || discount > 100)
            newErrors.discount = "Discount must be between 0 and 100";
        if (!stock || stock < 1) newErrors.stock = "Stock must be at least 1";
        if (!weight || weight <= 0) newErrors.weight = "Weight must be greater than 0";
        if (!tags || tags.length === 0) newErrors.tags = "At least one tag is required";
        if (!warrenty) newErrors.warrenty = "Please select warranty";
        if (!shipping) newErrors.shipping = "Please select shipping option";
        if (!returnPolicy) newErrors.returnPolicy = "Please select return policy";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const formData = new FormData();
        formData.append("title", productName);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("brand", brandName);
        formData.append("price", price);
        formData.append("discountPercentage", discount);
        formData.append("stock", stock);
        formData.append("weight", weight);
        formData.append("warrantyInformation", warrenty);
        formData.append("shippingInformation", shipping);
        formData.append("returnPolicy", returnPolicy);
        formData.append("tags", JSON.stringify(tags));

        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        }

        imagesFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            setProductCreationloader(true);

            const res = await fetch(`https://echo-cart-back-end.vercel.app/api/v1/products/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessageToast(true);
                setTimeout(() => {
                    setMessageToast(false);
                    navigate("/admin/products");
                }, 2000);
            } else {
                console.log(data.msg);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProductCreationloader(false);
        }
    };

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "40vh" }}
            >
                <div className="loadmore-spinner"></div>
            </div>
        );
    }

    return (
        <>

            {productCreationloader && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,0.6)", zIndex: "9999" }}
                >
                    <div
                        className="spinner-border"
                        style={{ width: "5rem", height: "5rem", color: "#de7127" }}
                        role="status"
                    >
                        <span className="visually-hidden">Updating Product...</span>
                    </div>
                </div>
            )}

            {messageToast && (
                <div
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    class="toast position-fixed d-block z-3"
                    style={{ bottom: "10px", right: "10px" }}
                    data-bs-autohide="false"
                >
                    <div class="toast-header">
                        <strong class="me-auto">EchoCart</strong>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="toast-body">Product Has Been Updated.</div>
                </div>
            )}


            <div className="container-fluid p-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link
                                to="/admin/products"
                                className="text-black text-decoration-none"
                            >
                                Products
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Edit Product
                        </li>
                    </ol>
                </nav>

                {/* Page Header */}
                <div className="create-product-header mt-4">
                    <h3 className="my-0">Edit Your Product</h3>
                    <small className="text-muted">Update your product.</small>
                </div>

                <div className="row mt-4">

                    <div className="col-12 col-md-4">
                        <div className="card product-card-shadow border-0 rounded-3">

                            {/* Card Header */}
                            <div className="card-header bg-white fw-semibold fs-5 py-3">
                                Product Image
                            </div>

                            {/* Card Body */}
                            <div className="card-body pt-4">
                                {/* Thumbnail Upload Box */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Thumbnail</label>
                                    <div
                                        className="border border-2 border-dashed rounded d-flex flex-column align-items-center justify-content-center"
                                        style={{ height: "280px", cursor: "pointer" }}
                                        onClick={() => document.getElementById("thumbnailInput").click()}
                                    >
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ width: "100%", maxHeight: "278px", objectFit: "cover" }} />
                                        ) : (
                                            <span className="text-muted">Add Image</span>
                                        )}
                                    </div>

                                    <input
                                        id="thumbnailInput"
                                        type="file"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleThumbnailChange} />
                                    {errors.thumbnail && <div className="invalid-feedback d-block">{errors.thumbnail}</div>}

                                </div>

                                {/* Tags Input */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Tags</label>
                                    <div className={`form-control d-flex flex-wrap gap-2 align-items-center py-2 ${errors.tags ? "is-invalid" : ""}`}>
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="rounded-pill bg-transparent border border-1 text-black px-3 py-1 d-flex align-items-center"
                                                style={{ fontSize: "0.85rem" }}>{tag}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-black btn-sm ms-2"
                                                    onClick={() => removeTag(tag)}
                                                    style={{ fontSize: "0.6rem" }}
                                                ></button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            className="border-0 flex-grow-1 bg-transparent"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={tags.length >= 5}
                                            style={{ outline: "none", minWidth: "120px" }}
                                        />
                                    </div>
                                    {errors.tags && <div className="invalid-feedback d-block">{errors.tags}</div>}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-12 col-md-8">
                        <div className="card product-card-shadow border-0 rounded-3">
                            {/* Card Header */}
                            <div className="card-header bg-white fw-semibold fs-5 py-3">
                                Product Details
                            </div>

                            {/* Card Body */}
                            <div className="card-body pt-4">
                                <div className="row g-3">

                                    {/* Brand Name */}
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="brandName" className="form-label fw-semibold">
                                                Brand Name
                                            </label>
                                            <input type="text" id="brandName" className={`form-control ${errors.brandName ? "is-invalid" : ""}`} placeholder="Enter brand name" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                                            {errors.brandName && <div className="invalid-feedback">{errors.brandName}</div>}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label fw-semibold">
                                                Category
                                            </label>
                                            <select id="category" className={`form-select ${errors.category ? "is-invalid" : ""}`} value={category} onChange={(e) => setCategory(e.target.value)} >
                                                <option value="" disabled>Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && <div className="invalid-feedback">{errors.category}</div>}

                                        </div>
                                    </div>

                                    {/* Title / Description */}
                                    <div className="col-12">

                                        <div className="mb-4">
                                            <label htmlFor="productName" className="form-label fw-semibold">
                                                Product Name
                                            </label>
                                            <input type="text" id="productName" className={`form-control ${errors.productName ? "is-invalid" : ""}`} placeholder="Enter Product Name"
                                                value={productName} onChange={(e) => setProductName(e.target.value)} />
                                            {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="productDescription" className="form-label fw-semibold">
                                                Product Description
                                            </label>
                                            <textarea id="productDescription" className={`form-control ${errors.description ? "is-invalid" : ""}`} maxLength={800}
                                                style={{ minHeight: "150px" }} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                        </div>

                                    </div>

                                    {/* Warrenty / Shipping / Return */}
                                    <div className="col-12 col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="warrenty" className="form-label fw-semibold">Warrenty</label>
                                            <select id="warrenty" className={`form-select ${errors.warrenty ? "is-invalid" : ""}`} defaultValue="" value={warrenty} onChange={(e) => setWarrenty(e.target.value)}>
                                                <option value="" disabled> Select Warrenty </option>
                                                <option value="No Warrenty"> No Warrenty </option>
                                                <option value="1 Month Warrenty"> 1 Month Warrenty </option>
                                                <option value="6 Month Warrenty"> 6 Months Warrenty </option>
                                                <option value="1 Year Warrenty"> 1 Year Warrenty </option>
                                                <option value="2 Year Warrenty"> 2 Years Warrenty </option>
                                                <option value="3 Year Warrenty"> 3 Years Warrenty </option>
                                                <option value="5 Year Warrenty"> 5 Years Warrenty </option>
                                            </select>
                                            {errors.warrenty && <div className="invalid-feedback">{errors.warrenty}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="shipping" className="form-label fw-semibold">Shipping</label>
                                            <select id="shipping" className={`form-select ${errors.shipping ? "is-invalid" : ""}`} defaultValue="" value={shipping} onChange={(e) => setShipping(e.target.value)}>
                                                <option value="" disabled> Select Shipping </option>
                                                <option value="1 Bussiness Day"> 1 Bussiness Day </option>
                                                <option value="1-3 Bussiness Day"> 1-3 Bussiness Days </option>
                                                <option value="3-5 Bussiness Day"> 3-5 Bussiness Days </option>
                                                <option value="5-7 Bussiness Day"> 5-7 Bussiness Days </option>
                                                <option value="7-10 Bussiness Day"> 7-10 Bussiness Days </option>
                                                <option value="10-15 Bussiness Day"> 10-15 Bussiness Days </option>
                                                <option value="15-30 Bussiness Day"> 15-30 Bussiness Days </option>
                                            </select>
                                            {errors.shipping && <div className="invalid-feedback">{errors.shipping}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="returnPolicy" className="form-label fw-semibold">Return Policy</label>
                                            <select id="returnPolicy" className={`form-select ${errors.returnPolicy ? "is-invalid" : ""}`} defaultValue="" value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)}>
                                                <option value="" disabled> Select Return Policy </option>
                                                <option value="No Return Policy"> No Return Policy </option>
                                                <option value="1 Day"> 1 Day Return Policy </option>
                                                <option value="3Days"> 3 Days Return Policy </option>
                                                <option value="7Days"> 7 Days Return Policy </option>
                                                <option value="10 Days"> 10 Days Return Policy </option>
                                                <option value="15 Days"> 15 Days Return Policy </option>
                                                <option value="30 Days"> 30 Days Return Policy </option>
                                            </select>
                                            {errors.returnPolicy && <div className="invalid-feedback">{errors.returnPolicy}</div>}
                                        </div>
                                    </div>

                                    {/* Weight / Stock */}
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="brandName" className="form-label fw-semibold">
                                                Weight
                                            </label>
                                            <input type="number" id="weight" className={`form-control ${errors.weight ? "is-invalid" : ""}`} placeholder="Enter product weight" value={weight} onChange={(e) => handleNumberChange(e, setWeight, 100000)} />
                                            {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="brandName" className="form-label fw-semibold">
                                                Stock
                                            </label>
                                            <input type="number" id="stock" className={`form-control ${errors.stock ? "is-invalid" : ""}`} placeholder="Enter stock quantity" value={stock} onChange={(e) => handleNumberChange(e, setStock, 100000)} />
                                            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="card product-card-shadow border-0 rounded-3 mt-4">
                            {/* Card Header */}
                            <div className="card-header bg-white fw-semibold fs-5 py-3">
                                Product Pricing
                            </div>

                            {/* Card Body */}
                            <div className="card-body pt-4">
                                <div className="row g-3">

                                    {/* Product Price */}
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label fw-semibold">
                                                Price
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                                    placeholder="Enter Product Price"
                                                    value={price}
                                                    onChange={(e) => handleNumberChange(e, setPrice, 1000000)}
                                                />
                                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}

                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Discount Percentage */}
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="discount" className="form-label fw-semibold">
                                                Discount
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    id="discount"
                                                    className="form-control"
                                                    placeholder="Enter Discount Percentage"
                                                    value={discount}
                                                    onChange={(e) => handleNumberChange(e, setDiscount, 100)}
                                                />
                                                <span className="input-group-text">%</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="text-end mt-4">
                            <button className="btn btn-theme-fill py-1" onClick={handleSubmit}><i className="fa fa-plus me-2"></i> Update Product</button>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
