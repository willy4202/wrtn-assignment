import ProductListClient from "./components/ProductListClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProductsQuery } from "@/remote/products.query";

export const revalidate = 60;

const ProductsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getProductsQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl flex flex-col gap-4 mx-auto px-4 py-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductListClient />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default ProductsPage;
