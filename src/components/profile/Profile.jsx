import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserRound,
    Mail,
    Phone,
    Save,
    ArrowLeft,
    ShieldCheck,
} from "lucide-react";

import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const isLoggedIn =
                localStorage.getItem("medical-user-logged-in") === "true";

            const currentUser = JSON.parse(
                localStorage.getItem("medical-current-user") || "null",
            );

            if (!isLoggedIn || !currentUser) {
                navigate("/login", {
                    replace: true,
                    state: {
                        message: "Please log in to view your profile.",
                    },
                });
                return;
            }

            setForm({
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
            });
        } catch (error) {
            console.error("Failed to load profile:", error);
            setError("Unable to load your profile. Please log in again.");
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();
        const phone = form.phone.trim();

        if (!name || !email || !phone) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^[0-9+\-\s()]{10,20}$/.test(phone)) {
            setError("Please enter a valid phone number.");
            return;
        }

        setLoading(true);

        try {
            const isLoggedIn =
                localStorage.getItem("medical-user-logged-in") === "true";

            const currentUser = JSON.parse(
                localStorage.getItem("medical-current-user") || "null",
            );

            if (!isLoggedIn || !currentUser) {
                setError("Your session has expired. Please log in again.");
                return;
            }

            const updatedUser = {
                ...currentUser,
                name,
                email: currentUser.email || email,
                phone,
            };

            localStorage.setItem(
                "medical-current-user",
                JSON.stringify(updatedUser),
            );

            // Keep the demo users list in sync with the profile.
            const users = JSON.parse(
                localStorage.getItem("medical-equipment-users") || "[]",
            );

            if (Array.isArray(users)) {
                const updatedUsers = users.map((user) =>
                    user.id === currentUser.id ||
                    user.email?.toLowerCase() ===
                        currentUser.email?.toLowerCase()
                        ? {
                              ...user,
                              name,
                              phone,
                          }
                        : user,
                );

                localStorage.setItem(
                    "medical-equipment-users",
                    JSON.stringify(updatedUsers),
                );
            }

            setForm((currentForm) => ({
                ...currentForm,
                name,
                phone,
            }));

            setSuccess("Your profile has been updated successfully.");

            // Notify other components in this tab.
            window.dispatchEvent(new Event("profile-updated"));
        } catch (error) {
            console.error("Profile update error:", error);
            setError("Unable to save changes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="profile-page">
            <section className="profile-banner">
                <div className="profile-banner-content">
                    <span className="profile-eyebrow">MY ACCOUNT</span>

                    <h1>My Profile</h1>

                    <div className="profile-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>My Profile</span>
                    </div>
                </div>
            </section>

            <section className="profile-container">
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">
                            <UserRound size={34} />
                        </div>

                        <h2>{form.name || "Your Account"}</h2>

                        <p>{form.email}</p>

                        <div className="profile-sidebar-divider" />

                        <nav className="profile-navigation">
                            <Link
                                to="/profile"
                                className="profile-nav-link active"
                            >
                                <UserRound size={18} />
                                My Profile
                            </Link>

                            <Link to="/my-orders" className="profile-nav-link">
                                <ShieldCheck size={18} />
                                My Orders
                            </Link>

                            <Link to="/products" className="profile-nav-link">
                                <ArrowLeft size={18} />
                                Continue Shopping
                            </Link>
                        </nav>
                    </aside>

                    <section className="profile-content">
                        <div className="profile-content-heading">
                            <h2>Personal Information</h2>
                            <p>Update your personal details below.</p>
                        </div>

                        {error && (
                            <div
                                className="profile-message profile-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                className="profile-message profile-success"
                                role="status"
                            >
                                {success}
                            </div>
                        )}

                        <form className="profile-form" onSubmit={handleSubmit}>
                            <div className="profile-field">
                                <label htmlFor="profile-name">Full Name</label>

                                <div className="profile-input-wrapper">
                                    <UserRound size={19} />

                                    <input
                                        id="profile-name"
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

                            <div className="profile-field">
                                <label htmlFor="profile-email">
                                    Email Address
                                </label>

                                <div className="profile-input-wrapper profile-input-readonly">
                                    <Mail size={19} />

                                    <input
                                        id="profile-email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        readOnly
                                        aria-describedby="profile-email-note"
                                    />
                                </div>

                                <span
                                    className="profile-field-note"
                                    id="profile-email-note"
                                >
                                    Email address cannot be changed here.
                                </span>
                            </div>

                            <div className="profile-field">
                                <label htmlFor="profile-phone">
                                    Phone Number
                                </label>

                                <div className="profile-input-wrapper">
                                    <Phone size={19} />

                                    <input
                                        id="profile-phone"
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

                            <div className="profile-form-actions">
                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={loading}
                                >
                                    <Save size={18} />

                                    {loading
                                        ? "Saving Changes..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </section>
        </main>
    );
};

export default Profile;
