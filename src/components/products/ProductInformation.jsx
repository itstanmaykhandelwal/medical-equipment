import "./ProductInformation.css";

const ProductInformation = ({ product }) => {
    return (
        <section className="product-information-section">
            <div className="product-information-container">
                <h2 data-aos="fade-up" data-aos-duration="700">
                    Additional Information
                </h2>

                <p
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="100"
                >
                    {product?.additionalInformation ||
                        product?.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae mauris mollis, bibendum sem eget, tincidunt purus."}
                </p>
            </div>
        </section>
    );
};

export default ProductInformation;
