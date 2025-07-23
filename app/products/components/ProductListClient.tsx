"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductsQuery } from "@/remote/products.query";
import { Suspense } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { ErrorBoundary } from "react-error-boundary";

const ProductListClient = () => {
  return (
    <ErrorBoundary fallback={<p>Error</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductList />
      </Suspense>
    </ErrorBoundary>
  );
};

const ProductList = () => {
  const { data: productList } = useSuspenseQuery({
    ...getProductsQuery,
  });

  return (
    <>
      {productList.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
};

export default ProductListClient;
