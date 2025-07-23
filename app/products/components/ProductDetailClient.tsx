"use client";

import { getProductQuery } from "@/remote/products.query";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import z from "zod";

const ProductDetailClient = () => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail />
      </Suspense>
    </ErrorBoundary>
  );
};

const safeId = z.string();

const ProductDetail = () => {
  const { id } = useParams();
  const parsedId = safeId.parse(id);
  const { data: product } = useSuspenseQuery({
    ...getProductQuery(parsedId),
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="relative w-full h-120 bg-gray-100 mb-6">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="w-full h-auto object-cover rounded-lg"
              priority
              quality={100}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <div className="text-2xl font-semibold text-blue-600 mb-4">
            ₩{product.price}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
