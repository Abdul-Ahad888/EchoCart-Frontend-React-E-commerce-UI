import axios from "axios"
import { createContext, useEffect } from "react"
import { useState } from "react"

export const WishlistContext = createContext()

export default function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([])

    const getAuthHeaders = () => {
        const token = localStorage.getItem("authToken");
        return { headers: { Authorization: `Bearer ${token}` } };
    };


    const fetchWishlist = async () => {
        try {
            const res = await axios.get("https://echo-cart-back-end.vercel.app/api/v1/wishlist", getAuthHeaders());
            setWishlist(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const addToWishlist = async (product) => {
        try {
            const res = await axios.post(
                "https://echo-cart-back-end.vercel.app/api/v1/wishlist",
                { productId: product.id },
                getAuthHeaders()
            );
            fetchWishlist()
        } catch (err) {
            console.error("Wishlist error:", err.response?.data || err.message);
        }
    };

    const removeWishlist = async (productId) => {
        try {
            await axios.delete(
                `https://echo-cart-back-end.vercel.app/api/v1/wishlist/${productId}`,
                getAuthHeaders()
            );

            fetchWishlist()
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
} 