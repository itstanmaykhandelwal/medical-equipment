import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import ContactEnquiries from "./pages/ContactEnquiries";
import AdminLayout from "./layouts/AdminLayout";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to admin login */}
                <Route
                    path="/"
                    element={<Navigate to="/admin/login" replace />}
                />

                {/* Admin Login */}
                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* Admin Dashboard Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route
                        index
                        element={
                            <Navigate
                                to="/admin/dashboard"
                                replace
                            />
                        }
                    />

                    {/* Dashboard */}
                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    {/* Products */}
                    <Route
                        path="products"
                        element={<Products />}
                    />

                    {/* Orders */}
                    <Route
                        path="orders"
                        element={<Orders />}
                    />

                    {/* Customers */}
                    <Route
                        path="customers"
                        element={<Customers />}
                    />

                    {/* Contact Enquiries */}
                    <Route
                        path="contacts"
                        element={<ContactEnquiries />}
                    />
                </Route>

                {/* Unknown routes */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/admin/dashboard"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
