import { getProducts } from "@/remote/products.api";
import ProductListClient from "./components/ProductListClient";

const ProductsPage = async () => {
  const initialProducts = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProductListClient initialData={initialProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
