import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LockKeyhole } from "lucide-react";
import { adminRequest } from "../services/api";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await adminRequest("/api/admin/login", {
                method: "POST",
                body: JSON.stringify(form),
            });

            if (!data.token) {
                throw new Error(
                    "Login response did not contain an access token.",
                );
            }

            localStorage.setItem("medical-admin-token", data.token);
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "Unable to log in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <form className="admin-login-card" onSubmit={handleSubmit}>
                <div className="admin-login-icon">
                    <ShieldCheck size={30} />
                </div>

                <h1>Admin Portal</h1>
                <p>Sign in to manage your medical equipment store.</p>

                {error && (
                    <div className="admin-error" role="alert">
                        {error}
                    </div>
                )}

                <label htmlFor="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter admin email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                />

                <label htmlFor="password">Password</label>
                <div className="admin-password-field">
                    <LockKeyhole size={18} />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <span className="admin-login-footer">
                    Authorized administrators only
                </span>
            </form>
        </main>
    );
}
