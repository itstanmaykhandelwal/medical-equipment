
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    PackagePlus,
    Pencil,
    Trash2,
    RefreshCw,
    X,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { adminRequest, API_URL } from "../services/api";

const emptyProduct = {
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "0",
    image: "",
    images: [],
    isActive: true,
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const PRODUCTS_PER_PAGE = 10;
const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(price) || 0);

const getImageUrl = (image) => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image)) return image;

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [form, setForm] = useState(emptyProduct);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    const clearSelectedFiles = useCallback(() => {
        setFilePreviews((previews) => {
            previews.forEach((preview) =>
                URL.revokeObjectURL(preview.url)
            );
            return [];
        });
        setSelectedFiles([]);
    }, []);

    useEffect(() => {
        return () => {
            filePreviews.forEach((preview) =>
                URL.revokeObjectURL(preview.url)
            );
        };
    }, [filePreviews]);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await adminRequest("/api/products/admin/all");
            setProducts(Array.isArray(data.products) ? data.products : []);
        } catch (err) {
            setError(err.message || "Unable to load products.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const openAddForm = () => {
        clearSelectedFiles();
        setEditingId("");
        setForm({ ...emptyProduct, images: [] });
        setError("");
        setNotice("");
        setModalOpen(true);
    };

    const openEditForm = (product) => {
        clearSelectedFiles();

        const existingImages =
            Array.isArray(product.images) && product.images.length
                ? product.images
                : product.image
                  ? [product.image]
                  : [];

        setEditingId(product._id);

        setForm({
            name: product.name || "",
            brand: product.brand || "",
            category: product.category || "",
            description: product.description || "",
            price: String(product.price ?? ""),
            oldPrice:
                product.oldPrice == null ? "" : String(product.oldPrice),
            stock: String(product.stock ?? 0),
            image: product.image || "",
            images: existingImages,
            isActive: product.isActive !== false,
        });

        setError("");
        setNotice("");
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving || uploading) return;

        clearSelectedFiles();
        setModalOpen(false);
        setError("");
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageSelection = (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (
            form.images.length + selectedFiles.length + files.length >
            MAX_IMAGES
        ) {
            setError(
                `You can add a maximum of ${MAX_IMAGES} images per product.`
            );
            return;
        }

        const invalidFile = files.find(
            (file) =>
                !ALLOWED_TYPES.includes(file.type) ||
                file.size > MAX_FILE_SIZE
        );

        if (invalidFile) {
            setError(
                "Only JPG, PNG, WEBP or GIF images up to 5 MB each are allowed."
            );
            return;
        }

        setError("");

        const newFiles = files.map((file) => ({
            id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
            file,
            url: URL.createObjectURL(file),
        }));

        setSelectedFiles((current) => [
            ...current,
            ...newFiles.map((item) => item.file),
        ]);

        setFilePreviews((current) => [...current, ...newFiles]);
    };

    const removeExistingImage = (index) => {
        setForm((current) => {
            const images = current.images.filter((_, i) => i !== index);

            return {
                ...current,
                images,
                image: images[0] || "",
            };
        });
    };

    const removeSelectedFile = (index) => {
        const preview = filePreviews[index];

        if (preview) URL.revokeObjectURL(preview.url);

        setSelectedFiles((current) =>
            current.filter((_, i) => i !== index)
        );

        setFilePreviews((current) =>
            current.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setNotice("");

        const price = Number(form.price);
        const stock = Number(form.stock);
        const oldPrice =
            form.oldPrice === "" ? null : Number(form.oldPrice);

        if (
            !form.name.trim() ||
            !form.category.trim() ||
            form.price === "" ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            (oldPrice !== null &&
                (!Number.isFinite(oldPrice) || oldPrice < 0))
        ) {
            setError(
                "Please enter a valid name, category, price and stock."
            );
            setSaving(false);
            return;
        }

        if (form.images.length + selectedFiles.length > MAX_IMAGES) {
            setError(
                `You can add a maximum of ${MAX_IMAGES} images per product.`
            );
            setSaving(false);
            return;
        }

        try {
            let uploadedImages = [];

            if (selectedFiles.length > 0) {
                setUploading(true);

                const imageFormData = new FormData();

                selectedFiles.forEach((file) => {
                    imageFormData.append("images", file);
                });

                const token = localStorage.getItem("medical-admin-token");

                const response = await fetch(
                    `${API_URL}/api/uploads/images`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: imageFormData,
                    }
                );

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        result.message || "Image upload failed."
                    );
                }

                uploadedImages = result.images || [];
            }

            const finalImages = [...form.images, ...uploadedImages];

            const payload = {
                name: form.name.trim(),
                brand: form.brand.trim(),
                category: form.category.trim(),
                description: form.description.trim(),
                image: finalImages[0] || form.image.trim(),
                images: finalImages,
                price,
                oldPrice,
                stock,
                isActive: form.isActive,
            };

            const data = await adminRequest(
                editingId
                    ? `/api/products/${editingId}`
                    : "/api/products",
                {
                    method: editingId ? "PATCH" : "POST",
                    body: JSON.stringify(payload),
                }
            );

            clearSelectedFiles();
            setModalOpen(false);
            setNotice(data.message || "Product saved successfully.");

            await loadProducts();
        } catch (err) {
            setError(err.message || "Unable to save product.");
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}" permanently? This cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setNotice("");

        try {
            const data = await adminRequest(
                `/api/products/${product._id}`,
                { method: "DELETE" }
            );

            setNotice(data.message || "Product deleted.");
            await loadProducts();
        } catch (err) {
            setError(err.message || "Unable to delete product.");
        }
    };

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) =>
            !query ||
            [product.name, product.brand, product.category, product.slug]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                )
        );
    }, [products, search]);

    // Reset to the first page when the search changes.
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(
        filteredProducts.length / PRODUCTS_PER_PAGE
    );

    const safeCurrentPage = Math.min(
        currentPage,
        Math.max(totalPages, 1)
    );

    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + PRODUCTS_PER_PAGE
    );

    const startItem = filteredProducts.length ? startIndex + 1 : 0;
    const endItem = Math.min(
        startIndex + PRODUCTS_PER_PAGE,
        filteredProducts.length
    );

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const paginationItems = useMemo(() => {
        const visiblePages = [];

        for (let page = 1; page <= totalPages; page++) {
            if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - safeCurrentPage) <= 1
            ) {
                visiblePages.push(page);
            }
        }

        return visiblePages.reduce((result, page, index) => {
            if (
                index > 0 &&
                page - visiblePages[index - 1] > 1
            ) {
                result.push(`ellipsis-${page}`);
            }

            result.push(page);
            return result;
        }, []);
    }, [totalPages, safeCurrentPage]);

    return (
        <main className="products-admin-page">
            <header className="products-admin-header">
                <div>
                    <Link
                        className="products-back-link"
                        to="/admin/dashboard"
                    >
                        <ArrowLeft size={17} />
                        Dashboard
                    </Link>

                    <h1>Product Management</h1>
                    <p>
                        Add and manage your medical equipment catalogue.
                    </p>
                </div>

                <button
                    type="button"
                    className="products-primary-btn"
                    onClick={openAddForm}
                >
                    <PackagePlus size={18} />
                    Add Product
                </button>
            </header>

            {error && (
                <div
                    className="products-alert products-alert-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {notice && (
                <div
                    className="products-alert products-alert-success"
                    role="status"
                >
                    {notice}
                </div>
            )}

            <section className="products-table-panel">
                <div className="products-table-toolbar">
                    <div>
                        <h2>All Products</h2>
                        <p>
                            {products.length} products in your catalogue
                        </p>
                    </div>

                    <label className="products-search">
                        <Search size={18} />
                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search name, brand or category"
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

                    <button
                        type="button"
                        className="products-refresh-btn"
                        onClick={loadProducts}
                        disabled={loading}
                        aria-label="Refresh products"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? "products-spin" : ""}
                        />
                    </button>
                </div>

                {loading ? (
                    <div className="products-empty-state">
                        Loading products...
                    </div>
                ) : error && products.length === 0 ? (
                    <div className="products-empty-state">
                        Products could not be loaded. Check the error above.
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="products-empty-state">
                        {search
                            ? "No products match your search."
                            : "No products yet. Click Add Product to create your first product."}
                    </div>
                ) : (
                    <>
                        <div className="products-table-scroll">
                            <table className="products-admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedProducts.map((product) => {
                                        const productImage =
                                            product.images?.[0] ||
                                            product.image;

                                        const imagePath = productImage
                                            ? productImage.startsWith("/") ||
                                              /^https?:\/\//i.test(productImage)
                                                ? productImage
                                                : `/images/${productImage}`
                                            : "";

                                        return (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="products-table-product">
                                                        {productImage ? (
                                                            <img
                                                                src={getImageUrl(imagePath)}
                                                                alt={product.name}
                                                                onError={(event) => {
                                                                    event.currentTarget.style.visibility =
                                                                        "hidden";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="products-image-placeholder">
                                                                <PackagePlus size={20} />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <strong>
                                                                {product.name}
                                                            </strong>
                                                            <span>
                                                                {product.brand ||
                                                                    "No brand"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>{product.category}</td>

                                                <td>
                                                    {formatPrice(product.price)}
                                                </td>

                                                <td>{product.stock ?? 0}</td>

                                                <td>
                                                    <span
                                                        className={`products-status ${
                                                            product.isActive
                                                                ? "products-status-active"
                                                                : "products-status-inactive"
                                                        }`}
                                                    >
                                                        {product.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="products-row-actions">
                                                        <button
                                                            type="button"
                                                            className="products-icon-btn"
                                                            title="Edit product"
                                                            aria-label={`Edit ${product.name}`}
                                                            onClick={() =>
                                                                openEditForm(product)
                                                            }
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="products-icon-btn products-delete-btn"
                                                            title="Delete product"
                                                            aria-label={`Delete ${product.name}`}
                                                            onClick={() =>
                                                                handleDelete(product)
                                                            }
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="products-pagination">
                            <p>
                                Showing <strong>{startItem}–{endItem}</strong>{" "}
                                of{" "}
                                <strong>{filteredProducts.length}</strong>{" "}
                                products
                            </p>

                            <div className="products-pagination-controls">
                                <button
                                    type="button"
                                    className="products-page-arrow"
                                    disabled={safeCurrentPage === 1}
                                    onClick={() =>
                                        goToPage(safeCurrentPage - 1)
                                    }
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={17} />
                                    <span>Previous</span>
                                </button>

                                {paginationItems.map((page) =>
                                    typeof page === "string" ? (
                                        <span
                                            key={page}
                                            className="products-page-ellipsis"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            type="button"
                                            className={`products-page-number ${
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
                                    className="products-page-arrow"
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
                    </>
                )}
            </section>

            {modalOpen && (
                <div className="products-modal-backdrop">
                    <section
                        className="products-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="product-modal-title"
                    >
                        <header className="products-modal-header">
                            <div>
                                <h2 id="product-modal-title">
                                    {editingId ? "Edit Product" : "Add Product"}
                                </h2>
                                <p>Fields marked * are required.</p>
                            </div>

                            <button
                                type="button"
                                className="products-icon-btn"
                                onClick={closeModal}
                                aria-label="Close form"
                                disabled={saving || uploading}
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <form
                            className="products-form"
                            onSubmit={handleSubmit}
                        >
                            <label>
                                Product name *
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    maxLength={150}
                                />
                            </label>

                            <div className="products-form-grid">
                                <label>
                                    Brand
                                    <input
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        maxLength={100}
                                    />
                                </label>

                                <label>
                                    Category *
                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Price (₹) *
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Old price (₹)
                                    <input
                                        name="oldPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.oldPrice}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Stock quantity *
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={form.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="products-image-upload">
                                <label>
                                    <span>
                                        Product images (maximum 10, up to 5 MB
                                        each)
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        multiple
                                        onChange={handleImageSelection}
                                        disabled={
                                            saving ||
                                            uploading ||
                                            form.images.length +
                                                selectedFiles.length >=
                                                MAX_IMAGES
                                        }
                                    />
                                </label>

                                <div className="products-image-previews">
                                    {form.images.map((image, index) => (
                                        <div
                                            className="products-image-preview"
                                            key={`existing-${image}-${index}`}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`Product image ${index + 1}`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingImage(index)
                                                }
                                                disabled={saving || uploading}
                                                aria-label="Remove existing image"
                                            >
                                                <X size={16} />
                                            </button>

                                            {index === 0 && (
                                                <span className="products-image-primary">
                                                    Main
                                                </span>
                                            )}
                                        </div>
                                    ))}

                                    {filePreviews.map((preview, index) => (
                                        <div
                                            className="products-image-preview"
                                            key={preview.id}
                                        >
                                            <img
                                                src={preview.url}
                                                alt={preview.file.name}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSelectedFile(index)
                                                }
                                                disabled={saving || uploading}
                                                aria-label="Remove selected image"
                                            >
                                                <X size={16} />
                                            </button>

                                            {form.images.length === 0 &&
                                                index === 0 && (
                                                    <span className="products-image-primary">
                                                        Main
                                                    </span>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                <p className="products-image-help">
                                    Select multiple images together. The first
                                    image is used as the main product image.
                                </p>
                            </div>

                            <label>
                                Description
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    maxLength={5000}
                                />
                            </label>

                            <label className="products-checkbox-label">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />
                                Product is active and visible on the customer
                                website
                            </label>

                            {error && (
                                <div
                                    className="products-alert products-alert-error"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            <footer className="products-form-actions">
                                <button
                                    type="button"
                                    className="products-secondary-btn"
                                    onClick={closeModal}
                                    disabled={saving || uploading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="products-primary-btn"
                                    disabled={saving || uploading}
                                >
                                    {uploading
                                        ? "Uploading images..."
                                        : saving
                                          ? "Saving..."
                                          : editingId
                                            ? "Save Changes"
                                            : "Create Product"}
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}
