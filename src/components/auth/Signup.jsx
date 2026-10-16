import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserRound,
    Mail,
    Phone,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

import "./Login.css";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();
        const phone = form.phone.trim();
        const password = form.password;
        const confirmPassword = form.confirmPassword;

        if (!name || !email || !phone || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!/^[0-9+\-\s()]{10,20}$/.test(phone)) {
            setError("Please enter a valid phone number.");
            return;
        }

        if (name.length < 2 || name.length > 80) {
            setError("Name must be between 2 and 80 characters.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const apiUrl =
                import.meta.env.VITE_API_URL || "http://localhost:5001";

            const response = await fetch(`${apiUrl}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to create account.");
                return;
            }

            navigate("/login", {
                state: {
                    message: "Account created successfully. Please log in.",
                    email,
                },
            });
        } catch (error) {
            console.error("Signup error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container signup-container">
                <section className="auth-card signup-card">
                    <div className="auth-heading">
                        <span className="auth-icon">
                            <UserRound size={25} />
                        </span>

                        <h1>Create Account</h1>

                        <p>
                            Sign up to manage your orders and account details.
                        </p>
                    </div>

                    <form
                        className="auth-form signup-form"
                        onSubmit={handleSubmit}
                    >
                        {error && (
                            <div className="auth-error" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="signup-name">Full Name</label>

                            <div className="auth-input-wrapper">
                                <UserRound size={19} />

                                <input
                                    id="signup-name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    maxLength={100}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="signup-email">Email Address</label>

                            <div className="auth-input-wrapper">
                                <Mail size={19} />

                                <input
                                    id="signup-email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="signup-phone">Phone Number</label>

                            <div className="auth-input-wrapper">
                                <Phone size={19} />

                                <input
                                    id="signup-phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength={20}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="signup-password">Password</label>

                            <div className="auth-input-wrapper">
                                <LockKeyhole size={19} />

                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="signup-confirm-password">
                                Confirm Password
                            </label>

                            <div className="auth-input-wrapper">
                                <LockKeyhole size={19} />

                                <input
                                    id="signup-confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous,
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}

                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>
                    </p>

                    <Link to="/products" className="auth-back-link">
                        Continue browsing products
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default Signup;
