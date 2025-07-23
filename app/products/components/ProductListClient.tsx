"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductsQuery } from "@/remote/products.query";
import { Suspense } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { ErrorBoundary } from "react-error-boundary";

interface ProductListClientProps {
  initialData: Product[];
}

const ProductList = ({ initialData }: ProductListClientProps) => {
  const { data: productList } = useSuspenseQuery({
    ...getProductsQuery,
    initialData,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductListClient = ({ initialData }: ProductListClientProps) => {
  return (
    <ErrorBoundary fallback={<p>Error</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductList initialData={initialData} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProductListClient;
