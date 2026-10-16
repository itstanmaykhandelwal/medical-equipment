import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductDetailSection from "../components/products/ProductDetail";
import ProductInformation from "../components/products/ProductInformation";
import RelatedProducts from "../components/products/RelatedProducts";


const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

const ProductDetailPage = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError("");
                setProduct(null);

                const [productResponse, productsResponse] = await Promise.all([
                    fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`, {
                        signal: controller.signal,
                    }),
                    fetch(`${API_URL}/api/products`, {
                        signal: controller.signal,
                    }),
                ]);

                const productData = await productResponse.json();
                const productsData = await productsResponse.json();

                if (
                    !productResponse.ok ||
                    !productData.success ||
                    !productData.product
                ) {
                    throw new Error(
                        productData.message || "Product not found.",
                    );
                }

                setProduct(productData.product);

                if (
                    productsResponse.ok &&
                    productsData.success &&
                    Array.isArray(productsData.products)
                ) {
                    setProducts(productsData.products);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Product detail API error:", err);
                    setError(err.message || "Product load nahi ho paaya.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProductData();

        return () => controller.abort();
    }, [id]);

    if (loading) {
        return (
            <main className="product-detail-section">
                <div className="product-detail-container">
                    <p role="status">Loading product...</p>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="product-detail-section">
                <div className="product-detail-container">
                    <h2>{error || "Product not found"}</h2>
                    <p>Please check the product link or try again later.</p>
                </div>
            </main>
        );
    }

    const currentProductId = String(product._id || product.id);

    return (
        <>
            <ProductDetailSection key={currentProductId} product={product} />

            <ProductInformation
                key={`information-${currentProductId}`}
                product={product}
            />

            <RelatedProducts
                products={products}
                currentProductId={currentProductId}
            />
        </>
    );
};

export default ProductDetailPage;
