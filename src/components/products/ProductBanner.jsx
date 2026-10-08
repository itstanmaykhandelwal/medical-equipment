import "./ProductBanner.css";

const ProductBanner = () => {
    return (
        <section className="product-banner">
            <div className="product-banner-overlay"></div>

            <div className="product-banner-container">
                <h1 data-aos="fade-up" data-aos-duration="700">
                    Archives: Shop
                </h1>

                <div
                    className="product-breadcrumb"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="100"
                >
                    <span>Home</span>

                    <span className="product-breadcrumb-separator">–</span>

                    <span className="product-breadcrumb-current">Product</span>
                </div>
            </div>
        </section>
    );
};

export default ProductBanner;
