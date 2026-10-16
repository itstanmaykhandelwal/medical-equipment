import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    ShoppingCart,
    Users,
    RefreshCw,
    TrendingUp,
    Boxes,
    AlertTriangle,
    Clock3,
    ArrowUpRight,
    Activity,
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { adminRequest } from "../services/api";
import "./Dashboard.css";

const ORDERS_PER_PAGE = 5;

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const statusClass = (status = "") =>
    String(status).toLowerCase().replace(/\s+/g, "-");

export default function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [ordersPage, setOrdersPage] = useState(1);

    const loadDashboard = useCallback(
        async (isRefresh = false) => {
            const token = localStorage.getItem("medical-admin-token");

            if (!token) {
                navigate("/admin/login", { replace: true });
                return;
            }

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const response = await adminRequest("/api/admin/dashboard");
                const result = response?.data ?? response;

                if (result?.success === false) {
                    throw new Error(
                        result.message || "Unable to load dashboard.",
                    );
                }

                setDashboard(result?.data ?? result);
                setOrdersPage(1);
            } catch (err) {
                const message = err.message || "Unable to load dashboard.";

                setError(message);

                if (
                    /session|token|unauthorized|forbidden|expired/i.test(
                        message,
                    )
                ) {
                    localStorage.removeItem("medical-admin-token");
                    navigate("/admin/login", { replace: true });
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate],
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const chartData = dashboard?.salesChart ?? [];
    const recentOrders = dashboard?.recentOrders ?? [];

    const totalOrderPages = Math.max(
        1,
        Math.ceil(recentOrders.length / ORDERS_PER_PAGE),
    );

    const paginatedOrders = recentOrders.slice(
        (ordersPage - 1) * ORDERS_PER_PAGE,
        ordersPage * ORDERS_PER_PAGE,
    );

    useEffect(() => {
        if (ordersPage > totalOrderPages) {
            setOrdersPage(totalOrderPages);
        }
    }, [ordersPage, totalOrderPages]);

    if (loading) {
        return (
            <main className="admin-main dashboard-page">
                <header className="admin-topbar">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Medical equipment store overview</p>
                    </div>
                    <span className="admin-status">Admin Portal</span>
                </header>

                <div className="dashboard-loading">
                    <RefreshCw size={22} className="dashboard-spin" />
                    <span>Loading dashboard statistics...</span>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-main dashboard-page">
            <header className="admin-topbar">
                <div>
                    <h1>Dashboard</h1>
                    <p>Medical equipment store overview</p>
                </div>

                <button
                    type="button"
                    className="dashboard-refresh"
                    onClick={() => loadDashboard(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "dashboard-spin" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {error && (
                <div className="dashboard-error">
                    <AlertTriangle size={19} />
                    <span>{error}</span>
                    <button type="button" onClick={() => loadDashboard(true)}>
                        Try again
                    </button>
                </div>
            )}

            {dashboard && (
                <>
                    <section className="dashboard-welcome">
                        <div>
                            <span className="dashboard-eyebrow">
                                STORE OVERVIEW
                            </span>
                            <h2>Welcome back!</h2>
                            <p>
                                Here's what's happening with your store today.
                            </p>
                        </div>

                        <div className="dashboard-welcome-icon">
                            <Activity size={29} />
                        </div>
                    </section>

                    {/* Main statistics */}
                    <section className="dashboard-stat-grid">
                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-top">
                                <span className="dashboard-stat-icon blue">
                                    <Package size={22} />
                                </span>
                                <span className="dashboard-stat-label">
                                    Products
                                </span>
                            </div>
                            <strong>
                                {(dashboard.totalProducts ?? 0).toLocaleString(
                                    "en-IN",
                                )}
                            </strong>
                            <p>Total products in catalogue</p>
                        </article>

                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-top">
                                <span className="dashboard-stat-icon purple">
                                    <ShoppingCart size={22} />
                                </span>
                                <span className="dashboard-stat-label">
                                    Orders
                                </span>
                            </div>
                            <strong>
                                {(dashboard.totalOrders ?? 0).toLocaleString(
                                    "en-IN",
                                )}
                            </strong>
                            <p>All orders received</p>
                        </article>

                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-top">
                                <span className="dashboard-stat-icon green">
                                    <Users size={22} />
                                </span>
                                <span className="dashboard-stat-label">
                                    Customers
                                </span>
                            </div>
                            <strong>
                                {(dashboard.totalCustomers ?? 0).toLocaleString(
                                    "en-IN",
                                )}
                            </strong>
                            <p>Registered customers</p>
                        </article>

                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-top">
                                <span className="dashboard-stat-icon teal">
                                    <TrendingUp size={22} />
                                </span>
                                <span className="dashboard-stat-label">
                                    Sales
                                </span>
                            </div>
                            <strong className="dashboard-sales-value">
                                {formatCurrency(dashboard.totalSales)}
                            </strong>
                            <p>Non-cancelled order value</p>
                        </article>
                    </section>

                    {/* Inventory and pending orders */}
                    <section className="dashboard-secondary-grid">
                        <article className="dashboard-mini-card">
                            <span className="dashboard-mini-icon">
                                <Boxes size={20} />
                            </span>
                            <div>
                                <p>Total stock units</p>
                                <strong>
                                    {(dashboard.totalStock ?? 0).toLocaleString(
                                        "en-IN",
                                    )}
                                </strong>
                            </div>
                        </article>

                        <article className="dashboard-mini-card">
                            <span className="dashboard-mini-icon warning">
                                <AlertTriangle size={20} />
                            </span>
                            <div>
                                <p>Low stock products</p>
                                <strong>
                                    {dashboard.lowStockProducts ?? 0}
                                </strong>
                                <small>Stock between 1–5 units</small>
                            </div>
                        </article>

                        <article className="dashboard-mini-card">
                            <span className="dashboard-mini-icon danger">
                                <Package size={20} />
                            </span>
                            <div>
                                <p>Out of stock</p>
                                <strong>
                                    {dashboard.outOfStockProducts ?? 0}
                                </strong>
                                <small>Products needing restock</small>
                            </div>
                        </article>

                        <article className="dashboard-mini-card">
                            <span className="dashboard-mini-icon pending">
                                <Clock3 size={20} />
                            </span>
                            <div>
                                <p>Pending orders</p>
                                <strong>{dashboard.pendingOrders ?? 0}</strong>
                                <small>Awaiting fulfilment</small>
                            </div>
                        </article>
                    </section>

                    {/* Sales chart */}
                    <section className="dashboard-panel dashboard-chart-panel">
                        <div className="dashboard-panel-header">
                            <div>
                                <h3>Sales Overview</h3>
                                <p>Sales performance over the last 7 days</p>
                            </div>
                            <span className="dashboard-period">
                                Last 7 days
                            </span>
                        </div>

                        {chartData.length > 0 ? (
                            <div className="dashboard-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{
                                            top: 12,
                                            right: 12,
                                            left: 4,
                                            bottom: 4,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="salesGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#2563eb"
                                                    stopOpacity={0.22}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#2563eb"
                                                    stopOpacity={0.01}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            stroke="#e8edf5"
                                            strokeDasharray="4 4"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="label"
                                            tick={{
                                                fill: "#748198",
                                                fontSize: 12,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            dy={10}
                                        />

                                        <YAxis
                                            tickFormatter={(value) =>
                                                value >= 1000
                                                    ? `₹${(value / 1000).toFixed(1)}k`
                                                    : `₹${value}`
                                            }
                                            tick={{
                                                fill: "#748198",
                                                fontSize: 11,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={68}
                                        />

                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === "sales"
                                                    ? formatCurrency(value)
                                                    : value,
                                                name === "sales"
                                                    ? "Sales"
                                                    : "Orders",
                                            ]}
                                            labelStyle={{ color: "#17243b" }}
                                            contentStyle={{
                                                border: "1px solid #e3eaf4",
                                                borderRadius: 12,
                                                boxShadow:
                                                    "0 8px 24px #17243b12",
                                            }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            name="sales"
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            fill="url(#salesGradient)"
                                            activeDot={{ r: 5 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="dashboard-empty-chart">
                                <TrendingUp size={30} />
                                <strong>No sales data yet</strong>
                                <p>
                                    Sales will appear here when orders are
                                    placed.
                                </p>
                            </div>
                        )}

                        <div className="dashboard-chart-summary">
                            <span>
                                <span className="dashboard-dot" />
                                Daily sales
                            </span>
                            <span>
                                {chartData.reduce(
                                    (sum, item) =>
                                        sum + Number(item.orders || 0),
                                    0,
                                )}{" "}
                                orders in this period
                            </span>
                        </div>
                    </section>

                    {/* Recent orders with pagination */}
                    <section className="dashboard-panel dashboard-orders-panel">
                        <div className="dashboard-panel-header">
                            <div>
                                <h3>Recent Orders</h3>
                                <p>Latest orders received by your store</p>
                            </div>

                            <button
                                type="button"
                                className="dashboard-view-all"
                                onClick={() => navigate("/admin/orders")}
                            >
                                View all <ArrowUpRight size={16} />
                            </button>
                        </div>

                        {recentOrders.length > 0 ? (
                            <>
                                <div className="dashboard-table-wrap">
                                    <table className="dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Customer</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>
                                                        <span className="dashboard-order-id">
                                                            #
                                                            {String(order._id)
                                                                .slice(-8)
                                                                .toUpperCase()}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="dashboard-customer">
                                                            <strong>
                                                                {order.user
                                                                    ?.name ||
                                                                    "Customer"}
                                                            </strong>
                                                            <small>
                                                                {order.user
                                                                    ?.email ||
                                                                    ""}
                                                            </small>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            order.createdAt,
                                                        )}
                                                    </td>

                                                    <td className="dashboard-order-amount">
                                                        {formatCurrency(
                                                            order.total,
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`dashboard-order-status ${statusClass(
                                                                order.orderStatus,
                                                            )}`}
                                                        >
                                                            {order.orderStatus ||
                                                                "placed"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {recentOrders.length > ORDERS_PER_PAGE && (
                                    <div className="dashboard-pagination">
                                        <span className="dashboard-pagination-info">
                                            Showing{" "}
                                            {(ordersPage - 1) *
                                                ORDERS_PER_PAGE +
                                                1}
                                            {"–"}
                                            {Math.min(
                                                ordersPage * ORDERS_PER_PAGE,
                                                recentOrders.length,
                                            )}{" "}
                                            of {recentOrders.length} orders
                                        </span>

                                        <div className="dashboard-pagination-actions">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOrdersPage((page) =>
                                                        Math.max(1, page - 1),
                                                    )
                                                }
                                                disabled={ordersPage === 1}
                                            >
                                                Previous
                                            </button>

                                            {Array.from(
                                                { length: totalOrderPages },
                                                (_, index) => index + 1,
                                            ).map((page) => (
                                                <button
                                                    type="button"
                                                    key={page}
                                                    className={
                                                        ordersPage === page
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setOrdersPage(page)
                                                    }
                                                    aria-current={
                                                        ordersPage === page
                                                            ? "page"
                                                            : undefined
                                                    }
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOrdersPage((page) =>
                                                        Math.min(
                                                            totalOrderPages,
                                                            page + 1,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    ordersPage ===
                                                    totalOrderPages
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="dashboard-empty-orders">
                                <ShoppingCart size={27} />
                                <strong>No orders yet</strong>
                                <p>New customer orders will appear here.</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}
