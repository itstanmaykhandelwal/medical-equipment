import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import ProductDetailPage from "../pages/ProductDetail";
import Cart from "../components/cart/Cart";
import Checkout from "../components/checkout/Checkout";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import MyOrders from "../components/orders/MyOrders";
import Profile from "../components/profile/Profile";
import Addresses from "../components/addresses/Addresses";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/addresses" element={<Addresses />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
