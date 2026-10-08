import { ArrowRight, Mail } from "lucide-react";

import "./Footer.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                {/* ---------------------------------
            Company Info
        --------------------------------- */}

                <div className="footer-company">
                    <Link to="/" className="footer-logo">
                        <img src={Logo} alt="Logo" />
                    </Link>

                    <p className="footer-description">
                        Providing reliable and high-quality medical equipment
                        designed to support healthcare professionals and improve
                        patient care.
                    </p>

                    <div className="footer-socials">
                        <a href="#" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.66.34-1 1-1Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>

                        <a href="#" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="5"
                                    ry="5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                                <circle
                                    cx="17.5"
                                    cy="6.5"
                                    r="1"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>

                        <a href="#" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M6 8H3V21H6V8ZM4.5 3C3.67 3 3 3.67 3 4.5S3.67 6 4.5 6 6 5.33 6 4.5 5.33 3 4.5 3ZM21 13.5C21 9.91 19.09 8 16.25 8C14.64 8 13.55 8.87 13 9.67V8H10V21H13V14.5C13 12.79 13.5 11 15.25 11C16.97 11 17 12.6 17 14.5V21H20V13.5H21Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* ---------------------------------
            Our Pages
        --------------------------------- */}

                <div className="footer-column">
                    <h3>Our Pages</h3>

                    <ul>
                        <li>
                            <a href="/">
                                <ArrowRight size={17} />
                                <span>Home</span>
                            </a>
                        </li>

                        <li>
                            <a href="/about">
                                <ArrowRight size={17} />
                                <span>About</span>
                            </a>
                        </li>

                        <li>
                            <a href="/products">
                                <ArrowRight size={17} />
                                <span>Products</span>
                            </a>
                        </li>

                        <li>
                            <a href="/contact">
                                <ArrowRight size={17} />
                                <span>Contact</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* ---------------------------------
            Useful Links
        --------------------------------- */}

                <div className="footer-column">
                    <h3>Useful Links</h3>

                    <ul>
                        <li>
                            <a href="#">
                                <ArrowRight size={17} />
                                <span>FAQ</span>
                            </a>
                        </li>

                        <li>
                            <a href="#">
                                <ArrowRight size={17} />
                                <span>Privacy Policy</span>
                            </a>
                        </li>

                        <li>
                            <a href="#">
                                <ArrowRight size={17} />
                                <span>Terms & Conditions</span>
                            </a>
                        </li>

                        <li>
                            <a href="#">
                                <ArrowRight size={17} />
                                <span>Return Policy</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* ---------------------------------
            Newsletter
        --------------------------------- */}

                <div className="footer-newsletter">
                    <h3>Subscribe Our Newsletter</h3>

                    <p>
                        Subscribe to our newsletter and get the latest updates
                        about our products and services.
                    </p>

                    <form className="footer-form">
                        <label htmlFor="footer-email">
                            EMAIL ADDRESS <span>*</span>
                        </label>

                        <div className="footer-input">
                            <div className="footer-input-icon">
                                <Mail size={19} />
                            </div>

                            <input
                                id="footer-email"
                                type="email"
                                placeholder="Email Address"
                                required
                            />
                        </div>

                        <button type="submit">SUBMIT</button>
                    </form>
                </div>
            </div>

            {/* ---------------------------------
          Copyright
      --------------------------------- */}

            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p>
                        © Copyright 2025 by Medical Equipment. All Rights
                        Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
