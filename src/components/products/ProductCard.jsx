import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    if (!product) return null;

    const productId = product._id || product.id;
    const productPath = `/product/${product.slug || productId}`;

    const imagePath =
        (Array.isArray(product.images) && product.images[0]) ||
        product.image ||
        "";

    const imageSrc = imagePath
        ? /^https?:\/\//i.test(imagePath)
            ? imagePath
            : imagePath.startsWith("/uploads/")
              ? `${API_URL}${imagePath}`
              : imagePath.startsWith("/")
                ? imagePath
                : `/images/${imagePath}`
        : "";

    const handleViewProduct = () => {
        if (!productId) {
            console.error("Cannot open product: product ID is missing.");
            return;
        }

        navigate(productPath);
    };

    const handleAddToCart = (event) => {
        event.stopPropagation();

        if (!productId || Number(product.stock) === 0) return;

        addToCart(product, 1);
        setAddedToCart(true);
    };

    const handleProductKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleViewProduct();
        }
    };

    return (
        <div
            className="product-card-aos"
            data-aos="fade-up"
            data-aos-duration="700"
        >
            <article className="product-card">
                <div
                    className="product-card-image"
                    onClick={handleViewProduct}
                    onKeyDown={handleProductKeyDown}
                    role="link"
                    tabIndex={0}
                    aria-label={`View ${product.name}`}
                >
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                                event.currentTarget.style.visibility = "hidden";
                            }}
                        />
                    ) : (
                        <span>No image available</span>
                    )}
                </div>

                <div className="product-card-content">
                    <h2
                        onClick={handleViewProduct}
                        onKeyDown={handleProductKeyDown}
                        role="link"
                        tabIndex={0}
                    >
                        {product.name}
                    </h2>

                    <div className="product-card-price">
                        {product.oldPrice != null && (
                            <span className="product-old-price">
                                ${product.oldPrice}
                            </span>
                        )}

                        <span className="product-current-price">
                            ${product.price}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="product-add-button"
                        onClick={handleAddToCart}
                        aria-label={`Add ${product.name} to cart`}
                        disabled={Number(product.stock) === 0}
                    >
                        {Number(product.stock) === 0 ? (
                            "OUT OF STOCK"
                        ) : addedToCart ? (
                            <>
                                <Check size={17} />
                                ADDED TO CART
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={17} />
                                ADD TO CART
                            </>
                        )}
                    </button>
                </div>
            </article>
        </div>
    );
};

export default ProductCard;
