import "./ProductCard.css";

const ProductCard = ({ product }) => {
    return (
        <div
            className="product-card-aos"
            data-aos="fade-up"
            data-aos-duration="700"
        >
            <article className="product-card">
                <div className="product-card-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-card-content">
                    <h2>{product.name}</h2>

                    <div className="product-card-price">
                        <span className="product-old-price">
                            ${product.oldPrice}
                        </span>

                        <span className="product-current-price">
                            ${product.price}
                        </span>
                    </div>

                    <button type="button" className="product-add-button">
                        ADD TO CART
                    </button>
                </div>
            </article>
        </div>
    );
};

export default ProductCard;
