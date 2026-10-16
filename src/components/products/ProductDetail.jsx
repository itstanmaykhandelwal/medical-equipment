import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeftRight,
    Truck,
    Headphones,
    ShieldCheck,
    Minus,
    Plus,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

const benefits = [
    {
        id: 1,
        icon: ArrowLeftRight,
        title: "14-Day Return",
    },
    {
        id: 2,
        icon: Truck,
        title: "Free Shipping",
    },
    {
        id: 3,
        icon: Headphones,
        title: "24/7 Support",
    },
    {
        id: 4,
        icon: ShieldCheck,
        title: "Safe Payment",
    },
];

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const ProductDetail = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeImage, setActiveImage] = useState("");

    const { addToCart } = useCart();

    const productImages = [
        ...new Set(
            [
                ...(Array.isArray(product?.images) ? product.images : []),
                product?.image,
            ].filter(
                (image) => typeof image === "string" && image.trim() !== "",
            ),
        ),
    ];

    useEffect(() => {
        setActiveImage(productImages[0] || "");
        setQuantity(1);
        setAddedToCart(false);
    }, [product?._id, product?.id, product?.slug]);

    if (!product) {
        return (
            <section className="product-detail-section">
                <div className="product-detail-container">
                    <h2>Product not found</h2>
                    <Link to="/products">Back to Products</Link>
                </div>
            </section>
        );
    }

    const formatPrice = (price) => {
        if (typeof price === "string" && price.startsWith("$")) {
            return price;
        }

        return `$${price}`;
    };

    const stock = Math.max(
        0,
        Number.isFinite(Number(product.stock))
            ? Math.floor(Number(product.stock))
            : 0,
    );

    const handleQuantityChange = (event) => {
        const value = Number(event.target.value);

        if (Number.isInteger(value) && value >= 1 && value <= stock) {
            setQuantity(value);
        }
    };

    const decreaseQuantity = () => {
        setQuantity((previous) => Math.max(1, previous - 1));
        setAddedToCart(false);
    };

    const increaseQuantity = () => {
        setQuantity((previous) => Math.min(stock, previous + 1));
        setAddedToCart(false);
    };

    const handleAddToCart = () => {
        if (stock < 1 || quantity < 1 || quantity > stock) {
            return;
        }

        if (onAddToCart) {
            onAddToCart(product, quantity);
        } else {
            addToCart(product, quantity);
        }

        setAddedToCart(true);
    };

    const oldPrice = Number(String(product.oldPrice ?? "").replace("$", ""));

    const currentPrice = Number(String(product.price ?? "").replace("$", ""));

    const getImageUrl = (image) => {
        if (!image) return "";

        if (/^(https?:\/\/|data:|blob:)/i.test(image)) {
            return image;
        }

        if (image.startsWith("/uploads/")) {
            return `${API_URL}${image}`;
        }

        if (image.startsWith("/")) {
            return image;
        }

        return `/images/${image}`;
    };

    return (
        <main className="product-detail-page">
            {/* Breadcrumb */}
            <section className="product-detail-breadcrumb">
                <div className="product-detail-breadcrumb-container">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Tools</Link>
                    <span>/</span>

                    <span className="product-detail-breadcrumb-current">
                        {product.name}
                    </span>
                </div>
            </section>

            {/* Product Details */}
            <section className="product-detail-section">
                <div className="product-detail-container">
                    <div className="product-detail-layout">
                        {/* Product Gallery */}
                        <div
                            className="product-detail-gallery"
                            data-aos="fade-up"
                            data-aos-duration="700"
                        >
                            <div className="product-detail-image">
                                {oldPrice > currentPrice && (
                                    <span className="product-detail-sale">
                                        Sale!
                                    </span>
                                )}

                                {activeImage ? (
                                    <img
                                        key={activeImage}
                                        src={getImageUrl(activeImage)}
                                        alt={product.name}
                                        fetchPriority="high"
                                        decoding="async"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null;
                                            event.currentTarget.style.visibility =
                                                "hidden";
                                        }}
                                    />
                                ) : (
                                    <div className="product-detail-image-placeholder">
                                        No image available
                                    </div>
                                )}
                            </div>

                            {productImages.length > 1 && (
                                <div
                                    className="product-detail-thumbnails"
                                    aria-label="Product images"
                                >
                                    {productImages.map((image, index) => (
                                        <button
                                            key={image}
                                            type="button"
                                            className={`product-detail-thumbnail ${
                                                activeImage === image
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveImage(image)
                                            }
                                            aria-label={`View product image ${index + 1}`}
                                            aria-pressed={activeImage === image}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`${product.name} view ${index + 1}`}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="product-detail-content">
                            <h1 data-aos="fade-up" data-aos-duration="700">
                                {product.name}
                            </h1>

                            <p
                                className="product-detail-description"
                                data-aos="fade-up"
                                data-aos-duration="700"
                                data-aos-delay="100"
                            >
                                {product.description ||
                                    "High-quality medical equipment designed to provide reliable performance and support healthcare professionals."}
                            </p>

                            <p className="product-detail-category">
                                <strong>Category</strong>{" "}
                                {product.category || "Tools"}
                            </p>

                            <div className="product-detail-prices">
                                {product.oldPrice != null && (
                                    <span className="product-detail-old-price">
                                        {formatPrice(product.oldPrice)}
                                    </span>
                                )}

                                <span className="product-detail-current-price">
                                    {formatPrice(product.price)}
                                </span>
                            </div>

                            <p className="product-detail-stock">
                                {stock} in stock
                            </p>

                            {/* Quantity Counter + Add to Cart */}
                            <div className="product-detail-actions">
                                <div
                                    className="product-detail-counter"
                                    aria-label="Product quantity"
                                >
                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={stock < 1 || quantity <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span aria-live="polite">{quantity}</span>

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={
                                            stock < 1 || quantity >= stock
                                        }
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    className="product-detail-add-button"
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={
                                        stock < 1 ||
                                        quantity < 1 ||
                                        quantity > stock
                                    }
                                >
                                    {stock < 1
                                        ? "OUT OF STOCK"
                                        : addedToCart
                                          ? "ADDED TO CART!"
                                          : "ADD TO CART"}
                                </button>
                            </div>

                            {/* Benefits */}
                            <div
                                className="product-detail-benefits"
                                data-aos="fade-up"
                                data-aos-duration="700"
                            >
                                {benefits.map((benefit) => {
                                    const Icon = benefit.icon;

                                    return (
                                        <div
                                            className="product-detail-benefit"
                                            key={benefit.id}
                                        >
                                            <span className="product-detail-benefit-icon">
                                                <Icon
                                                    size={20}
                                                    strokeWidth={1.5}
                                                />
                                            </span>

                                            <span className="product-detail-benefit-title">
                                                {benefit.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductDetail;
