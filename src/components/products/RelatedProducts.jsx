import ProductCard from "./ProductCard";
import "./RelatedProducts.css";

const RelatedProducts = ({ products = [], currentProductId }) => {
    const currentId = String(currentProductId ?? "");

    const relatedProducts = products
        .filter((product) => String(product._id || product.id) !== currentId)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="related-products-section">
            <div className="related-products-container">
                <div
                    className="related-products-heading"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <h2>Related Products</h2>
                    <p>
                        Explore more products from our medical equipment
                        collection.
                    </p>
                </div>

                <div className="related-products-grid">
                    {relatedProducts.map((product, index) => (
                        <div
                            className="related-product-item"
                            key={product._id || product.id}
                            data-aos="fade-up"
                            data-aos-duration="700"
                            data-aos-delay={index * 80}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
