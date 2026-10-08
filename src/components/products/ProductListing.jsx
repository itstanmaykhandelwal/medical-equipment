import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductListing.css";

const ProductListing = ({ products }) => {
    const [sortBy, setSortBy] = useState("default");

    const sortedProducts = useMemo(() => {
        const items = [...products];

        if (sortBy === "price-low") {
            return items.sort((a, b) => a.price - b.price);
        }

        if (sortBy === "price-high") {
            return items.sort((a, b) => b.price - a.price);
        }

        if (sortBy === "name") {
            return items.sort((a, b) => a.name.localeCompare(b.name));
        }

        return items;
    }, [products, sortBy]);

    return (
        <section className="products-section">
            <div className="products-container">
                <div
                    className="products-topbar"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <p className="products-result-count">
                        Showing all {products.length} results
                    </p>

                    <select
                        className="products-sort"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option value="default">Default sorting</option>

                        <option value="price-low">
                            Sort by price: low to high
                        </option>

                        <option value="price-high">
                            Sort by price: high to low
                        </option>

                        <option value="name">Sort by name</option>
                    </select>
                </div>

                <div
                    className="products-grid"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="100"
                >
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductListing;
