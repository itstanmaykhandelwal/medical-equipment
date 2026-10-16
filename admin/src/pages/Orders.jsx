import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCw,
    Package,
    X,
    MapPin,
    CalendarDays,
    UserRound,
    ChevronDown,
    ShoppingBag,
    AlertCircle,
} from "lucide-react";
import "./Orders.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered"];

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getImageSrc = (image) => {
    if (!image || typeof image !== "string") return "";

    const src = image.trim();

    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
    if (src.startsWith("/")) return src;

    return `/images/${src}`;
};

const getStatus = (order) =>
    String(order.orderStatus || order.status || "placed").toLowerCase();

const getOrderTotal = (order) => {
    if (order.total != null) return Number(order.total) || 0;
    if (order.totalAmount != null) return Number(order.totalAmount) || 0;

    const items = Array.isArray(order.items) ? order.items : [];

    return items.reduce(
        (sum, item) =>
            sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0,
    );
};

const getCustomer = (order) => {
    const address = order.shippingAddress || {};
    const user = order.user || {};

    return {
        name: address.fullName || user.name || order.customerName || "Customer",
        email: user.email || order.email || "",
        phone: address.phone || user.phone || order.phone || "",
    };
};

const getItems = (order) => (Array.isArray(order.items) ? order.items : []);

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState("");
    const [notice, setNotice] = useState("");

    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem("medical-admin-token");

        setLoading(true);
        setError("");
        setNotice("");

        if (!token) {
            setOrders([]);
            setError(
                "Admin session nahi mili. Please admin mein dobara login karo.",
            );
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/orders/admin/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(
                        "Admin session invalid ya expired hai. Dobara login karo.",
                    );
                }

                throw new Error(data.message || "Orders load nahi ho paaye.");
            }

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.orders)
                  ? data.orders
                  : Array.isArray(data.data)
                    ? data.data
                    : [];

            setOrders(list);
        } catch (err) {
            console.error("Fetch admin orders error:", err);
            setError(err.message || "Orders load nahi ho paaye.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        return orders.filter((order) => {
            const customer = getCustomer(order);
            const id = String(order._id || order.id || "").toLowerCase();
            const status = getStatus(order);

            const matchesStatus =
                statusFilter === "all" || status === statusFilter;

            const matchesSearch =
                !query ||
                id.includes(query) ||
                customer.name.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query) ||
                customer.phone.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [orders, search, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: orders.length,
            placed: orders.filter((o) => getStatus(o) === "placed").length,
            processing: orders.filter((o) =>
                ["confirmed", "processing"].includes(getStatus(o)),
            ).length,
            shipped: orders.filter((o) => getStatus(o) === "shipped").length,
            delivered: orders.filter((o) => getStatus(o) === "delivered")
                .length,
        };
    }, [orders]);

    const updateStatus = async (orderId, newStatus) => {
        const token = localStorage.getItem("medical-admin-token");

        if (!token) {
            setError("Admin session nahi mili. Dobara login karo.");
            return;
        }

        setUpdatingId(orderId);
        setError("");
        setNotice("");

        try {
            const response = await fetch(
                `${API_URL}/api/orders/admin/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ orderStatus: newStatus }),
                },
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(
                        "Admin session invalid hai. Dobara login karo.",
                    );
                }

                throw new Error(
                    data.message || "Order status update nahi hua.",
                );
            }

            const updatedOrder = data.order || data.data || null;

            setOrders((current) =>
                current.map((order) => {
                    if (String(order._id || order.id) !== String(orderId)) {
                        return order;
                    }

                    if (updatedOrder) {
                        return { ...order, ...updatedOrder };
                    }

                    return {
                        ...order,
                        status: newStatus,
                        orderStatus: newStatus,
                    };
                }),
            );

            setSelectedOrder((current) => {
                if (
                    !current ||
                    String(current._id || current.id) !== String(orderId)
                ) {
                    return current;
                }

                return updatedOrder
                    ? { ...current, ...updatedOrder }
                    : { ...current, status: newStatus, orderStatus: newStatus };
            });

            setNotice(`Order status updated to ${newStatus}.`);
        } catch (err) {
            console.error("Update order status error:", err);
            setError(err.message || "Order status update nahi hua.");
        } finally {
            setUpdatingId("");
        }
    };

    return (
        <main className="orders-page">
            <header className="orders-page-header">
                <div>
                    <span className="orders-eyebrow">STORE MANAGEMENT</span>
                    <h1>Orders</h1>
                    <p>
                        Customer orders, delivery details aur order status
                        manage karo.
                    </p>
                </div>

                <button
                    className="orders-refresh-btn"
                    type="button"
                    onClick={fetchOrders}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "orders-spin" : ""}
                    />
                    Refresh
                </button>
            </header>

            {error && (
                <div className="orders-alert orders-alert-error" role="alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {notice && (
                <div
                    className="orders-alert orders-alert-success"
                    role="status"
                >
                    <span>{notice}</span>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            <section className="orders-stats">
                <StatCard
                    label="All Orders"
                    value={stats.total}
                    icon={<ShoppingBag />}
                />
                <StatCard
                    label="New Orders"
                    value={stats.placed}
                    icon={<Package />}
                />
                <StatCard
                    label="In Progress"
                    value={stats.processing}
                    icon={<RefreshCw />}
                />
                <StatCard
                    label="Shipped"
                    value={stats.shipped}
                    icon={<MapPin />}
                />
                <StatCard
                    label="Delivered"
                    value={stats.delivered}
                    icon={<Package />}
                />
            </section>

            <section className="orders-panel">
                <div className="orders-toolbar">
                    <div>
                        <h2>All Orders</h2>
                        <p>{filteredOrders.length} orders found</p>
                    </div>

                    <div className="orders-toolbar-controls">
                        <label className="orders-search">
                            <Search size={18} />
                            <input
                                type="search"
                                placeholder="Search order, customer, email..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </label>

                        <label className="orders-filter">
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                aria-label="Filter by order status"
                            >
                                <option value="all">All statuses</option>
                                {STATUSES.map((status) => (
                                    <option value={status} key={status}>
                                        {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} />
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div className="orders-state">
                        <RefreshCw size={28} className="orders-spin" />
                        <h3>Loading orders...</h3>
                        <p>Backend se orders fetch ho rahe hain.</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="orders-state">
                        <ShoppingBag size={34} />
                        <h3>
                            {orders.length
                                ? "No matching orders"
                                : "No orders yet"}
                        </h3>
                        <p>
                            {orders.length
                                ? "Search ya status filter change karke dekho."
                                : "Customer checkout se order place karega toh yahan dikhega."}
                        </p>
                        {orders.length > 0 && (
                            <button
                                type="button"
                                className="orders-reset-btn"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="orders-table-wrap">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredOrders.map((order) => {
                                        const orderId = String(
                                            order._id || order.id,
                                        );
                                        const customer = getCustomer(order);
                                        const status = getStatus(order);
                                        const items = getItems(order);

                                        return (
                                            <tr key={orderId}>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="orders-id-btn"
                                                        onClick={() =>
                                                            setSelectedOrder(
                                                                order,
                                                            )
                                                        }
                                                    >
                                                        #
                                                        {orderId
                                                            .slice(-8)
                                                            .toUpperCase()}
                                                    </button>
                                                </td>

                                                <td>
                                                    <div className="orders-customer-cell">
                                                        <strong>
                                                            {customer.name}
                                                        </strong>
                                                        <span>
                                                            {customer.email ||
                                                                customer.phone ||
                                                                "—"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="orders-date-cell">
                                                    {formatDate(
                                                        order.createdAt,
                                                    )}
                                                </td>

                                                <td>
                                                    {items.reduce(
                                                        (sum, item) =>
                                                            sum +
                                                            (Number(
                                                                item.quantity,
                                                            ) || 1),
                                                        0,
                                                    )}
                                                </td>

                                                <td className="orders-amount">
                                                    {formatPrice(
                                                        getOrderTotal(order),
                                                    )}
                                                </td>

                                                <td>
                                                    <label className="orders-status-select">
                                                        <select
                                                            value={status}
                                                            disabled={
                                                                updatingId ===
                                                                    orderId ||
                                                                !STATUSES.includes(
                                                                    status,
                                                                )
                                                            }
                                                            onChange={(event) =>
                                                                updateStatus(
                                                                    orderId,
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            aria-label={`Update status for order ${orderId}`}
                                                        >
                                                            {!STATUSES.includes(
                                                                status,
                                                            ) && (
                                                                <option
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {status}
                                                                </option>
                                                            )}
                                                            {STATUSES.map(
                                                                (option) => (
                                                                    <option
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                            option.slice(
                                                                                1,
                                                                            )}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <ChevronDown
                                                            size={14}
                                                        />
                                                    </label>
                                                    {updatingId === orderId && (
                                                        <small className="orders-updating">
                                                            Updating...
                                                        </small>
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="orders-view-btn"
                                                        onClick={() =>
                                                            setSelectedOrder(
                                                                order,
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="orders-table-footer">
                            Showing {filteredOrders.length} of {orders.length}{" "}
                            orders
                        </div>
                    </>
                )}
            </section>

            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    updating={
                        updatingId ===
                        String(selectedOrder._id || selectedOrder.id)
                    }
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={updateStatus}
                />
            )}
        </main>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <article className="orders-stat-card">
            <span className="orders-stat-icon">{icon}</span>
            <div>
                <p>{label}</p>
                <strong>{value}</strong>
            </div>
        </article>
    );
}

function OrderDetails({ order, updating, onClose, onStatusChange }) {
    const orderId = String(order._id || order.id);
    const customer = getCustomer(order);
    const items = getItems(order);
    const address = order.shippingAddress || {};
    const status = getStatus(order);

    return (
        <div className="orders-modal-backdrop" onMouseDown={onClose}>
            <section
                className="orders-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="orders-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="orders-modal-header">
                    <div>
                        <span className="orders-eyebrow">ORDER DETAILS</span>
                        <h2 id="orders-modal-title">
                            Order #{orderId.slice(-8).toUpperCase()}
                        </h2>
                        <p>
                            <CalendarDays size={15} />
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="orders-modal-close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="orders-modal-body">
                    <section className="orders-detail-section">
                        <h3>
                            <UserRound size={17} /> Customer
                        </h3>
                        <p>
                            <strong>{customer.name}</strong>
                        </p>
                        {customer.email && <p>{customer.email}</p>}
                        {customer.phone && <p>{customer.phone}</p>}
                    </section>

                    <section className="orders-detail-section">
                        <h3>
                            <MapPin size={17} /> Delivery Address
                        </h3>
                        <p>
                            {[
                                address.addressLine,
                                address.city,
                                address.state,
                                address.postalCode,
                            ]
                                .filter(Boolean)
                                .join(", ") || "Address not available"}
                        </p>
                    </section>

                    <section className="orders-detail-section">
                        <h3>
                            <Package size={17} /> Products
                        </h3>

                        {items.length === 0 ? (
                            <p>Order items not available.</p>
                        ) : (
                            <div className="orders-detail-products">
                                {items.map((item, index) => {
                                    const image = getImageSrc(
                                        item.images?.[0] || item.image,
                                    );

                                    return (
                                        <div
                                            className="orders-detail-product"
                                            key={`${item.product || item.id || item.name || "item"}-${index}`}
                                        >
                                            <div className="orders-detail-image">
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={
                                                            item.name ||
                                                            "Product"
                                                        }
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <Package size={22} />
                                                )}
                                            </div>

                                            <div className="orders-detail-product-info">
                                                <strong>
                                                    {item.name || "Product"}
                                                </strong>
                                                <span>
                                                    Qty:{" "}
                                                    {Number(item.quantity) || 1}
                                                </span>
                                            </div>

                                            <strong>
                                                {formatPrice(
                                                    (Number(item.price) || 0) *
                                                        (Number(
                                                            item.quantity,
                                                        ) || 1),
                                                )}
                                            </strong>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <section className="orders-detail-section orders-payment-info">
                        <div>
                            <span>Payment method</span>
                            <strong>
                                {String(
                                    order.paymentMethod || "cod",
                                ).toLowerCase() === "cod"
                                    ? "Cash on Delivery"
                                    : order.paymentMethod}
                            </strong>
                        </div>
                        <div>
                            <span>Order total</span>
                            <strong>{formatPrice(getOrderTotal(order))}</strong>
                        </div>
                    </section>

                    <section className="orders-detail-section">
                        <h3>Update Order Status</h3>
                        <label className="orders-modal-status">
                            <select
                                value={status}
                                disabled={
                                    updating || !STATUSES.includes(status)
                                }
                                onChange={(event) =>
                                    onStatusChange(orderId, event.target.value)
                                }
                            >
                                {!STATUSES.includes(status) && (
                                    <option value={status}>{status}</option>
                                )}
                                {STATUSES.map((option) => (
                                    <option value={option} key={option}>
                                        {option.charAt(0).toUpperCase() +
                                            option.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {updating && <span>Updating...</span>}
                        </label>
                    </section>
                </div>
            </section>
        </div>
    );
}
