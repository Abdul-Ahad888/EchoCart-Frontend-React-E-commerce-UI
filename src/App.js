import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createContext, useState } from 'react';
import './App.css';
import Layout from './components/Layouts/Layout';
import Home from './components/Home';
import ViewProduct from './components/ViewProduct';
import CategoryDetail from './components/CategoryDetail';
import SearchProducts from './components/SearchProducts';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import MyProfile from './components/Profile/MyProfile';
import MyOrders from './components/Profile/MyOrders';
import WishList from './components/Profile/Wishlist';
import Coupons from './components/Profile/Coupons';
import Reviews from './components/Profile/Reviews';
import ChangePass from './components/ChangePass';
// import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Users from './components/admin/Users';
import Products from './components/admin/Products';
import CreateProduct from './components/admin/CreateProduct';
import EditProduct from './components/admin/EditProduct';

// Owner
import OwnerLayout from './components/owner/OwnerLayout';
import OwnerDashboard from './components/owner/Dashboard';
import OwnerUsers from './components/owner/Users';
import OwnerProducts from './components/owner/Products';
import OwnerCreateProduct from './components/owner/CreateProduct';
import OwnerEditProduct from './components/owner/EditProduct';

import ProtectedRoute from './components/ProtectedRoute';



export const SearchContext = createContext()

function App() {

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <BrowserRouter>
          <Routes>

            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='product/:id' element={<ViewProduct />} />
              <Route path='category/:categoryName' element={<CategoryDetail />} />
              <Route path='/search' element={<SearchProducts />}></Route>
            </Route>

            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/change-password' element={<ChangePass />}></Route>

            <Route path='/cart' element={<ProtectedRoute> <Cart/> </ProtectedRoute>}></Route>

            <Route path='/profile/my-profile' element={<ProtectedRoute> <MyProfile/> </ProtectedRoute>}></Route>
            <Route path='/profile/my-orders' element={<ProtectedRoute> <MyOrders/> </ProtectedRoute>}></Route>
            <Route path='/profile/wishlist' element={<ProtectedRoute> <WishList/> </ProtectedRoute>}></Route>
            <Route path='/profile/coupons' element={<ProtectedRoute> <Coupons/> </ProtectedRoute>}></Route>
            <Route path='/profile/reviews' element={<ProtectedRoute> <Reviews/> </ProtectedRoute>}></Route>

            <Route path='/cart/success' element={<ProtectedRoute> <PaymentSuccess/> </ProtectedRoute>}></Route>

            {/* Admin */}
            <Route path='/admin' element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminLayout/> </ProtectedRoute>}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='users' element={<Users />} />
              <Route path='products' element={<Products />} />
              <Route path='products/create-product' element={<CreateProduct />} />
              <Route path='products/edit-product/:id' element={<EditProduct />} />
            </Route>

            {/* Owner */}
            <Route path='/owner' element={ <ProtectedRoute allowedRoles={["owner"]}> <OwnerLayout/> </ProtectedRoute>}>
              <Route path='dashboard' element={<OwnerDashboard />} />
              <Route path='users' element={<OwnerUsers />} />
              <Route path='products' element={<OwnerProducts />} />
              <Route path='products/create-product' element={<OwnerCreateProduct />} />
              <Route path='products/edit-product/:id' element={<OwnerEditProduct />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </SearchContext.Provider>
    </>
  );
}

export default App;
