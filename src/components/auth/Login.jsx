import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";

import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: location.state?.email || "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
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

        const email = form.email.trim().toLowerCase();
        const password = form.password;

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const apiUrl =
                import.meta.env.VITE_API_URL || "http://localhost:5001";

            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to log in. Please try again.");
                return;
            }

            if (!data.token || !data.user) {
                setError("Invalid server response. Please try again.");
                return;
            }

            // Save the authenticated session and basic user details.
            localStorage.setItem("medical-auth-token", data.token);
            localStorage.setItem("medical-user-logged-in", "true");
            localStorage.setItem(
                "medical-current-user",
                JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone || "",
                }),
            );

            // Notify the Header and other components.
            window.dispatchEvent(new Event("auth-updated"));

            const redirectPath = location.state?.from;

            if (
                typeof redirectPath === "string" &&
                redirectPath.startsWith("/") &&
                !redirectPath.startsWith("//")
            ) {
                navigate(redirectPath, { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(
                "Unable to connect to the server. Please check that the backend is running.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                <section className="auth-card">
                    <div className="auth-heading">
                        <span className="auth-icon">
                            <LockKeyhole size={25} />
                        </span>

                        <h1>Welcome Back</h1>

                        <p>Sign in to access your account and orders.</p>
                    </div>

                    {location.state?.message && (
                        <div className="auth-success" role="status">
                            {location.state.message}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="auth-error" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="login-email">Email Address</label>

                            <div className="auth-input-wrapper">
                                <Mail size={19} />

                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="login-password">Password</label>

                            <div className="auth-input-wrapper">
                                <LockKeyhole size={19} />

                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
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

                        <div className="auth-form-options">
                            <span>Secure account access</span>

                            <Link to="/signup">Create account</Link>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}

                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>

                    <Link to="/products" className="auth-back-link">
                        Continue browsing products
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default Login;
