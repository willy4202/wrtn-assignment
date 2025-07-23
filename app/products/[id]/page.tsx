import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProductQuery } from "@/remote/products.query";
import ProductDetailClient from "../components/ProductDetailClient";

import z from "zod";
import { notFound } from "next/navigation";
import { getProduct } from "@/remote/products.api";

const safeId = z.string();

const ProductPage = async ({ params }: { params: { id: string } }) => {
  try {
    await getProduct(params.id);
    const queryClient = new QueryClient();
    const parsedId = safeId.parse(params.id);
    await queryClient.prefetchQuery(getProductQuery(parsedId));

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl flex flex-col gap-4 mx-auto px-4 py-8">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductDetailClient />
          </HydrationBoundary>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      notFound();
    }

    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }

    // 다른 에러는 재throw
    throw error;
  }
};

export default ProductPage;
