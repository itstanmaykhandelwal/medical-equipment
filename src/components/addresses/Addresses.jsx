import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    ArrowLeft,
    House,
    Building2,
} from "lucide-react";

import "./Addresses.css";

const STORAGE_KEY = "medical-equipment-addresses";

const emptyForm = {
    fullName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
};

const readAddresses = () => {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const Addresses = () => {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState(readAddresses);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loggedIn =
            localStorage.getItem("medical-user-logged-in") === "true";

        if (!loggedIn) {
            navigate("/login", {
                replace: true,
                state: {
                    message: "Please log in to manage your addresses.",
                },
            });
        }
    }, [navigate]);

    const saveAddresses = (updatedAddresses) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));

            setAddresses(updatedAddresses);
            return true;
        } catch (saveError) {
            console.error("Address save error:", saveError);
            setError("Unable to save address. Please try again.");
            return false;
        }
    };

    const openAddForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const openEditForm = (address) => {
        setForm({
            fullName: address.fullName || "",
            phone: address.phone || "",
            address: address.address || "",
            apartment: address.apartment || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || "",
            type: address.type || "Home",
        });

        setEditingId(address.id);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const cleanedForm = {
            ...form,
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            apartment: form.apartment.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
        };

        if (
            !cleanedForm.fullName ||
            !cleanedForm.phone ||
            !cleanedForm.address ||
            !cleanedForm.city ||
            !cleanedForm.state ||
            !cleanedForm.pincode
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!/^[0-9+\-\s()]{10,20}$/.test(cleanedForm.phone)) {
            setError("Please enter a valid phone number.");
            return;
        }

        if (!/^\d{6}$/.test(cleanedForm.pincode)) {
            setError("Please enter a valid 6-digit pincode.");
            return;
        }

        let updatedAddresses;

        if (editingId !== null) {
            updatedAddresses = addresses.map((item) =>
                item.id === editingId ? { ...item, ...cleanedForm } : item,
            );
        } else {
            const isFirstAddress = addresses.length === 0;

            updatedAddresses = [
                ...addresses,
                {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    ...cleanedForm,
                    isDefault: isFirstAddress,
                },
            ];
        }

        if (saveAddresses(updatedAddresses)) {
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            setSuccess(
                editingId !== null
                    ? "Address updated successfully."
                    : "Address added successfully.",
            );
        }
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this address?",
        );

        if (!confirmed) return;

        let updatedAddresses = addresses.filter((address) => address.id !== id);

        if (
            addresses.find((address) => address.id === id)?.isDefault &&
            updatedAddresses.length > 0
        ) {
            updatedAddresses = updatedAddresses.map((address, index) => ({
                ...address,
                isDefault: index === 0,
            }));
        }

        if (saveAddresses(updatedAddresses)) {
            setSuccess("Address deleted successfully.");
            setError("");
        }
    };

    const handleSetDefault = (id) => {
        const updatedAddresses = addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
        }));

        if (saveAddresses(updatedAddresses)) {
            setSuccess("Default address updated successfully.");
            setError("");
        }
    };

    return (
        <main className="addresses-page">
            <section className="addresses-banner">
                <div className="addresses-banner-content">
                    <span className="addresses-eyebrow">MY ACCOUNT</span>
                    <h1>My Addresses</h1>

                    <div className="addresses-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>My Addresses</span>
                    </div>
                </div>
            </section>

            <section className="addresses-container">
                <div className="addresses-heading">
                    <div>
                        <h2>Saved Addresses</h2>
                        <p>Manage your delivery addresses.</p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            className="address-add-btn"
                            onClick={openAddForm}
                        >
                            <Plus size={18} />
                            Add New Address
                        </button>
                    )}
                </div>

                {error && (
                    <div className="address-message address-error" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="address-message address-success"
                        role="status"
                    >
                        {success}
                    </div>
                )}

                {showForm && (
                    <section className="address-form-card">
                        <div className="address-form-heading">
                            <div>
                                <h3>
                                    {editingId !== null
                                        ? "Edit Address"
                                        : "Add New Address"}
                                </h3>
                                <p>Enter your delivery details below.</p>
                            </div>

                            <button
                                type="button"
                                className="address-close-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setError("");
                                }}
                                aria-label="Close form"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form className="address-form" onSubmit={handleSubmit}>
                            <div className="address-type-field">
                                <label>Address Type</label>

                                <div className="address-type-options">
                                    <label
                                        className={
                                            form.type === "Home"
                                                ? "address-type-option selected"
                                                : "address-type-option"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Home"
                                            checked={form.type === "Home"}
                                            onChange={handleChange}
                                        />
                                        <House size={18} />
                                        Home
                                    </label>

                                    <label
                                        className={
                                            form.type === "Work"
                                                ? "address-type-option selected"
                                                : "address-type-option"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Work"
                                            checked={form.type === "Work"}
                                            onChange={handleChange}
                                        />
                                        <Building2 size={18} />
                                        Work
                                    </label>
                                </div>
                            </div>

                            <div className="address-form-grid">
                                <div className="address-field">
                                    <label htmlFor="address-fullName">
                                        Full Name *
                                    </label>
                                    <input
                                        id="address-fullName"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        autoComplete="name"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="address-field">
                                    <label htmlFor="address-phone">
                                        Phone Number *
                                    </label>
                                    <input
                                        id="address-phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        autoComplete="tel"
                                        maxLength={20}
                                        required
                                    />
                                </div>

                                <div className="address-field address-field-full">
                                    <label htmlFor="address-address">
                                        Street Address *
                                    </label>
                                    <input
                                        id="address-address"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="House number, street, area"
                                        autoComplete="street-address"
                                        maxLength={250}
                                        required
                                    />
                                </div>

                                <div className="address-field address-field-full">
                                    <label htmlFor="address-apartment">
                                        Apartment / Landmark (Optional)
                                    </label>
                                    <input
                                        id="address-apartment"
                                        name="apartment"
                                        value={form.apartment}
                                        onChange={handleChange}
                                        placeholder="Apartment, floor, landmark"
                                        maxLength={150}
                                    />
                                </div>

                                <div className="address-field">
                                    <label htmlFor="address-city">City *</label>
                                    <input
                                        id="address-city"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        autoComplete="address-level2"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="address-field">
                                    <label htmlFor="address-state">
                                        State *
                                    </label>
                                    <input
                                        id="address-state"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        autoComplete="address-level1"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="address-field">
                                    <label htmlFor="address-pincode">
                                        Pincode *
                                    </label>
                                    <input
                                        id="address-pincode"
                                        name="pincode"
                                        type="text"
                                        inputMode="numeric"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        autoComplete="postal-code"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="address-form-actions">
                                <button
                                    type="button"
                                    className="address-cancel-btn"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="address-save-btn"
                                >
                                    <Check size={18} />
                                    {editingId !== null
                                        ? "Update Address"
                                        : "Save Address"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {!showForm && addresses.length === 0 ? (
                    <div className="addresses-empty">
                        <span className="addresses-empty-icon">
                            <MapPin size={34} />
                        </span>

                        <h3>No saved addresses</h3>
                        <p>
                            Add a delivery address to make your checkout
                            experience easier.
                        </p>

                        <button
                            type="button"
                            className="address-add-btn"
                            onClick={openAddForm}
                        >
                            <Plus size={18} />
                            Add Your First Address
                        </button>
                    </div>
                ) : (
                    !showForm && (
                        <div className="addresses-grid">
                            {addresses.map((address) => (
                                <article
                                    className="saved-address-card"
                                    key={address.id}
                                >
                                    <div className="saved-address-header">
                                        <div className="saved-address-type">
                                            {address.type === "Work" ? (
                                                <Building2 size={19} />
                                            ) : (
                                                <House size={19} />
                                            )}
                                            <span>
                                                {address.type || "Home"}
                                            </span>
                                        </div>

                                        {address.isDefault && (
                                            <span className="default-address-badge">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <div className="saved-address-details">
                                        <h3>{address.fullName}</h3>
                                        <p className="saved-address-phone">
                                            {address.phone}
                                        </p>

                                        <p className="saved-address-text">
                                            {address.address}
                                            {address.apartment
                                                ? `, ${address.apartment}`
                                                : ""}
                                            {`, ${address.city}, ${address.state} - ${address.pincode}`}
                                        </p>
                                    </div>

                                    <div className="saved-address-actions">
                                        <button
                                            type="button"
                                            className="address-action-btn"
                                            onClick={() =>
                                                openEditForm(address)
                                            }
                                        >
                                            <Pencil size={15} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="address-action-btn address-delete-btn"
                                            onClick={() =>
                                                handleDelete(address.id)
                                            }
                                        >
                                            <Trash2 size={15} />
                                            Delete
                                        </button>

                                        {!address.isDefault && (
                                            <button
                                                type="button"
                                                className="address-default-btn"
                                                onClick={() =>
                                                    handleSetDefault(address.id)
                                                }
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )
                )}

                <div className="addresses-bottom-link">
                    <Link to="/profile">
                        <ArrowLeft size={16} />
                        Back to My Profile
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Addresses;
