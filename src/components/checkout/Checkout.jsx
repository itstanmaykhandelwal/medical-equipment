import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    ShoppingBag,
    CreditCard,
    Truck,
    CheckCircle,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import "./Checkout.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const ADDRESSES_STORAGE_KEY = "medical-equipment-addresses";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
};

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
const getImageSrc = (image) => {
    if (!image || typeof image !== "string") return "";

    const src = image.trim();

    if (!src) return "";

    if (/^https?:\/\//i.test(src)) {
        return src;
    }

    if (src.startsWith("/uploads/")) {
        return `${API_URL}${src}`;
    }

    if (src.startsWith("/")) {
        return src;
    }

    return `/images/${src}`;
};
const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();

    const [form, setForm] = useState(initialForm);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);

    useEffect(() => {
        try {
            const addresses = JSON.parse(
                localStorage.getItem(ADDRESSES_STORAGE_KEY) || "[]",
            );

            if (Array.isArray(addresses)) {
                setSavedAddresses(addresses);

                const defaultAddress = addresses.find(
                    (address) => address.isDefault,
                );

                if (defaultAddress) {
                    setSelectedAddressId(String(defaultAddress.id));

                    setForm((current) => ({
                        ...current,
                        name: defaultAddress.fullName || "",
                        phone: defaultAddress.phone || "",
                        address: defaultAddress.address || "",
                        apartment: defaultAddress.apartment || "",
                        city: defaultAddress.city || "",
                        state: defaultAddress.state || "",
                        pincode: defaultAddress.pincode || "",
                    }));
                }
            }
        } catch (err) {
            console.error("Unable to load saved addresses:", err);
        }

        try {
            const currentUser = JSON.parse(
                localStorage.getItem("medical-current-user") || "null",
            );

            if (currentUser) {
                setForm((current) => ({
                    ...current,
                    name: current.name || currentUser.name || "",
                    email: currentUser.email || "",
                    phone: current.phone || currentUser.phone || "",
                }));
            }
        } catch (err) {
            console.error("Unable to load customer details:", err);
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
    };

    const handleAddressChange = (event) => {
        const addressId = event.target.value;

        setSelectedAddressId(addressId);
        setError("");

        if (!addressId) return;

        const address = savedAddresses.find(
            (item) => String(item.id) === addressId,
        );

        if (!address) return;

        setForm((current) => ({
            ...current,
            name: address.fullName || current.name,
            phone: address.phone || current.phone,
            address: address.address || "",
            apartment: address.apartment || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || "",
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (cartItems.length === 0) {
            setError("Your cart is empty. Please add products first.");
            return;
        }

        if (paymentMethod === "online") {
            setError(
                "Online payment is not available yet. Please select Cash on Delivery.",
            );
            return;
        }

        const token = localStorage.getItem("medical-auth-token");

        if (!token) {
            setError("Please log in to place your order.");
            return;
        }

        const cleanedForm = {
            ...form,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            apartment: form.apartment.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
            notes: form.notes.trim(),
        };

        if (
            !cleanedForm.name ||
            !cleanedForm.email ||
            !cleanedForm.phone ||
            !cleanedForm.address ||
            !cleanedForm.city ||
            !cleanedForm.state ||
            !cleanedForm.pincode
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedForm.email)) {
            setError("Please enter a valid email address.");
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

        const orderItems = cartItems.map((item) => ({
            productId: String(item._id ?? item.id ?? ""),
            quantity: Number(item.quantity),
        }));

        if (
            orderItems.some(
                (item) =>
                    !item.productId ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1,
            )
        ) {
            setError(
                "One or more cart items are invalid. Please refresh your cart.",
            );
            return;
        }

        const shippingAddress = {
            fullName: cleanedForm.name,
            phone: cleanedForm.phone,
            addressLine: [cleanedForm.address, cleanedForm.apartment]
                .filter(Boolean)
                .join(", "),
            city: cleanedForm.city,
            state: cleanedForm.state,
            postalCode: cleanedForm.pincode,
        };

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress,
                    paymentMethod: "cod",
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(
                        "Your login session may have expired. Please log in again.",
                    );
                }

                throw new Error(
                    data.message ||
                        "Unable to place your order. Please try again.",
                );
            }

            if (!data.success || !data.order) {
                throw new Error("The server did not return a confirmed order.");
            }

            const newOrder = {
                ...data.order,
                orderId: data.order._id,
                total: data.order.total,
                paymentMethod: data.order.paymentMethod,
            };

            setCompletedOrder(newOrder);
            clearCart();
        } catch (submitError) {
            console.error("Checkout error:", submitError);
            setError(
                submitError.message ||
                    "Unable to place your order. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (completedOrder) {
        return (
            <main className="checkout-page">
                <section className="checkout-success">
                    <span className="checkout-success-icon">
                        <CheckCircle size={48} />
                    </span>

                    <h1>Order Placed Successfully!</h1>

                    <p>
                        Thank you for your order. Your order has been saved
                        successfully.
                    </p>

                    <div className="checkout-success-details">
                        <span>Order ID</span>
                        <strong>
                            {completedOrder.orderId || completedOrder._id}
                        </strong>

                        <span>Total Amount</span>
                        <strong>{formatPrice(completedOrder.total)}</strong>

                        <span>Payment Method</span>
                        <strong>
                            {completedOrder.paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "Online Payment"}
                        </strong>
                    </div>

                    <div className="checkout-success-actions">
                        <Link to="/my-orders" className="checkout-primary-btn">
                            View My Orders
                        </Link>

                        <Link to="/products" className="checkout-secondary-btn">
                            Continue Shopping
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="checkout-page">
                <section className="checkout-empty">
                    <ShoppingBag size={46} />
                    <h1>Your cart is empty</h1>
                    <p>Add some products before proceeding to checkout.</p>
                    <Link to="/products" className="checkout-primary-btn">
                        Browse Products
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <section className="checkout-banner">
                <h1>Checkout</h1>

                <div className="checkout-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/cart">Cart</Link>
                    <span>/</span>
                    <span>Checkout</span>
                </div>
            </section>

            <section className="checkout-container">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <section className="checkout-section">
                        <div className="checkout-section-heading">
                            <span>
                                <MapPin size={20} />
                            </span>
                            <div>
                                <h2>Billing &amp; Delivery Details</h2>
                                <p>
                                    Enter your contact and delivery information.
                                </p>
                            </div>
                        </div>

                        {savedAddresses.length > 0 && (
                            <div className="checkout-saved-addresses">
                                <label htmlFor="saved-address">
                                    Select a Saved Address
                                </label>

                                <select
                                    id="saved-address"
                                    value={selectedAddressId}
                                    onChange={handleAddressChange}
                                >
                                    <option value="">
                                        Enter a new address
                                    </option>

                                    {savedAddresses.map((address) => (
                                        <option
                                            key={address.id}
                                            value={String(address.id)}
                                        >
                                            {address.type || "Home"} —{" "}
                                            {address.fullName}, {address.city}
                                            {address.isDefault
                                                ? " (Default)"
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="checkout-fields">
                            <div className="checkout-field">
                                <label htmlFor="checkout-name">
                                    Full Name *
                                </label>
                                <input
                                    id="checkout-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="checkout-email">
                                    Email Address *
                                </label>
                                <input
                                    id="checkout-email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="checkout-phone">
                                    Phone Number *
                                </label>
                                <input
                                    id="checkout-phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                    required
                                />
                            </div>

                            <div className="checkout-field checkout-field-full">
                                <label htmlFor="checkout-address">
                                    Street Address *
                                </label>
                                <input
                                    id="checkout-address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="House number, street, area"
                                    autoComplete="street-address"
                                    required
                                />
                            </div>

                            <div className="checkout-field checkout-field-full">
                                <label htmlFor="checkout-apartment">
                                    Apartment / Landmark
                                </label>
                                <input
                                    id="checkout-apartment"
                                    name="apartment"
                                    value={form.apartment}
                                    onChange={handleChange}
                                    placeholder="Apartment, floor, landmark"
                                />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="checkout-city">City *</label>
                                <input
                                    id="checkout-city"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    autoComplete="address-level2"
                                    required
                                />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="checkout-state">State *</label>
                                <input
                                    id="checkout-state"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                    autoComplete="address-level1"
                                    required
                                />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="checkout-pincode">
                                    Pincode *
                                </label>
                                <input
                                    id="checkout-pincode"
                                    name="pincode"
                                    inputMode="numeric"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    placeholder="6-digit pincode"
                                    autoComplete="postal-code"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <div className="checkout-field checkout-field-full">
                                <label htmlFor="checkout-notes">
                                    Order Notes (Optional)
                                </label>
                                <textarea
                                    id="checkout-notes"
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Any special delivery instructions?"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="checkout-section">
                        <div className="checkout-section-heading">
                            <span>
                                <CreditCard size={20} />
                            </span>
                            <div>
                                <h2>Payment Method</h2>
                                <p>Select how you would like to pay.</p>
                            </div>
                        </div>

                        <div className="checkout-payment-options">
                            <label
                                className={
                                    paymentMethod === "cod"
                                        ? "checkout-payment-option selected"
                                        : "checkout-payment-option"
                                }
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={(event) =>
                                        setPaymentMethod(event.target.value)
                                    }
                                />
                                <Truck size={21} />
                                <span>
                                    <strong>Cash on Delivery</strong>
                                    <small>Pay when your order arrives</small>
                                </span>
                            </label>

                            <label
                                className={
                                    paymentMethod === "online"
                                        ? "checkout-payment-option selected"
                                        : "checkout-payment-option"
                                }
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === "online"}
                                    onChange={(event) =>
                                        setPaymentMethod(event.target.value)
                                    }
                                />
                                <CreditCard size={21} />
                                <span>
                                    <strong>Online Payment</strong>
                                    <small>
                                        Demo option — no payment is processed
                                    </small>
                                </span>
                            </label>
                        </div>
                    </section>

                    {error && (
                        <div className="checkout-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="checkout-place-order-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Placing Order..."
                            : `Place Order — ${formatPrice(cartTotal)}`}
                    </button>

                    <p className="checkout-demo-note">
                        Your order will be saved securely after server
                        confirmation.
                    </p>
                </form>

                <aside className="checkout-summary">
                    <h2>Your Order</h2>

                    <div className="checkout-summary-products">
                        {cartItems.map((item) => (
                            <div
                                className="checkout-summary-item"
                                key={String(item._id ?? item.id)}
                            >
                                <div className="checkout-summary-image">
                                    {getImageSrc(
                                        item.images?.[0] || item.image,
                                    ) ? (
                                        <img
                                            src={getImageSrc(
                                                item.images?.[0] || item.image,
                                            )}
                                            alt={item.name || "Product"}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                                e.currentTarget.parentElement.classList.add(
                                                    "image-load-error",
                                                );
                                            }}
                                        />
                                    ) : (
                                        <ShoppingBag size={23} />
                                    )}

                                    <span>{item.quantity || 1}</span>
                                </div>

                                <div className="checkout-summary-info">
                                    <h3>{item.name}</h3>
                                    <p>Qty: {item.quantity || 1}</p>
                                </div>

                                <strong>
                                    {formatPrice(
                                        (Number(item.price) || 0) *
                                            (Number(item.quantity) || 1),
                                    )}
                                </strong>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-summary-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>

                    <div className="checkout-summary-row">
                        <span>Shipping</span>
                        <span className="checkout-free-shipping">Free</span>
                    </div>

                    <div className="checkout-summary-total">
                        <span>Total</span>
                        <strong>{formatPrice(cartTotal)}</strong>
                    </div>

                    <p className="checkout-secure-note">
                        Your order details will be saved when you place your
                        order.
                    </p>
                </aside>
            </section>
        </main>
    );
};

export default Checkout;
