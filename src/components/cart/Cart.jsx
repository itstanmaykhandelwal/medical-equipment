import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const getProductId = (product) => product?._id ?? product?.id;

const formatPrice = (price) => {
    const value = Number(String(price ?? 0).replace(/[$,₹]/g, ""));

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);
};

const getImageSrc = (image) => {
    if (!image || typeof image !== "string") return "";

    const src = image.trim();

    if (!src) return "";

    // Full URL, for example Cloudinary or another image host.
    if (/^https?:\/\//i.test(src)) {
        return src;
    }

    // Images uploaded to the Express backend.
    if (src.startsWith("/uploads/")) {
        return `${API_URL}${src}`;
    }

    // Other root-relative paths, such as /images/product.jpg.
    if (src.startsWith("/")) {
        return src;
    }

    // Legacy filenames stored in the frontend public/images folder.
    return `/images/${src}`;
};

const Cart = () => {
    const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } =
        useCart();

    const navigate = useNavigate();

    return (
        <main className="cart-page">
            <section className="cart-banner">
                <div className="cart-banner-content">
                    <h1>Cart</h1>

                    <p className="cart-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>-</span>
                        <span>Cart</span>
                    </p>
                </div>
            </section>

            <section className="cart-section">
                <div className="cart-container">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-message">
                            <span className="cart-empty-icon">□</span>
                            <p>Your cart is currently empty.</p>

                            <Link to="/products" className="cart-return-link">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <div className="cart-items-wrapper">
                                <div className="cart-items-heading">
                                    <h2>Your Items</h2>
                                    <span>{cartCount} items</span>
                                </div>

                                <div className="cart-items">
                                    {cartItems.map((item) => {
                                        const productId = getProductId(item);

                                        const productPath = `/product/${
                                            item.slug || productId
                                        }`;

                                        const imageSrc = getImageSrc(
                                            item.images?.[0] || item.image,
                                        );

                                        const quantity =
                                            Number(item.quantity) || 1;
                                        const stock =
                                            item.stock == null
                                                ? null
                                                : Number(item.stock);

                                        return (
                                            <article
                                                className="cart-item"
                                                key={String(productId)}
                                            >
                                                <Link
                                                    to={productPath}
                                                    className="cart-item-image"
                                                >
                                                    {imageSrc ? (
                                                        <>
                                                            <img
                                                                src={imageSrc}
                                                                alt={
                                                                    item.name ||
                                                                    "Product"
                                                                }
                                                                loading="lazy"
                                                                onError={(
                                                                    event,
                                                                ) => {
                                                                    event.currentTarget.style.display =
                                                                        "none";

                                                                    const fallback =
                                                                        event
                                                                            .currentTarget
                                                                            .nextElementSibling;

                                                                    if (
                                                                        fallback
                                                                    ) {
                                                                        fallback.style.display =
                                                                            "inline";
                                                                    }
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "none",
                                                                }}
                                                            >
                                                                No image
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span>No image</span>
                                                    )}
                                                </Link>

                                                <div className="cart-item-details">
                                                    <Link
                                                        to={productPath}
                                                        className="cart-item-name"
                                                    >
                                                        {item.name || "Product"}
                                                    </Link>

                                                    <p className="cart-item-price">
                                                        {formatPrice(
                                                            item.price,
                                                        )}
                                                    </p>

                                                    <div className="cart-item-actions">
                                                        <div className="cart-quantity">
                                                            <button
                                                                type="button"
                                                                aria-label="Decrease quantity"
                                                                disabled={
                                                                    quantity <=
                                                                    1
                                                                }
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        productId,
                                                                        quantity -
                                                                            1,
                                                                    )
                                                                }
                                                            >
                                                                <Minus
                                                                    size={15}
                                                                />
                                                            </button>

                                                            <span>
                                                                {quantity}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                aria-label="Increase quantity"
                                                                disabled={
                                                                    stock !==
                                                                        null &&
                                                                    (!Number.isFinite(
                                                                        stock,
                                                                    ) ||
                                                                        quantity >=
                                                                            stock)
                                                                }
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        productId,
                                                                        quantity +
                                                                            1,
                                                                    )
                                                                }
                                                            >
                                                                <Plus
                                                                    size={15}
                                                                />
                                                            </button>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="cart-remove-btn"
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    productId,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                            Remove
                                                        </button>
                                                    </div>

                                                    {stock !== null &&
                                                        stock <= 0 && (
                                                            <p role="status">
                                                                Currently out of
                                                                stock
                                                            </p>
                                                        )}

                                                    {stock !== null &&
                                                        stock > 0 &&
                                                        quantity > stock && (
                                                            <p role="status">
                                                                Only {stock}{" "}
                                                                item(s)
                                                                available.
                                                            </p>
                                                        )}
                                                </div>

                                                <div className="cart-item-total">
                                                    {formatPrice(
                                                        (Number(item.price) ||
                                                            0) * quantity,
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>

                                <Link
                                    to="/products"
                                    className="cart-return-link"
                                >
                                    Return to shop
                                </Link>
                            </div>

                            <aside className="cart-summary">
                                <h2>Cart totals</h2>

                                <div className="cart-summary-row">
                                    <span>Subtotal</span>
                                    <strong>{formatPrice(cartTotal)}</strong>
                                </div>

                                <div className="cart-summary-row">
                                    <span>Shipping</span>
                                    <strong>Free</strong>
                                </div>

                                <div className="cart-summary-total">
                                    <span>Total</span>
                                    <strong>{formatPrice(cartTotal)}</strong>
                                </div>

                                <button
                                    type="button"
                                    className="cart-checkout-btn"
                                    onClick={() => navigate("/checkout")}
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/products"
                                    className="cart-return-link"
                                >
                                    Return to shop
                                </Link>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Cart;
