import { useEffect, useState } from "react";
import ProductBanner from "../components/products/ProductBanner";
import ProductListing from "../components/products/ProductListing";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/api/products`, {
                    signal: controller.signal,
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load products.");
                }

                setProducts(Array.isArray(data.products) ? data.products : []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Products API error:", err);
                    setError("Products not loaded. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => controller.abort();
    }, []);

    return (
        <>
            <ProductBanner />

            <ProductListing
                products={products}
                loading={loading}
                error={error}
            />
        </>
    );
};

export default Products;
