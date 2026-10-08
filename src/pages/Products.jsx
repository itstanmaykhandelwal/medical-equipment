import ProductBanner from "../components/products/ProductBanner";
import ProductListing from "../components/products/ProductListing";

import { products } from "../data/products";

const Products = () => {
  return (
    <>
      <ProductBanner />

      <ProductListing products={products} />
    </>
  );
};

export default Products;