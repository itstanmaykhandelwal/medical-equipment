
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Search,
    RefreshCw,
    ShoppingCart,
    IndianRupee,
    UserRound,
    X,
    Mail,
    Phone,
    CalendarDays,
    Clock3,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { adminRequest } from "../services/api";
import "./Customers.css";

const CUSTOMERS_PER_PAGE = 10;

const money = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const dateFormat = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const initials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "C";

export default function Customers() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadCustomers = useCallback(
        async (refresh = false) => {
            if (!localStorage.getItem("medical-admin-token")) {
                navigate("/admin/login", { replace: true });
                return;
            }

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const response = await adminRequest("/api/admin/customers");
                const result = response?.data ?? response;

                if (result?.success === false) {
                    throw new Error(
                        result.message || "Unable to load customers."
                    );
                }

                const customerList =
                    result?.customers ?? result?.data?.customers ?? [];

                if (!Array.isArray(customerList)) {
                    throw new Error("Invalid customers response from server.");
                }

                setCustomers(customerList);
            } catch (err) {
                const message =
                    err.message || "Unable to load customers.";

                setError(message);

                if (
                    /session|token|unauthorized|forbidden|expired/i.test(
                        message
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
        [navigate]
    );

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    // Search customers by name, email or phone.
    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return customers;

        return customers.filter((customer) =>
            [customer.name, customer.email, customer.phone].some((value) =>
                String(value || "").toLowerCase().includes(query)
            )
        );
    }, [customers, search]);

    // Return to page 1 whenever the search changes.
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(
        filteredCustomers.length / CUSTOMERS_PER_PAGE
    );

    const safeCurrentPage = Math.min(
        currentPage,
        Math.max(totalPages, 1)
    );

    const startIndex = (safeCurrentPage - 1) * CUSTOMERS_PER_PAGE;

    const paginatedCustomers = filteredCustomers.slice(
        startIndex,
        startIndex + CUSTOMERS_PER_PAGE
    );

    const startItem = filteredCustomers.length ? startIndex + 1 : 0;

    const endItem = Math.min(
        startIndex + CUSTOMERS_PER_PAGE,
        filteredCustomers.length
    );

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Show first, last and nearby pages with ellipses.
    const visiblePages = useMemo(() => {
        const pages = [];

        for (let page = 1; page <= totalPages; page++) {
            if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - safeCurrentPage) <= 1
            ) {
                pages.push(page);
            }
        }

        return pages.reduce((result, page, index) => {
            if (
                index > 0 &&
                page - pages[index - 1] > 1
            ) {
                result.push(`ellipsis-${page}`);
            }

            result.push(page);
            return result;
        }, []);
    }, [totalPages, safeCurrentPage]);

    const orderingCustomers = customers.filter(
        (customer) => Number(customer.orderCount) > 0
    ).length;

    const totalOrderValue = customers.reduce(
        (sum, customer) => sum + Number(customer.totalSpent || 0),
        0
    );

    return (
        <main className="admin-main customers-page">
            <header className="admin-topbar">
                <div>
                    <h1>Customers</h1>
                    <p>
                        Manage your registered customers and their activity
                    </p>
                </div>

                <button
                    className="customers-refresh"
                    type="button"
                    onClick={() => loadCustomers(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "customers-spin" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {error && (
                <div className="customers-alert" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => loadCustomers(true)}
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Summary cards */}
            <section className="customers-summary">
                <article className="customers-summary-card">
                    <span className="customers-summary-icon blue">
                        <Users size={22} />
                    </span>
                    <div>
                        <p>Total customers</p>
                        <strong>{customers.length}</strong>
                        <small>Registered non-admin accounts</small>
                    </div>
                </article>

                <article className="customers-summary-card">
                    <span className="customers-summary-icon green">
                        <ShoppingCart size={22} />
                    </span>
                    <div>
                        <p>Customers with orders</p>
                        <strong>{orderingCustomers}</strong>
                        <small>
                            Customers who placed at least one order
                        </small>
                    </div>
                </article>

                <article className="customers-summary-card">
                    <span className="customers-summary-icon purple">
                        <IndianRupee size={22} />
                    </span>
                    <div>
                        <p>Order value</p>
                        <strong>{money(totalOrderValue)}</strong>
                        <small>Excludes cancelled orders</small>
                    </div>
                </article>
            </section>

            {/* Customers table */}
            <section className="customers-panel">
                <div className="customers-toolbar">
                    <div>
                        <h2>All Customers</h2>
                        <p>
                            {loading
                                ? "Loading customer records..."
                                : `${filteredCustomers.length} customer${
                                      filteredCustomers.length === 1 ? "" : "s"
                                  } found`}
                        </p>
                    </div>

                    <label className="customers-search">
                        <Search size={18} />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search name, email or phone"
                            aria-label="Search customers"
                        />

                        {search && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setSearch("")}
                            >
                                <X size={15} />
                            </button>
                        )}
                    </label>
                </div>

                {loading ? (
                    <div className="customers-state">
                        <RefreshCw
                            size={22}
                            className="customers-spin"
                        />
                        <span>Loading customers...</span>
                    </div>
                ) : error && customers.length === 0 ? (
                    <div className="customers-state">
                        <Users size={30} />
                        <strong>Couldn't load customers</strong>
                        <span>
                            Check your connection and try again.
                        </span>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="customers-state">
                        <UserRound size={30} />
                        <strong>
                            {search
                                ? "No matching customers"
                                : "No customers found"}
                        </strong>
                        <span>
                            {search
                                ? "Try another name, email or phone number."
                                : "Registered customers will appear here."}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="customers-table-wrap">
                            <table className="customers-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Joined</th>
                                        <th>Orders</th>
                                        <th>Order value</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td>
                                                <div className="customers-person">
                                                    <span className="customers-avatar">
                                                        {initials(customer.name)}
                                                    </span>

                                                    <span className="customers-person-info">
                                                        <strong>
                                                            {customer.name}
                                                        </strong>
                                                        <small>
                                                            {customer.email ||
                                                                "No email available"}
                                                        </small>
                                                    </span>
                                                </div>
                                            </td>

                                            <td>{customer.phone || "—"}</td>

                                            <td>
                                                {dateFormat(customer.createdAt)}
                                            </td>

                                            <td>
                                                <span className="customers-order-count">
                                                    {customer.orderCount || 0}
                                                </span>
                                            </td>

                                            <td className="customers-value">
                                                {money(customer.totalSpent)}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="customers-details-btn"
                                                    onClick={() =>
                                                        setSelectedCustomer(
                                                            customer
                                                        )
                                                    }
                                                >
                                                    View details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredCustomers.length > 0 && (
                            <div className="customers-pagination">
                                <p>
                                    Showing <strong>{startItem}–{endItem}</strong>{" "}
                                    of{" "}
                                    <strong>
                                        {filteredCustomers.length}
                                    </strong>{" "}
                                    customers
                                </p>

                                <div className="customers-pagination-controls">
                                    <button
                                        type="button"
                                        className="customers-page-arrow"
                                        disabled={safeCurrentPage === 1}
                                        onClick={() =>
                                            goToPage(safeCurrentPage - 1)
                                        }
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={17} />
                                        <span>Previous</span>
                                    </button>

                                    {visiblePages.map((page) =>
                                        typeof page === "string" ? (
                                            <span
                                                key={page}
                                                className="customers-page-ellipsis"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                type="button"
                                                className={`customers-page-number ${
                                                    safeCurrentPage === page
                                                        ? "active"
                                                        : ""
                                                }`}
                                                aria-current={
                                                    safeCurrentPage === page
                                                        ? "page"
                                                        : undefined
                                                }
                                                onClick={() => goToPage(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        className="customers-page-arrow"
                                        disabled={
                                            safeCurrentPage >= totalPages ||
                                            totalPages === 0
                                        }
                                        onClick={() =>
                                            goToPage(safeCurrentPage + 1)
                                        }
                                        aria-label="Next page"
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={17} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Customer details modal */}
            {selectedCustomer && (
                <div
                    className="customers-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedCustomer(null);
                        }
                    }}
                >
                    <section
                        className="customers-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="customer-modal-title"
                    >
                        <header className="customers-modal-header">
                            <div>
                                <span className="customers-modal-kicker">
                                    CUSTOMER PROFILE
                                </span>
                                <h2 id="customer-modal-title">
                                    Customer details
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="customers-modal-close"
                                aria-label="Close details"
                                onClick={() => setSelectedCustomer(null)}
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div className="customers-profile">
                            <span className="customers-avatar large">
                                {initials(selectedCustomer.name)}
                            </span>

                            <div>
                                <h3>{selectedCustomer.name}</h3>
                                <p>
                                    {selectedCustomer.email ||
                                        "No email available"}
                                </p>
                            </div>
                        </div>

                        <div className="customers-detail-list">
                            <div>
                                <Mail size={18} />
                                <span>
                                    <small>Email</small>
                                    <strong>
                                        {selectedCustomer.email ||
                                            "Not provided"}
                                    </strong>
                                </span>
                            </div>

                            <div>
                                <Phone size={18} />
                                <span>
                                    <small>Phone</small>
                                    <strong>
                                        {selectedCustomer.phone ||
                                            "Not provided"}
                                    </strong>
                                </span>
                            </div>

                            <div>
                                <CalendarDays size={18} />
                                <span>
                                    <small>Registration date</small>
                                    <strong>
                                        {dateFormat(
                                            selectedCustomer.createdAt
                                        )}
                                    </strong>
                                </span>
                            </div>

                            <div>
                                <Clock3 size={18} />
                                <span>
                                    <small>Last order</small>
                                    <strong>
                                        {dateFormat(
                                            selectedCustomer.lastOrderAt
                                        )}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        <div className="customers-profile-stats">
                            <div>
                                <span>Total orders</span>
                                <strong>
                                    {selectedCustomer.orderCount || 0}
                                </strong>
                            </div>

                            <div>
                                <span>Order value</span>
                                <strong>
                                    {money(selectedCustomer.totalSpent)}
                                </strong>
                            </div>
                        </div>

                        <p className="customers-modal-note">
                            Order value excludes cancelled orders and is not
                            necessarily the same as payments received.
                        </p>
                    </section>
                </div>
            )}
        </main>
    );
}
