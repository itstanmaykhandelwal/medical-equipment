import { useState, useRef, useEffect, useCallback } from "react";
import {
    ChevronDown,
    Menu,
    X,
    ShoppingCart,
    UserRound,
    Heart,
    Package,
    MapPin,
    LogIn,
    UserPlus,
    LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import "./Header.css";
import Logo from "../../assets/images/logo.png";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Product", path: "/products" },
    { label: "Contact", path: "/contact" },
];

function Header() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const profileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();

    const syncAuthState = useCallback(() => {
        const loggedIn =
            localStorage.getItem("medical-user-logged-in") === "true";

        setIsLoggedIn(loggedIn);

        try {
            const savedUser = localStorage.getItem("medical-current-user");
            setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
        } catch {
            setCurrentUser(null);
        }

        if (!loggedIn) {
            setProfileDropdown(false);
        }
    }, []);

    // Login, logout aur profile updates ke baad header sync karo.
    useEffect(() => {
        syncAuthState();
    }, [location.pathname, syncAuthState]);

    useEffect(() => {
        const handleAuthUpdate = () => syncAuthState();
        const handleStorageChange = (event) => {
            if (
                !event ||
                event.key === null ||
                ["medical-user-logged-in", "medical-current-user"].includes(
                    event.key,
                )
            ) {
                syncAuthState();
            }
        };

        window.addEventListener("auth-updated", handleAuthUpdate);
        window.addEventListener("profile-updated", handleAuthUpdate);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("auth-updated", handleAuthUpdate);
            window.removeEventListener("profile-updated", handleAuthUpdate);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [syncAuthState]);

    // Dropdown ke bahar click karne par close karo.
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Route change par mobile menu close karo.
    useEffect(() => {
        setMobileMenu(false);
        setProfileDropdown(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("medical-user-logged-in");
        localStorage.removeItem("medical-current-user");

        setIsLoggedIn(false);
        setCurrentUser(null);
        setProfileDropdown(false);
        setMobileMenu(false);

        window.dispatchEvent(new Event("auth-updated"));
        navigate("/");
    };

    const closeMobileMenu = () => setMobileMenu(false);

    const displayName = currentUser?.name?.trim() || "My Account";

    return (
        <header className="site-header">
            <div className="header-container">
                {/* Logo */}
                <Link
                    to="/"
                    className="site-logo"
                    onClick={closeMobileMenu}
                    aria-label="Go to homepage"
                >
                    <img src={Logo} alt="Medical Equipment" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="desktop-nav" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <div className="nav-item" key={item.label}>
                            <Link to={item.path}>{item.label}</Link>
                        </div>
                    ))}
                </nav>

                {/* Header Actions */}
                <div className="header-actions">
                    {/* Wishlist */}
                    <Link
                        to="/wishlist"
                        className="header-icon-link"
                        aria-label="Wishlist"
                        title="Wishlist"
                    >
                        <Heart size={21} strokeWidth={1.8} />
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="header-icon-link header-cart-link"
                        aria-label={`Shopping cart, ${cartCount} items`}
                        title="Shopping Cart"
                    >
                        <ShoppingCart size={22} strokeWidth={1.8} />

                        {cartCount > 0 && (
                            <span className="header-cart-count">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile or Login */}
                    {isLoggedIn ? (
                        <div className="header-profile" ref={profileRef}>
                            <button
                                type="button"
                                className="header-profile-btn"
                                onClick={() =>
                                    setProfileDropdown((previous) => !previous)
                                }
                                aria-expanded={profileDropdown}
                                aria-label="Open profile menu"
                            >
                                <UserRound size={21} strokeWidth={1.8} />
                                <ChevronDown size={16} />
                            </button>

                            {profileDropdown && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-heading">
                                        <strong>{displayName}</strong>
                                        <span>
                                            {currentUser?.email ||
                                                "Welcome back!"}
                                        </span>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() =>
                                            setProfileDropdown(false)
                                        }
                                    >
                                        <UserRound size={17} />
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/my-orders"
                                        onClick={() =>
                                            setProfileDropdown(false)
                                        }
                                    >
                                        <Package size={17} />
                                        My Orders
                                    </Link>

                                    <Link
                                        to="/addresses"
                                        onClick={() =>
                                            setProfileDropdown(false)
                                        }
                                    >
                                        <MapPin size={17} />
                                        My Addresses
                                    </Link>

                                    <button
                                        type="button"
                                        className="profile-logout-btn"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="header-auth-actions">
                            <Link to="/login" className="header-login-btn">
                                Login
                            </Link>

                            <Link to="/signup" className="header-signup-btn">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenu((previous) => !previous)}
                    aria-label={mobileMenu ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenu}
                >
                    {mobileMenu ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${mobileMenu ? "active" : ""}`}>
                {navItems.map((item) => (
                    <Link
                        to={item.path}
                        key={item.label}
                        onClick={closeMobileMenu}
                    >
                        {item.label}
                    </Link>
                ))}

                <Link to="/wishlist" onClick={closeMobileMenu}>
                    <Heart size={17} />
                    Wishlist
                </Link>

                <Link to="/cart" onClick={closeMobileMenu}>
                    <ShoppingCart size={17} />
                    Cart {cartCount > 0 && `(${cartCount})`}
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/profile" onClick={closeMobileMenu}>
                            <UserRound size={17} />
                            My Profile
                        </Link>

                        <Link to="/my-orders" onClick={closeMobileMenu}>
                            <Package size={17} />
                            My Orders
                        </Link>

                        <Link to="/addresses" onClick={closeMobileMenu}>
                            <MapPin size={17} />
                            My Addresses
                        </Link>

                        <button
                            type="button"
                            className="mobile-logout-btn"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </>
                ) : (
                    <div className="mobile-auth-actions">
                        <Link to="/login" onClick={closeMobileMenu}>
                            <LogIn size={17} />
                            Login
                        </Link>

                        <Link to="/signup" onClick={closeMobileMenu}>
                            <UserPlus size={17} />
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
