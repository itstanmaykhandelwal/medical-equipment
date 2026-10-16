import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    ShoppingBag,
    ArrowRight,
    CalendarDays,
    MapPin,
    RefreshCw,
    X,
} from "lucide-react";
import "./MyOrders.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getImageSrc = (image) => {
    if (!image || typeof image !== "string") return "";

    const src = image.trim();

    if (!src) return "";

    // External image URL
    if (/^https?:\/\//i.test(src)) {
        return src;
    }

    // Uploaded images served by the backend
    if (src.startsWith("/uploads/")) {
        return `${API_URL}${src}`;
    }

    // Other absolute paths
    if (src.startsWith("/")) {
        return src;
    }

    // Legacy image filenames
    return `/images/${src}`;
};

const getOrderStatus = (order) =>
    String(order.orderStatus || order.status || "placed").toLowerCase();

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingOrderId, setCancellingOrderId] = useState("");

    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem("medical-auth-token");

        if (!token) {
            setOrders([]);
            setError("Please log in to view your orders.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/orders/my-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(
                        "Your session may have expired. Please log in again.",
                    );
                }

                throw new Error(data.message || "Unable to load your orders.");
            }

            setOrders(Array.isArray(data.orders) ? data.orders : []);
        } catch (fetchError) {
            console.error("Fetch orders error:", fetchError);
            setError(
                fetchError.message ||
                    "Unable to load your orders. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?",
        );

        if (!confirmed) return;

        const token = localStorage.getItem("medical-auth-token");

        if (!token) {
            setError("Please log in again to cancel your order.");
            return;
        }

        setCancellingOrderId(orderId);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/api/orders/${orderId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Unable to cancel this order.");
            }

            await fetchOrders();
        } catch (cancelError) {
            console.error("Cancel order error:", cancelError);
            setError(
                cancelError.message ||
                    "Unable to cancel your order. Please try again.",
            );
        } finally {
            setCancellingOrderId("");
        }
    };

    return (
        <main className="my-orders-page">
            <section className="orders-banner">
                <div className="orders-banner-content">
                    <span className="orders-eyebrow">MY ACCOUNT</span>
                    <h1>My Orders</h1>

                    <div className="orders-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>My Orders</span>
                    </div>
                </div>
            </section>

            <section className="orders-container">
                <div className="orders-heading">
                    <div>
                        <h2>Order History</h2>
                        <p>View and keep track of your purchases.</p>
                    </div>

                    <span className="orders-count">
                        {orders.length}{" "}
                        {orders.length === 1 ? "Order" : "Orders"}
                    </span>
                </div>

                {error && (
                    <div className="orders-error" role="alert">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={fetchOrders}
                            disabled={loading}
                            aria-label="Retry loading orders"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="orders-empty">
                        <RefreshCw size={30} />
                        <h3>Loading your orders...</h3>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="orders-empty">
                        <div className="orders-empty-icon">
                            <ShoppingBag size={34} />
                        </div>

                        <h3>No orders yet</h3>

                        <p>
                            You haven't placed any orders yet. Explore our
                            products and find what you need.
                        </p>

                        <Link to="/products" className="orders-shop-btn">
                            Start Shopping <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const items = Array.isArray(order.items)
                                ? order.items
                                : [];

                            const orderId = order._id || order.id;
                            const status = getOrderStatus(order);

                            const total =
                                order.total ??
                                order.totalAmount ??
                                items.reduce(
                                    (sum, item) =>
                                        sum +
                                        (Number(item.price) || 0) *
                                            (Number(item.quantity) || 1),
                                    0,
                                );

                            const address = order.shippingAddress;
                            const canCancel = ["placed", "confirmed"].includes(
                                status,
                            );

                            return (
                                <article className="order-card" key={orderId}>
                                    <div className="order-card-header">
                                        <div className="order-reference">
                                            <span className="order-icon">
                                                <Package size={21} />
                                            </span>

                                            <div>
                                                <h3>Order #{orderId}</h3>

                                                <p>
                                                    <CalendarDays size={14} />
                                                    {formatDate(
                                                        order.createdAt,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`order-status order-status-${status.replace(
                                                /\s+/g,
                                                "-",
                                            )}`}
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="order-products">
                                        {items.map((item, itemIndex) => (
                                            <div
                                                className="order-product"
                                                key={`${
                                                    item.product ||
                                                    item.id ||
                                                    item.name
                                                }-${itemIndex}`}
                                            >
                                                <div className="order-product-image">
                                                    {getImageSrc(
                                                        item.images?.[0] ||
                                                            item.image,
                                                    ) ? (
                                                        <img
                                                            src={getImageSrc(
                                                                item
                                                                    .images?.[0] ||
                                                                    item.image,
                                                            )}
                                                            alt={
                                                                item.name ||
                                                                "Product"
                                                            }
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
                                                        <Package size={25} />
                                                    )}
                                                </div>

                                                <div className="order-product-info">
                                                    <h4>
                                                        {item.name || "Product"}
                                                    </h4>

                                                    <p>
                                                        Qty:{" "}
                                                        {Number(
                                                            item.quantity,
                                                        ) || 1}
                                                    </p>
                                                </div>

                                                <strong>
                                                    {formatPrice(
                                                        (Number(item.price) ||
                                                            0) *
                                                            (Number(
                                                                item.quantity,
                                                            ) || 1),
                                                    )}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    {address && (
                                        <div className="order-delivery">
                                            <MapPin size={17} />

                                            <span>
                                                {address.addressLine}
                                                {address.city
                                                    ? `, ${address.city}`
                                                    : ""}
                                                {address.state
                                                    ? `, ${address.state}`
                                                    : ""}
                                                {address.postalCode
                                                    ? ` - ${address.postalCode}`
                                                    : ""}
                                            </span>
                                        </div>
                                    )}

                                    <div className="order-card-footer">
                                        <div>
                                            <span>Total Amount</span>
                                            <strong>
                                                {formatPrice(total)}
                                            </strong>
                                        </div>

                                        <div className="order-card-actions">
                                            {canCancel && (
                                                <button
                                                    type="button"
                                                    className="order-cancel-btn"
                                                    disabled={
                                                        cancellingOrderId ===
                                                        orderId
                                                    }
                                                    onClick={() =>
                                                        handleCancelOrder(
                                                            orderId,
                                                        )
                                                    }
                                                >
                                                    <X size={16} />
                                                    {cancellingOrderId ===
                                                    orderId
                                                        ? "Cancelling..."
                                                        : "Cancel Order"}
                                                </button>
                                            )}

                                            <Link
                                                to="/products"
                                                className="order-reorder-btn"
                                            >
                                                Continue Shopping
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <div className="orders-bottom-link">
                    <Link to="/">
                        <RefreshCw size={15} />
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default MyOrders;
