import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Mail,
    RefreshCw,
    Search,
    MessageSquare,
    Clock3,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminRequest } from "../services/api";
import "./ContactEnquiries.css";

const PAGE_SIZE = 10;

const STATUSES = [
    { value: "new", label: "New" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
];

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const statusLabel = (status) =>
    STATUSES.find((item) => item.value === status)?.label || status;

export default function ContactEnquiries() {
    const navigate = useNavigate();

    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [updatingId, setUpdatingId] = useState("");

    const loadEnquiries = useCallback(
        async (refresh = false) => {
            const token = localStorage.getItem("medical-admin-token");

            if (!token) {
                navigate("/admin/login", { replace: true });
                return;
            }

            refresh ? setRefreshing(true) : setLoading(true);
            setError("");

            try {
                const response = await adminRequest("/api/contact/admin/all");
                const result = response?.data ?? response;

                if (result?.success === false) {
                    throw new Error(
                        result.message || "Unable to load enquiries.",
                    );
                }

                setEnquiries(result?.enquiries ?? []);
            } catch (err) {
                const message = err.message || "Unable to load enquiries.";
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
        loadEnquiries();
    }, [loadEnquiries]);

    const filteredEnquiries = useMemo(() => {
        const query = search.trim().toLowerCase();

        return enquiries.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            const fullName = `${item.firstName || ""} ${item.lastName || ""}`;

            const matchesSearch =
                !query ||
                fullName.toLowerCase().includes(query) ||
                (item.email || "").toLowerCase().includes(query) ||
                (item.message || "").toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [enquiries, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEnquiries.length / PAGE_SIZE),
    );

    const visibleEnquiries = filteredEnquiries.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
    );

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const counts = useMemo(
        () => ({
            total: enquiries.length,
            new: enquiries.filter((item) => item.status === "new").length,
            progress: enquiries.filter((item) => item.status === "in-progress")
                .length,
            resolved: enquiries.filter((item) => item.status === "resolved")
                .length,
        }),
        [enquiries],
    );

    const updateStatus = async (id, status) => {
        setUpdatingId(id);
        setError("");

        try {
            const response = await adminRequest(
                `/api/contact/admin/${id}/status`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status }),
                },
            );

            const result = response?.data ?? response;

            if (result?.success === false) {
                throw new Error(result.message || "Unable to update status.");
            }

            setEnquiries((current) =>
                current.map((item) =>
                    item._id === id ? { ...item, status } : item,
                ),
            );

            setSelected((current) =>
                current?._id === id ? { ...current, status } : current,
            );
        } catch (err) {
            setError(err.message || "Unable to update enquiry status.");
        } finally {
            setUpdatingId("");
        }
    };

    return (
        <main className="admin-main enquiries-page">
            <header className="admin-topbar">
                <div>
                    <h1>Contact Enquiries</h1>
                    <p>
                        Manage messages submitted through your Contact Us page.
                    </p>
                </div>

                <button
                    type="button"
                    className="enquiries-refresh"
                    onClick={() => loadEnquiries(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "enquiries-spin" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {error && (
                <div className="enquiries-error" role="alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button type="button" onClick={() => setError("")}>
                        <X size={16} />
                    </button>
                </div>
            )}

            <section className="enquiries-stats">
                <article>
                    <span className="enquiries-stat-icon blue">
                        <Mail size={21} />
                    </span>
                    <div>
                        <p>Total enquiries</p>
                        <strong>{counts.total}</strong>
                    </div>
                </article>

                <article>
                    <span className="enquiries-stat-icon orange">
                        <MessageSquare size={21} />
                    </span>
                    <div>
                        <p>New</p>
                        <strong>{counts.new}</strong>
                    </div>
                </article>

                <article>
                    <span className="enquiries-stat-icon purple">
                        <Clock3 size={21} />
                    </span>
                    <div>
                        <p>In progress</p>
                        <strong>{counts.progress}</strong>
                    </div>
                </article>

                <article>
                    <span className="enquiries-stat-icon green">
                        <CheckCircle2 size={21} />
                    </span>
                    <div>
                        <p>Resolved</p>
                        <strong>{counts.resolved}</strong>
                    </div>
                </article>
            </section>

            <section className="enquiries-panel">
                <div className="enquiries-toolbar">
                    <div className="enquiries-search">
                        <Search size={18} />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name, email or message..."
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        aria-label="Filter enquiries by status"
                    >
                        <option value="all">All statuses</option>
                        {STATUSES.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="enquiries-empty">
                        <RefreshCw size={24} className="enquiries-spin" />
                        <p>Loading enquiries...</p>
                    </div>
                ) : visibleEnquiries.length === 0 ? (
                    <div className="enquiries-empty">
                        <Mail size={32} />
                        <strong>No enquiries found</strong>
                        <p>
                            {enquiries.length
                                ? "Try changing your search or status filter."
                                : "Messages submitted through Contact Us will appear here."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="enquiries-table-wrap">
                            <table className="enquiries-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Message</th>
                                        <th>Received</th>
                                        <th>Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleEnquiries.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="enquiries-customer">
                                                    <strong>
                                                        {item.firstName}{" "}
                                                        {item.lastName}
                                                    </strong>
                                                    <a
                                                        href={`mailto:${item.email}`}
                                                    >
                                                        {item.email}
                                                    </a>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="enquiries-message-preview">
                                                    {item.message}
                                                </p>
                                            </td>
                                            <td className="enquiries-date">
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td>
                                                <select
                                                    className={`enquiries-status-select status-${item.status}`}
                                                    value={item.status}
                                                    disabled={
                                                        updatingId === item._id
                                                    }
                                                    onChange={(event) =>
                                                        updateStatus(
                                                            item._id,
                                                            event.target.value,
                                                        )
                                                    }
                                                    aria-label={`Update status for ${item.firstName}`}
                                                >
                                                    {STATUSES.map((status) => (
                                                        <option
                                                            key={status.value}
                                                            value={status.value}
                                                        >
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="enquiries-view-button"
                                                    onClick={() =>
                                                        setSelected(item)
                                                    }
                                                    aria-label="View full enquiry"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="enquiries-pagination">
                            <span>
                                Showing {(page - 1) * PAGE_SIZE + 1}–
                                {Math.min(
                                    page * PAGE_SIZE,
                                    filteredEnquiries.length,
                                )}{" "}
                                of {filteredEnquiries.length}
                            </span>

                            <div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.max(1, current - 1),
                                        )
                                    }
                                    disabled={page === 1}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1,
                                )
                                    .filter(
                                        (number) =>
                                            number === 1 ||
                                            number === totalPages ||
                                            Math.abs(number - page) <= 1,
                                    )
                                    .reduce(
                                        (result, number, index, numbers) => {
                                            if (
                                                index > 0 &&
                                                number - numbers[index - 1] > 1
                                            ) {
                                                result.push(
                                                    "ellipsis-" + number,
                                                );
                                            }
                                            result.push(number);
                                            return result;
                                        },
                                        [],
                                    )
                                    .map((number) =>
                                        typeof number === "string" ? (
                                            <span
                                                key={number}
                                                className="enquiries-ellipsis"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                key={number}
                                                className={
                                                    page === number
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => setPage(number)}
                                                aria-current={
                                                    page === number
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {number}
                                            </button>
                                        ),
                                    )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.min(totalPages, current + 1),
                                        )
                                    }
                                    disabled={page === totalPages}
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {selected && (
                <div
                    className="enquiries-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setSelected(null);
                    }}
                >
                    <section
                        className="enquiries-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="enquiry-modal-title"
                    >
                        <header>
                            <div>
                                <span className="enquiries-modal-eyebrow">
                                    CONTACT MESSAGE
                                </span>
                                <h2 id="enquiry-modal-title">
                                    {selected.firstName} {selected.lastName}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                aria-label="Close details"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div className="enquiries-modal-content">
                            <p>
                                <strong>Email</strong>
                                <a href={`mailto:${selected.email}`}>
                                    {selected.email}
                                </a>
                            </p>
                            <p>
                                <strong>Received</strong>
                                <span>{formatDate(selected.createdAt)}</span>
                            </p>
                            <p>
                                <strong>Status</strong>
                                <span>{statusLabel(selected.status)}</span>
                            </p>
                            <div className="enquiries-full-message">
                                <strong>Message</strong>
                                <p>{selected.message}</p>
                            </div>
                        </div>

                        <footer>
                            <a
                                className="enquiries-reply-button"
                                href={`mailto:${selected.email}`}
                            >
                                <Mail size={16} />
                                Reply by email
                            </a>
                            <button
                                type="button"
                                className="enquiries-close-button"
                                onClick={() => setSelected(null)}
                            >
                                Close
                            </button>
                        </footer>
                    </section>
                </div>
            )}
        </main>
    );
}
