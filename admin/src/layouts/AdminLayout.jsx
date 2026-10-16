import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
    const token = localStorage.getItem("medical-admin-token");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-layout">
            <Sidebar />

            <div className="admin-layout-content">
                <Outlet />
            </div>
        </div>
    );
}
