import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const CartContext = createContext()

export default function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([])
    const [delivery, setDelivery] = useState("Standard Delivery - 2$");
    const [discountPercent, setDiscountPercent] = useState(0);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken')
        return {
            headers: { Authorization: `Bearer ${token}` }
        }
    }

    const loadCart = async () => {
        try {
            const res = await axios.get(`https://echo-cart-back-end.vercel.app/api/v1/cart`, getAuthHeaders());
            const normalized = res.data.map(item => ({
                ...item,
                product: item.product || item.Product
            }));
            setCartItems(normalized);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCart()
    }, [])

 // inside CartContext (replace your addToCart)
const addToCart = async (product, quantity = 1) => {
    if (!product) {
      console.error("addToCart called with undefined product");
      return;
    }
  
    // guard
    if (product.stock <= 0) return;
  
    // find existing (normalize both shapes just in case)
    const existingItem = cartItems.find(
      (item) => (item.product?.id || item.Product?.id) === product.id
    );
  
    // if updating an existing cart item
    if (existingItem) {
      // optimistic update: keep prev for rollback
      const prevItems = [...cartItems];
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === existingItem.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      );
  
      try {
        await axios.put(
          `https://echo-cart-back-end.vercel.app/api/v1/cart/${existingItem.id}`,
          { quantity: existingItem.quantity + quantity },
          getAuthHeaders()
        );
        // success -> refresh server copy to ensure full sync (optional)
        await loadCart();
      } catch (err) {
        console.error("Failed to update cart item:", err);
        // rollback
        setCartItems(prevItems);
        // fallback: reload from server
        await loadCart();
      }
      return;
    }
  
    // else: adding a new item
    if (quantity > product.stock) return;
  
    // make a temp item to show immediately (use "product" lowercase)
    const tempId = `temp-${Date.now()}`;
    const tempItem = { id: tempId, quantity, product };
  
    setCartItems((prev) => [...prev, tempItem]);
  
    try {
      // create on server
      await axios.post(
        `https://echo-cart-back-end.vercel.app/api/v1/cart`,
        { productId: product.id, quantity },
        getAuthHeaders()
      );
  
      // server created -> fetch fresh cart so shape is correct
      await loadCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // remove temp item on failure
      setCartItems((prev) => prev.filter((i) => i.id !== tempId));
      // optionally show an error toast to user
    }
  };
  

    const removeFromCart = async (cartItemId) => {

        setCartItems(prev => prev.filter(item => item.id !== cartItemId));

        try {
            await axios.delete(`https://echo-cart-back-end.vercel.app/api/v1/cart/${cartItemId}`, getAuthHeaders())
        }
        catch (err) {
            console.error(err)
            loadCart()
        }
    }

    const clearCart = async () => {
        try {

            await axios.delete('https://echo-cart-back-end.vercel.app/api/v1/cart', getAuthHeaders())
            setCartItems([])

        } catch (err) {
            console.error(err)
        }
    }

    const increaseQuantity = async (cartItemId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === cartItemId && item.quantity < item.product.stock
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )

        try {
            const item = cartItems.find(i => i.id === cartItemId)
            await axios.put(`https://echo-cart-back-end.vercel.app/api/v1/cart/${cartItemId}`, {
                quantity: item.quantity + 1
            }, getAuthHeaders())
        } catch (err) {
            console.error(err)
            loadCart()
        }
    }

    const decreaseQuantity = async (cartItemId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === cartItemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );

        try {
            const item = cartItems.find(i => i.id === cartItemId)
            if (item && item.quantity > 1) {
                await axios.put(`https://echo-cart-back-end.vercel.app/api/v1/cart/${cartItemId}`, {
                    quantity: item.quantity - 1
                }, getAuthHeaders())
            }
        } catch (err) {
            console.error(err)
            loadCart()
        }
    }

    return (
        <CartContext.Provider value={{ cartItems, loadCart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, delivery, setDelivery, discountPercent, setDiscountPercent }}>{children}</CartContext.Provider>
    )

}
