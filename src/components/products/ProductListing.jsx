import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductListing.css";

const ProductListing = ({ products = [], loading = false, error = "" }) => {
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
                {loading ? (
                    <p role="status">Loading products...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : (
                    <>
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
                                onChange={(event) =>
                                    setSortBy(event.target.value)
                                }
                                aria-label="Sort products"
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

                        {sortedProducts.length > 0 ? (
                            <div
                                className="products-grid"
                                data-aos="fade-up"
                                data-aos-duration="700"
                                data-aos-delay="100"
                            >
                                {sortedProducts.map((product) => (
                                    <ProductCard
                                        key={product._id || product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No products found.</p>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductListing;
