import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Logo from "../../assets/images/logo.png";

const navItems = [
    {
        label: "Home",
        path: "/",
    },
    {
        label: "Product",
        path: "/products",
    },
    // {
    //     label: "Pages",
    //     path: "#",
    //     dropdown: true,
    // },
    {
        label: "Contact",
        path: "/contact",
    },
    // {
    //     label: "Blog",
    //     path: "#",
    //     dropdown: true,
    // },
];

function Header() {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <header className="site-header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="site-logo">
                    <img src={Logo} alt="Logo" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    {navItems.map((item) => (
                        <div
                            className={`nav-item ${item.dropdown ? "has-dropdown" : ""}`}
                            key={item.label}
                        >
                            <Link to={item.path}>
                                {item.label}

                                {item.dropdown && (
                                    <ChevronDown size={17} strokeWidth={1.8} />
                                )}
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* CTA */}
                <Link to="/contact" className="header-btn">
                    GET QUOTES
                </Link>

                {/* Mobile Button */}
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenu((prev) => !prev)}
                    aria-label="Toggle menu"
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
                        onClick={() => setMobileMenu(false)}
                    >
                        {item.label}
                    </Link>
                ))}

                <Link
                    to="/contact"
                    className="mobile-quote-btn"
                    onClick={() => setMobileMenu(false)}
                >
                    GET QUOTES
                </Link>
            </div>
        </header>
    );
}

export default Header;
