import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartPreviewer from './CartPreviewer';

export default function Layout() {
    const [isCartVisible, setIsCartVisible] = useState(false);
    const toggleCart = () => {
        setIsCartVisible(!isCartVisible);
    };

    if(isCartVisible){
        document.body.classList.add('no-scroll')
    }
    else{
        document.body.classList.remove('no-scroll')
    }

    return (
        <div>
            <Header toggleCart={toggleCart} />
            <CartPreviewer closeCart={() => setIsCartVisible(false)} isCartVisible={isCartVisible} />
            <Outlet />
            <Footer />
        </div>
    );
}
