import { useState } from "react";
import "./FeaturedProducts.css";

import thermometerImage from "../../assets/images/thermometers.png";
import microscopeImage from "../../assets/images/microscope.png";
import glasswareImage from "../../assets/images/glassware.png";
import wheelchairImage from "../../assets/images/wheelchair.png";

const products = [
    {
        id: 1,
        name: "Thermometers",
        oldPrice: "$75",
        price: "$50",
        image: thermometerImage,
        description:
            "High-quality digital thermometers designed for accurate and reliable temperature measurement in medical and healthcare environments.",
    },
    {
        id: 2,
        name: "Microscope",
        oldPrice: "$55",
        price: "$35",
        image: microscopeImage,
        description:
            "Reliable laboratory microscope designed for clear observation and accurate examination of medical and laboratory samples.",
    },
    {
        id: 3,
        name: "Cemical Glassware",
        oldPrice: "$75",
        price: "$45",
        image: glasswareImage,
        description:
            "Premium laboratory glassware suitable for a wide range of medical, scientific and laboratory applications.",
    },
    {
        id: 4,
        name: "Wheel Chair",
        oldPrice: "$100",
        price: "$50",
        image: wheelchairImage,
        description:
            "Comfortable and durable wheelchair designed to provide safe mobility and support for patients and users.",
    },
];

function FeaturedProducts() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const closeModal = () => {
        setSelectedProduct(null);
    };

    return (
        <>
            <section className="featured-products-section">
                <div className="featured-products-container">
                    <div
                        className="featured-products-heading"
                        data-aos="fade-up"
                        data-aos-duration="700"
                    >
                        <h2>Featured Product</h2>

                        <p
                            data-aos="fade-up"
                            data-aos-duration="700"
                            data-aos-delay="100"
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Ut elit tellus, luctus nec ullamcorper mattis,
                            pulvinar dapibus leo.
                        </p>
                    </div>

                    <div className="featured-products-grid">
                        {products.map((product, index) => (
                            <article
                                className="featured-product-card"
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                data-aos="fade-up"
                                data-aos-duration="700"
                                data-aos-delay={index * 80}
                            >
                                <div className="featured-product-image">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>

                                <div className="featured-product-content">
                                    <h3>{product.name}</h3>

                                    <div className="featured-product-price">
                                        <span className="old-price">
                                            {product.oldPrice}
                                        </span>

                                        <span className="current-price">
                                            {product.price}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="featured-product-button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedProduct(product);
                                        }}
                                    >
                                        ADD TO CART
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div
                        className="featured-products-action"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="150"
                    >
                        <button type="button" className="view-all-products">
                            VIEW ALL PRODUCT
                        </button>
                    </div>
                </div>
            </section>

            {selectedProduct && (
                <div className="product-modal-overlay" onClick={closeModal}>
                    <div
                        className="product-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="product-modal-close"
                            onClick={closeModal}
                            aria-label="Close product details"
                        >
                            ×
                        </button>

                        <div className="product-modal-image">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                            />
                        </div>

                        <div className="product-modal-content">
                            <h2>{selectedProduct.name}</h2>

                            <p>{selectedProduct.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FeaturedProducts;
