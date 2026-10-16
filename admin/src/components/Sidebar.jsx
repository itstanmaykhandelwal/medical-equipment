import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Mail,
    LogOut,
} from "lucide-react";

const navItems = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        path: "/admin/products",
        icon: Package,
    },
    {
        label: "Orders",
        path: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        label: "Customers",
        path: "/admin/customers",
        icon: Users,
    },
    {
        label: "Contact Enquiries",
        path: "/admin/contacts",
        icon: Mail,
    },
];

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("medical-admin-token");
        navigate("/admin/login", { replace: true });
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-brand">
                <Package size={25} />
                <span>MedEquip Admin</span>
            </div>

            <nav className="admin-sidebar-nav">
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/admin/dashboard"}
                        className={({ isActive }) =>
                            `admin-nav-item ${isActive ? "active" : ""}`
                        }
                    >
                        <Icon size={19} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="admin-logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </aside>
    );
}
